import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserLoginContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import "./MyReports.css";
import api from "../../api/axios.js";

const MyReports = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      // // Check if user is logged in
      // if (!currentUser || !currentUser.token) {
      //   setIsLoading(false);
      //   setError("You must be logged in to view your reports.");
      //   return;
      // }
      // if (!currentUser) {
      //   showToast("You must be logged in", "error");
      //   return;
      // }

      try {
        const res = await api.get("/reports/me");
        setReports(res.data);
      } catch (err) {
        showToast(
          err.response?.data?.message || "Failed to load reports",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [currentUser, showToast]);

  if (isLoading) {
    return <div className="loading-container">Loading your reports...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (reports.length === 0) {
    return (
      <div className="no-reports-container">
        <h2>My Reports</h2>
        <p>You haven't uploaded any reports yet.</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h2>My Reports</h2>
      <div className="reports-list">
        {reports.map((report) => (
          <div key={report._id} className="report-card">
            <div className="report-header">
              <h3 className="report-title">{report.reportType}</h3>
              <span className="report-type">{report.reportType}</span>
            </div>
            <p className="report-date">
              Uploaded on: {new Date(report.createdAt).toLocaleDateString()}
            </p>
            <button
              className="report-link"
              onClick={() =>
                navigate(`/myreports/view/${report._id}`, { state: report })
              }
            >
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReports;
