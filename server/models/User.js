import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    name: { type: String, minlength: 3, maxlength: 30 },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    phoneNumber: String,
    viewedProfile: Number,
    impressions: Number,
    otp: {
      type: Number,
      required: true,
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

// Add a pre-save hook to set the 'name' field before saving
UserSchema.pre("save", function (next) {
  // Combine 'firstName' and 'lastName' to create the 'name'
  this.name = `${this.firstName} ${this.lastName}`;
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
