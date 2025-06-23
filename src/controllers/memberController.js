import memberService from "../services/memberService.js";

const getAllMembers = async (req, res) => {
  try {
    const members = await memberService.getAllMembers();
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await memberService.getMemberById(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const updatedMember = await memberService.updateMember(
      req.params.id,
      req.body
    );
    if (!updatedMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Member updated successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message, errors: error.errors });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const result = await memberService.deleteMember(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllMembers, getMemberById, updateMember, deleteMember };
