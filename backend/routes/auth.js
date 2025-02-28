import express from 'express';
import passport from 'passport';

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        // Agar error critical ho, to aap error page ya failureRedirect de sakti hain.
      }
      res.redirect(`${FRONTEND_URL}/dashboard`);
    });
  }
);

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: req.user,
      userID: req.user.userID,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("resume.builder.sid", { path: "/" });
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
