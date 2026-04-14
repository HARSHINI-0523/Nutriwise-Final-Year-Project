import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserLoginContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { userId, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [labCount, setLabCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const [detailsRes, reportsRes] = await Promise.all([
          api.get(`/user-details/${userId}`),
          api.get(`/reports/${userId}`),
        ]);

        setDetails(detailsRes.data);
        setLabCount(reportsRes.data?.length || 0);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) loadProfile();
    else setLoading(false);
  }, [userId, isAuthenticated]);

  if (loading) return <p className="profile-loading">Loading Profile...</p>;

  if (!isAuthenticated)
    return <h2 className="profile-login-msg">Please log in to view profile.</h2>;

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Header */}
        <div className="profile-header">
          <img
            src={
              details?.photo ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(currentUser?.name || "User")
            }
            alt="Profile"
            className="profile-photo"
          />

          <div>
            <h2>{currentUser?.name}</h2>
            <p className="profile-email">{currentUser?.email}</p>
            <p className="joined-date">
              Joined {new Date(currentUser?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="profile-section">
          <h3>Bio</h3>
          <p>{details?.bio || "No bio added yet."}</p>
        </div>

        {/* Health Goal */}
        <div className="profile-section">
          <h3>Health Goal</h3>
          <p>{details?.healthGoal || "No health goal specified."}</p>
        </div>

        {/* Lab Upload Stats */}
        <div className="profile-stats">
          <div className="stat-box">
            <h3>{labCount}</h3>
            <p>Lab Reports Uploaded</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="profile-actions">
          <button
            className="edit-btn"
            onClick={() => navigate("/user-details-form")}
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
