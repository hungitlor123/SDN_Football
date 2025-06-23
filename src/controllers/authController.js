import { authService } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const member = await authService.registerMember(req.body);

    res.status(201).json({
      success: true,
      message: "Member registered successfully",
      data: member,
    });
  } catch (error) {
    if (error.message === "Member already exists") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.loginMember(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ success: false, message: error.message });
    }
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};
