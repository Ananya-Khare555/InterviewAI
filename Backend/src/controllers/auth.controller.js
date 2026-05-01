const prisma = require("../config/database");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// 🔹 Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// 🔹 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// 🔹 Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    })

    res.json({
  user
})

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]

    await prisma.blacklistToken.create({
      data: { token }
    })

    res.json({ message: "Logged out successfully" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}