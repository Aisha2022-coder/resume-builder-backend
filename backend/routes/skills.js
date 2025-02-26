import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userID, skills } = req.body;

  if (!userID || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "UserID and at least one skill are required!" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userID },
      { $set: { skills } },
      { new: true, upsert: true }
    );

    res.json({ message: "Skills saved successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error saving skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

