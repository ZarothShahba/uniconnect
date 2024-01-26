import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    console.log("🚀 ~ searchUsers ~ query:", query);
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } }, // Case-insensitive search for first name
        { lastName: { $regex: query, $options: "i" } }, // Case-insensitive search for last name
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      password,
      firstName,
      lastName,
      occupation,
      location,
      socialHandles,
    } = req.body;

    const user = await User.findById(id);

    // Conditionally update the password if provided
    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    // Update social handles if provided
    if (socialHandles) {
      user.socialHandles = socialHandles;
    }

    // Rest of the profile update logic...

    await user.save();

    // Exclude password field when sending user information back to frontend
    const userWithoutPassword = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      socialHandles: user.socialHandles,
      // Include other fields you want to send...
    };

    res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      //delete the associated posts as well
      await Post.deleteMany({ userId: user._id });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
