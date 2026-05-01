import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {

  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports
  } = context;

  // ✅ GENERATE REPORT
  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile
      });

      if (!response) return null;

      setReport(response.interviewReport || null);
      return response.interviewReport || null;

    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET SINGLE REPORT
  const getReportById = async (id) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(id);

      if (!response) {
        setReport(null);
        return null;
      }

      setReport(response.interviewReport || null);
      return response.interviewReport || null;

    } catch (error) {
      console.log(error);
      setReport(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET ALL REPORTS
  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      if (!response) {
        setReports([]);
        return [];
      }

      const safeReports = response.interviewReports || [];

      setReports(safeReports);
      return safeReports;

    } catch (error) {
      console.log(error);
      setReports([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ✅ DOWNLOAD PDF
  const getResumePdf = async (interviewReportId) => {
    setLoading(true);

    try {
      const response = await generateResumePdf({ interviewReportId });

      if (!response) return;

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ EFFECT
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf
  };
};