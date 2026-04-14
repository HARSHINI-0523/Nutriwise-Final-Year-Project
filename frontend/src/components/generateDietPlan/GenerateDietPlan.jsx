import { useEffect, useState } from "react";
import { generateDietPlan, getUserLabReports } from "../../services/dietService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/UserLoginContext";
import "./GenerateDietPlan.css";

export default function GenerateDietPlan() {
  const { currentUser, authResolved } = useAuth();

  const [labReports, setLabReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authResolved || !currentUser) return;

    getUserLabReports()
      .then((data) => setLabReports(data))
      .catch((err) => console.error(err));
  }, [authResolved, currentUser]);

  const handleGenerate = async () => {
    if (!selectedReport) {
      alert("Select a lab report");
      return;
    }

    try {
      setLoading(true);

      await generateDietPlan({
        labReportId: selectedReport,
      });

      alert("Diet plan generated successfully!");
      navigate("/diet-plans/weekly");
    } catch (err) {
      console.error(err);
      alert("Failed to generate diet plan");
    } finally {
      setLoading(false);
    }
  };

  if (!authResolved) {
    return <div>Loading user session...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to generate a diet plan.</div>;
  }

  return (
    <div className="diet-container">
      <div className="diet-card">
        <h2>Generate Diet Plan</h2>

        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Lab Report</option>

          {labReports.map((report) => (
            <option key={report._id} value={report._id}>
              {report.title} {/* ✅ FIXED */}
            </option>
          ))}
        </select>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Diet Plan"}
        </button>
      </div>
    </div>
  );
}
