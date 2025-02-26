import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { userID, education } = req.body;

    if (!userID || !Array.isArray(education) || education.length === 0) {
        return res.status(400).json({ error: "UserID and at least one education entry are required!" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userID },
            { $set: { education } },
            { new: true, upsert: true }
        );
        res.json({ message: "Education saved successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error saving education:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
