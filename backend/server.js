import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import passport from "passport";
import "./config/passport.js";
import auth from "./routes/auth.js"
import "./models/User.js";
import axios from "axios";
import personalInfoRoutes from "./routes/personalInfo.js";
import WorkExperienceRoutes from "./routes/workExperience.js";
import educationRoutes from "./routes/education.js";
import skillsRoutes from "./routes/skills.js";
import projectsRoutes from "./routes/projects.js";
import achievementsRoutes from "./routes/achievements.js";
import certificationsRoutes from "./routes/certifications.js";
import resumeRoutes from "./routes/resume.js";

dotenv.config();

const app = express();

const MongoDBStoreSession = MongoDBStore(session);
const store = new MongoDBStoreSession({
    uri: process.env.MONGO_URI,
    collection: "sessions",
    expires: 1000 * 60 * 60 * 24,
});

store.on("error", (error) => {
    console.error("SESSION STORE ERROR:", error);
});

app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            secure: true,
            sameSite: 'none',
            httpOnly: true,
            path: '/',
        },                       
        name: 'resume.builder.sid'
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/personal-info", personalInfoRoutes);
app.use("/api/work-experience", WorkExperienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/auth", auth);
app.use("/api/resume", resumeRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => console.log("MongoDB Connection Failed:", err));

app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: {
                name: req.user.name,
                picture: req.user.picture,
            },
        });
    } else {
        res.json({ isAuthenticated: false, user: null });
    }
});

app.post("/api/generate-resume", async (req, res) => {
    const { userQuery } = req.body;
    if (!userQuery) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Google API key is missing" });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${apiKey}`,
            {
                contents: [{ role: "user", parts: [{ text: userQuery }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const generatedText = response.data.candidates[0]?.content.parts[0]?.text || "No response generated.";

        res.json({ aiResponse: generatedText });
    } catch (error) {
        console.error("Error generating AI response:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


