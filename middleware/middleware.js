import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust the path based on your project structure

// Authentication Middleware
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or user does not exist." });
    }

    // Attach user to the request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed." });
  }
};
