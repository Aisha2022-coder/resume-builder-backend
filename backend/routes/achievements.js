import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userID, achievements } = req.body;

  if (!userID || !Array.isArray(achievements) || achievements.length === 0) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userID },
      { $set: { achievements } },
      { new: true, upsert: true }
    );
    res.json({ message: "Achievements saved successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error saving achievements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
