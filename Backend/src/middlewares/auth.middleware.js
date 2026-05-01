const jwt = require("jsonwebtoken")
const prisma = require("../config/database");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    // 🔹 Check blacklist
    const blacklisted = await prisma.blacklistToken.findFirst({
      where: { token }
    })

    if (blacklisted) {
      return res.status(401).json({ message: "Token is invalid" })
    }

    // 🔹 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded  // contains { userId }

    next()

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}