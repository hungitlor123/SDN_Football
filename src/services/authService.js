import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Member from "../models/member.js";

export const authService = {
  async registerMember(memberData) {
    const { membername, password, name, YOB, isAdmin } = memberData;

    const existingMember = await Member.findOne({ membername });
    if (existingMember) {
      throw new Error("Username already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newMember = new Member({
      membername,
      password: hashedPassword,
      name,
      YOB,
      isAdmin: isAdmin || false,
    });

    await newMember.save();

    return {
      id: newMember._id,
      membername: newMember.membername,
      name: newMember.name,
      YOB: newMember.YOB,
      isAdmin: newMember.isAdmin,
    };
  },

  async loginMember(credentials) {
    const { membername, password } = credentials;

    const member = await Member.findOne({ membername });
    if (!member) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: member._id,
        membername: member.membername,
        isAdmin: member.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      member: {
        id: member._id,
        membername: member.membername,
        name: member.name,
        YOB: member.YOB,
        isAdmin: member.isAdmin,
      },
    };
  },

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      const member = await Member.findById(decoded.id);
      if (!member) {
        return {
          success: false,
          statusCode: 401,
          message: "Token không hợp lệ - không tìm thấy thành viên",
        };
      }

      return {
        success: true,
        user: {
          _id: member._id,
          membername: member.membername,
          name: member.name,
          YOB: member.YOB,
          isAdmin: member.isAdmin,
          role: member.isAdmin ? "admin" : "member",
        },
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return {
          success: false,
          statusCode: 401,
          message: "Token đã hết hạn, vui lòng đăng nhập lại",
        };
      }

      return {
        success: false,
        statusCode: 403,
        message: "Token không hợp lệ",
      };
    }
  },
};
