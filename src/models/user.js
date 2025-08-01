const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    age: {
      type: Number,
    },
    gender: { type: String },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/05/03/09/16/rooster-7967053_640.jpg",
    },
    about: { type: String, default: "this is a default about user!" },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
