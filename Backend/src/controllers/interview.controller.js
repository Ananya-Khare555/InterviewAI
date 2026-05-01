const prisma = require("../config/database");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

const mammoth = require("mammoth");
// 🔹 Create Interview Report
const { generateInterviewReport } = require("../services/ai.service");
const { generateResumePdf } = require("../services/ai.service");

exports.createReport = async (req, res) => {
  try {

    const { jobDescription, selfDescription } = req.body;

    let resume = "";

    // ✅ PARSE FILE
    if (req.file) {
      const pdfModule = require("pdf-parse");
      const pdfParse = pdfModule.default || pdfModule;
      const mammoth = require("mammoth");

      const fileType = req.file.mimetype;

      try {
        if (fileType === "application/pdf") {
          const data = await pdfParse(req.file.buffer);
          resume = data.text;
        } else if (
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({
            buffer: req.file.buffer,
          });
          resume = result.value;
        }
      } catch (err) {
        console.log("Resume parsing error:", err);
      }
    }

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description required" });
    }

    // ✅ COMBINE PROFILE (important for AI quality)
    const profile = `
${resume ? "Resume:\n" + resume : ""}
${selfDescription ? "\nSelf Description:\n" + selfDescription : ""}
`;

    const aiData = await generateInterviewReport({
      resume: profile,
      selfDescription: "",
      jobDescription
    });

    // ✅ STORE EVERYTHING
    const report = await prisma.interviewReport.create({
      data: {
        userId: req.user.userId,
        score: aiData.matchScore,
        feedback: JSON.stringify(aiData),

        // 🔥 THIS IS THE MAIN FIX
        resumeText: resume,
        selfDescription,
        jobDescription
      }
    });

    res.status(201).json({
      interviewReport: {
        id: report.id,
        ...aiData
      }
    });

  } catch (error) {
    console.log("CREATE REPORT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get All Reports of Logged-in User
exports.getUserReports = async (req, res) => {
  try {

    const reports = await prisma.interviewReport.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" }
    });

    const parsedReports = reports.map(r => {
  let data = {};

  try {
    data = JSON.parse(r.feedback || "{}");
  } catch (err) {
    console.error("Invalid JSON in report ID:", r.id);
    data = {};
  }

  return {
    id: r.id,
    createdAt: r.createdAt,
    score: r.score,
    ...data
  };
});

    res.json({
      interviewReports: parsedReports
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Get Single Report
exports.getReportById = async (req, res) => {
  try {

    const { id } = req.params;

    const report = await prisma.interviewReport.findUnique({
      where: { id: parseInt(id) }
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    let data = {};

try {
  data = JSON.parse(report.feedback || "{}");
} catch (err) {
  console.error("JSON PARSE ERROR:", report.feedback);
}

    res.json({
      interviewReport: {
        id: report.id,
        score: report.score,
        ...data
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Delete Report
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.interviewReport.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: "Report deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.generateResumePdf = async (req, res) => {
  try {

    const { id } = req.params;

    const report = await prisma.interviewReport.findUnique({
      where: { id: parseInt(id) }
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // ✅ USE STORED DATA
    const pdfBuffer = await generateResumePdf({
      resume: report.resumeText || "",
      selfDescription: report.selfDescription || "",
      jobDescription: report.jobDescription || ""
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${id}.pdf`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.log("PDF ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};