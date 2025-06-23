import { authService } from "../services/authService.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có token xác thực, vui lòng đăng nhập",
      });
    }

    const result = await authService.verifyToken(token);

    if (!result.success) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    req.user = result.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};

// Session-based authentication middleware for web interface
export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  req.user = req.session.user;
  next();
};

// Check if user is authenticated (for conditional rendering)
export const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa được xác thực, vui lòng đăng nhập",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập tài nguyên này",
      });
    }

    next();
  };
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Cần quyền quản trị viên",
    });
  }
  next();
};

export const checkOwnership = (req, res, next) => {
  const targetMemberId = req.params.id || req.params.memberId;

  if (req.user.isAdmin || req.user._id.toString() === targetMemberId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Bạn chỉ có thể chỉnh sửa thông tin của chính mình",
    });
  }
};

export const requireMember = (req, res, next) => {
  if (!req.user || req.user.isAdmin) {
    // Nếu là admin hoặc chưa đăng nhập thì không cho feedback
    return res.status(403).render("error", {
      title: "Forbidden",
      message: "Only members can give feedback.",
      error: "You must be a member (not admin) to comment or rate players.",
    });
  }
  next();
};

export { protect, authorize };
export const authenticateToken = protect;
