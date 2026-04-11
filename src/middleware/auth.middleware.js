const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  try {
    // 1. token
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("Headers:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      console.log(" No token found");
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // 2. verify  token
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    // 3.   user
    req.user = await User.findById(decoded.id).select("-password");
    console.log("User:", req.user);

    if (!req.user) {
      console.log(" User not found in DB");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(" Auth successful");
    next();
  } catch (error) {
    console.log(" Auth Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

module.exports = { protect };
