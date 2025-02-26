import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  userID: { type: String, unique: true },
  name: String,
  email: String,
  picture: String,
  PersonalInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    professionalSummary: String,
  },
  workExperience: [
    {
      position: String,
      company: String,
      duration: String,
      description: String,
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String,
      grade: String,
    }
  ],
  skills: {
    skills: [String],
  },
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      link: String,
      date: String,
    }
  ],
  achievements: {
    achievements: [String],
  },
  certifications: [
    {
      title: String,
      provider: String,
      issueDate: String,
      certificateUrl: String,
    }
  ],
});

export default mongoose.model("User", UserSchema);
