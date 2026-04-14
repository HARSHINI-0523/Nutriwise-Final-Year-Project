import React, { useState } from "react";
import { useAuth } from "../../contexts/UserLoginContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import "./UploadReport.css";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const reportTypes = [
  "Complete Blood Count (CBC)",
  "Urine Routine / Urinalysis",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT / RFT)",
  "Lipid Profile",
  "Thyroid Panel (TSH, T3, T4)",
  "Blood Glucose Profile",
  "Electrolyte Panel",
  "Vitamin Panel (B12, D3, etc.)",
  "Hormone Panel",
  "Infection Markers (CRP, ESR, etc.)",
  "Coagulation Profile (PT, INR, aPTT)",
  "Iron Studies",
  "Imaging Report (X-Ray / MRI / CT)",
  "Genetic or Speciality Test Report"
];


const UploadReport = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit.", "error");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast("You must be logged in", "error");
      return;
    }

    if (!file) {
      showToast("Please select a file", "error");
      return;
    }

    setIsLoading(true);

    try {
      // --- 1️⃣ Upload file ---
      const formData = new FormData();
      formData.append("file", file); // filename passes automatically
      formData.append("reportType", reportType);

      const uploadRes = await api.post("/reports/upload", formData);
      const reportId = uploadRes.data.report._id;

      showToast("Report uploaded. Processing analysis...", "success");

      // --- 2️⃣ Trigger analysis ---
      await api.get(`/lab-analysis/process/${reportId}`);

      showToast("Analysis completed!", "success");

      // --- 3️⃣ Fetch final report object from DB ---
      const finalReportRes = await api.get(`/reports/${reportId}`);
      const finalReport = finalReportRes.data;

      // --- 4️⃣ Navigate to ReportViewer ---
      navigate(`/myreports/view/${reportId}`, { state: finalReport });

    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.msg || "Upload or analysis failed",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-report-container">
      <h2 className="upload-report-header">Upload Medical Report</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <div className="form-group">
          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            disabled={isLoading}
          >
            {reportTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select File (Max 5MB)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {file && <p className="file-info">{file.name}</p>}
        </div>

        <button
          type="submit"
          className="report-upload-btn"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Upload & Analyze"}
        </button>
      </form>
    </div>
  );
};

export default UploadReport;
