import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("PersonalInfo");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userID, name, email, phone, address, professionalSummary } = req.body;

    if (!userID || !name || !email || !phone || !address || !professionalSummary) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userID },
      { $set: { PersonalInfo: { name, email, phone, address, professionalSummary } } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Personal info saved successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error saving personal info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

