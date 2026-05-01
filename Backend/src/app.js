const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/auth.routes")
const interviewRoutes = require("./routes/interview.routes")

const app = express()

app.use(cors({
  origin: ["http://localhost:5173", // frontend URL
  "https://interviewai-1-czle.onrender.com"],
  credentials: true
}));
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/interviews", interviewRoutes)

module.exports = app