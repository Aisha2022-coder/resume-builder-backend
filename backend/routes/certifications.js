import express from "express";
import User from "../models/User.js";

const router = express.Router();
router.post("/", async (req, res) => {

  const { userID, certifications } = req.body;

  if (!userID || !Array.isArray(certifications) || certifications.length === 0) {
    return res.status(400).json({ error: "UserID and at least certifications entry are required!" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userID },
      { $set: { certifications } },
      { new: true, upsert: true }
    );
    res.json({ message: "Certifications saved successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error saving certifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
