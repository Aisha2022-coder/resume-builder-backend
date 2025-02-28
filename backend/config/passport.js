import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            userID: uuidv4(),
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
