import express from 'express';
import passport from 'passport';

const router = express.Router();

app.use('/api', router);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("http://localhost:3000/dashboard");
    }
);

router.get("/auth/user", (req, res) => {
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
            res.clearCookie("connect.sid", { path: "/" });
            return res.status(200).json({ message: "Logged out successfully" });
        });
    });
});

export default router;