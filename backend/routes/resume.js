import express from "express";
import User from "../models/User.js";

const router = express.Router();
router.get("/:userID", async (req, res) => {
    try {
        const user = await User.findOne({ userID: req.params.userID });

        if (!user) {
            return res.status(404).json({ error: "User not found in database" });
        }

        res.json({
            name: user.PersonalInfo?.name || "",
            email: user.PersonalInfo?.email || "",
            phone: user.PersonalInfo?.phone || "",
            address: user.PersonalInfo?.address || "",
            professionalSummary: user.PersonalInfo?.professionalSummary || "",
            workExperience: user.workExperience || [],
            education: user.education || [],
            skills: user.skills || [],  // 
            projects: user.projects || [],
            achievements: user.achievements || [],
            certifications: user.certifications || [],
        });
    } catch (error) {
        console.error("Error fetching resume data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
