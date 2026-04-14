import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/UserLoginContext";
import { useToast } from "../../contexts/ToastContext";
import { Link } from "react-router-dom";
import CalendarStreak from "./CalendarStreak";
import "./challenges.css";

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [leaderboard, setLeaderboard] = useState({});
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileMissing, setProfileMissing] = useState(false);
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [challengesRes, leaderboardRes, historyRes] = await Promise.all([
                api.get("/challenges"),
                api.get("/challenges/social/leaderboard"),
                api.get("/challenges/history")
            ]);

            setChallenges(challengesRes.data);
            setLeaderboard(leaderboardRes.data);
            setHistory(historyRes.data.dates);
        } catch (error) {
            if (error.response?.data?.error === "PROFILE_MISSING") {
                setProfileMissing(true);
            } else {
                console.error("Error fetching data:", error);
                showToast("Failed to load challenges", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (challengeId) => {
        try {
            await api.post(`/challenges/${challengeId}/join`);

            setChallenges((prev) =>
                prev.map((c) =>
                    c._id === challengeId ? { ...c, joined: true } : c
                )
            );
            showToast("Challenge Joined! Go crush it! 🚀", "success");
        } catch (error) {
            console.error("Error joining challenge:", error);
            showToast(error.response?.data?.message || "Failed to join", "error");
        }
    };

    const handleComplete = async (challengeId) => {
        try {
            await api.patch(`/challenges/${challengeId}/complete`);

            setChallenges((prev) => {
                const updated = prev.map((c) =>
                    c._id === challengeId ? { ...c, completed: true } : c
                );

                // Check if all 5 are now completed
                const completedCount = updated.filter(c => c.completed).length;

                // Update history locally ONLY if we just hit 5 completions
                if (completedCount >= 5) {
                    const today = new Date().toISOString().split('T')[0];
                    if (!history.includes(today)) {
                        setHistory(prevHistory => [...prevHistory, today]);
                    }
                }

                return updated;
            });

            showToast("Challenge completed! +10 Points 🎉", "success");
        } catch (error) {
            console.error("Error completing challenge:", error);
            showToast(error.response?.data?.message || "Failed to complete challenge", "error");
        }
    };

    if (loading) return (
        <div className="challenges-loading">
            <div className="spinner"></div>
            <p>Loading your mission...</p>
        </div>
    );

    if (profileMissing) {
        return (
            <div className="challenges-container">
                <div className="no-challenges">
                    <h2>Profile Incomplete 📋</h2>
                    <p>We need to know more about you to generate personalized challenges.</p>
                    <Link to="/user-details-form">
                        <button className="join-btn" style={{ marginTop: '20px' }}>
                            Fill Health Profile
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="challenges-container">
            <header className="challenges-header">
                <div className="header-content">
                    <h1>Daily Missions</h1>
                    <p>Level up your health. Compete with friends. Be your best self.</p>
                </div>
            </header>

            <div className="challenges-layout-grid">
                <div className="challenges-list">
                    {challenges.length > 0 ? (
                        challenges.map((challenge) => (
                            <div key={challenge._id}
                                className={`challenge-card ${challenge.completed ? 'completed' : ''} ${challenge.joined ? 'joined' : ''}`}
                            >
                                <div className="card-top-accent"></div>
                                <div className="card-content">
                                    <div className="card-header">
                                        <span className={`badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                                            {challenge.difficulty}
                                        </span>
                                        <span className="badge condition">{challenge.condition}</span>
                                    </div>

                                    <h3>{challenge.title}</h3>
                                    <p>{challenge.description}</p>

                                    <div className="social-section">
                                        {leaderboard[challenge._id] && leaderboard[challenge._id].length > 0 && (
                                            <div className="friend-completions">
                                                <span className="friend-icon">👥</span>
                                                <span className="friend-text">
                                                    Completed today by <strong>{leaderboard[challenge._id].join(", ")}</strong>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <span className="points">🏆 {challenge.points} Pts</span>

                                        <div className="action-buttons">
                                            {!challenge.joined && !challenge.completed && (
                                                <button
                                                    className="join-btn"
                                                    onClick={() => handleJoin(challenge._id)}
                                                >
                                                    Accept Challenge ⚔️
                                                </button>
                                            )}

                                            {(challenge.joined && !challenge.completed) && (
                                                <button
                                                    className="complete-btn"
                                                    onClick={() => handleComplete(challenge._id)}
                                                >
                                                    Mark Complete ✅
                                                </button>
                                            )}

                                            {challenge.completed && (
                                                <button className="completed-btn" disabled>
                                                    Done! 🎉
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-challenges">
                            <h2>All Caught Up!</h2>
                            <p>No more challenges for today. You're doing great!</p>
                        </div>
                    )}
                </div>

                <div className="challenges-sidebar">
                    <CalendarStreak completedDates={history} />

                    {/* Placeholder for future sidebar items like global leaderboard */}
                    <div className="sidebar-promo">
                        <h4>Keep it up! 🔥</h4>
                        <p>Consistency is key to a healthier you.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Challenges;
