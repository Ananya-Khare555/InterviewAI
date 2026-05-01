const express = require("express");
const router = express.Router();

const controller = require("../controllers/interview.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

// ✅ CREATE REPORT
router.post("/", authMiddleware, upload.single("resume"), controller.createReport);

// ✅ GET ALL REPORTS (THIS FIXES YOUR ERROR)
router.get("/", authMiddleware, controller.getUserReports);

// ✅ GET SINGLE REPORT
router.get("/:id", authMiddleware, controller.getReportById);

// ✅ DELETE
router.delete("/:id", authMiddleware, controller.deleteReport);

// ✅ GENERATE PDF
router.post("/resume/pdf/:id", authMiddleware, controller.generateResumePdf);

module.exports = router;