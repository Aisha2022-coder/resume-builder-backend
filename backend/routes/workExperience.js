import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { userID, workExperience } = req.body;

    if (!userID || !Array.isArray(workExperience) || workExperience.length === 0) {
        return res.status(400).json({ error: "UserID and at least one work experience entry are required!" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userID },
            { $set: { workExperience } },
            { new: true, upsert: true }
        );
        res.json({ message: "Work experiences saved successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error saving work experiences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

