import Members from "../models/member.js";
import bcrypt from "bcrypt";

const getAllMembers = async () => {
  try {
    const members = await Members.find().select("-password");
    return members;
  } catch (error) {
    throw error;
  }
};

const getMemberById = async (memberId, withPassword = false) => {
  try {
    if (withPassword) {
      return await Members.findById(memberId);
    }
    return await Members.findById(memberId).select("-password");
  } catch (error) {
    throw error;
  }
};

const updateMember = async (memberId, memberData) => {
  try {
    if (memberData.password) {
      const saltRounds = 10;
      memberData.password = await bcrypt.hash(memberData.password, saltRounds);
    }

    const updatedMember = await Members.findByIdAndUpdate(
      memberId,
      memberData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    return updatedMember;
  } catch (error) {
    throw error;
  }
};

const deleteMember = async (memberId) => {
  try {
    const deletedMember = await Members.findByIdAndDelete(memberId);
    return deletedMember;
  } catch (error) {
    throw error;
  }
};

export default {
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
