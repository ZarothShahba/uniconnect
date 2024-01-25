import asyncHandler from "../middleware/asyncHandler.js";
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Get token from model, create cookies and send response
const sendTokenResponse = (user, statusCode, res, data) => {
  // Create token
  const token = user.getSignedJwtToken();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, data });
};

// @desc    Create a user
// @route   POST /api/v1/auth/register
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  // Hide the password
  user.password = undefined;

  sendTokenResponse(user, 200, res, {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

// @desc    Generate an OTP token and send it to the email provided
// @route   POST /api/v1/auth/otp
// @access  Public
export const sendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse("Email is required", 400));
  }

  // Generate OTP
  const userOTP = new OTP({ email });
  userOTP.generateOTP();

  // Save OTP to the database
  await userOTP.save();

  // Send OTP to the user's email

  const emailMessage = `Your OTP is: ${userOTP.otp}. Please use it to verify your email.`;

  try {
    await sendEmail({
      email,
      subject: "OTP for UniConnect registation",
      message: emailMessage,
    });

    res.status(200).json({ success: true, data: "OTP sent" });
  } catch (err) {
    console.error(err);
    await OTP.deleteOne({ email: userOTP.email });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Create a user
// @route   POST /api/v1/auth/login
// @access  Private/Admin
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validating email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res, {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

// @desc    Logout
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
