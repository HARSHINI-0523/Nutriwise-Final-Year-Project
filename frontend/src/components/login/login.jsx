import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
//Contexts
import { useAuth } from "../../contexts/UserLoginContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast(); //toast context

  // Use the authentication functions from the context
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { email, password, confirmPassword, name } = formData;

    try {
      if (isLogin) {
        // Attempt Sign In
        await signIn(email, password);
        // Navigation handled inside context on success
        navigate("/profile");
        showToast("Login successful!", "success");
      } else {
        // Attempt Sign Up
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const res = await signUp(email, password, name);

        navigate("/verify-email", {
          state: { userId: res.userId },
        });
        // verify email step
       // navigate("/user-details-form");
        showToast("Account created successfully!", "success");
      }
    } catch (err) {
      console.error("Auth process error:", err.message);
      // Display error message from the API or local validation
      showToast(err.message || "An unknown error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>
            {isLogin
              ? "Sign in to your NutriWise account"
              : "Join thousands of users transforming their health"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Full Name field for Sign Up */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </div>

          {/* Confirm Password field for Sign Up */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Remember Me and Forgot Password for Sign In */}
          {isLogin && (
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">
                Forgot Password?
              </a>
            </div>
          )}

          {/* Submission Button */}
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Google Sign In Button */}
        <div className="social-login">
          <button
            className="social-btn google-btn"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Switch between Sign In and Sign Up */}
        <div className="login-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              disabled={isSubmitting}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
