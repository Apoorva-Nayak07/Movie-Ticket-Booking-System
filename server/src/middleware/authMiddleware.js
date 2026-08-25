const jwt = require("jsonwebtoken");

const env = require("../config/env");

function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authorization.substring(7);

    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}

module.exports = {
  authenticate,
};