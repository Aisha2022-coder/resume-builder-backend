import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userID, projects } = req.body;

  if (!userID || !Array.isArray(projects) || projects.length === 0) {
    return res.status(400).json({ error: "UserID and at least one projects entry are required!" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userID },
      { $set: { projects } },
      { new: true, upsert: true }
    );
    res.json({ message: "Projects saved successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error saving projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
