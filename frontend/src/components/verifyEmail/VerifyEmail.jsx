import { verifyEmailOTP } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/UserLoginContext";
import { useState } from "react";
import "./VerifyEmail.css";
const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { completeLogin } = useAuth(); 

  if (!location.state?.userId) {
    navigate("/signup");
    return null;
  }

  const verifyOTP = async () => {
    try {
      const res = await verifyEmailOTP(location.state.userId, otp);

      completeLogin(res.data);

      showToast("Email verified & logged in 🎉", "success");
      navigate("/profile");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Invalid or expired OTP",
        "error"
      );
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>Verify Your Email</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
        />

        <button onClick={verifyOTP}>Verify & Continue</button>
      </div>
    </div>
  );
};

export default VerifyEmail;
