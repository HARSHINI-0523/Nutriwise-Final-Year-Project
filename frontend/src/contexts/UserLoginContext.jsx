import React, { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000/api/auth";

// Creating context
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const UserLoginProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const resolveAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const googleToken = params.get("token");

      // 🔹 Case 1: Google login redirect
      if (googleToken) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${googleToken}`,
            },
          });

          const user = await res.json();

          const userProfile = {
            uid: user._id,
            displayName: user.name,
            email: user.email,
            token: googleToken,
          };

          localStorage.setItem("userToken", googleToken);
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
          setCurrentUser(userProfile);

          // Clean URL
          window.history.replaceState({}, document.title, "/profile");
        } catch (err) {
          console.error("Google auth failed", err);
        } finally {
          setAuthResolved(true);
          setLoading(false);
        }

        return;
      }

      // 🔹 Case 2: Normal reload
      const token = localStorage.getItem("userToken");
      const user = localStorage.getItem("userProfile");

      if (token && user) {
        try {
          setCurrentUser(JSON.parse(user));
        } catch {
          localStorage.clear();
        }
      }

      setAuthResolved(true);
      setLoading(false);
    };

    resolveAuth();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("userProfile");

    if (token && storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser({ ...parsed, token });
    }
  }, []);

  useEffect(() => {
    const syncToken = () => {
      const storedUser = localStorage.getItem("userProfile");
      const token = localStorage.getItem("userToken");

      if (storedUser && token) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser({ ...parsed, token });
      }
    };

    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  // Helper function for API calls
  const makeAuthRequest = async (endpoint, payload) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw the error message provided by the Express backend
      throw new Error(data.message || `${endpoint} failed.`);
    }
    return data;
  };

  // 1. Email/Password Sign Up
  const signUp = async (email, password, name) => {
    const data = await makeAuthRequest("signup", { email, password, name });

    // Store token and user data on successful sign up
    const userProfile = {
      uid: data._id,
      displayName: data.name,
      email: data.email,
      token: data.token,
    };
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setCurrentUser(userProfile);

    return data;
  };
  const completeLogin = (data) => {
    const userProfile = {
      uid: data.user._id,
      displayName: data.user.name,
      email: data.user.email,
      token: data.token,
    };

    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setCurrentUser(userProfile);
  };

  // 2. Email/Password Sign In
  const signIn = async (email, password) => {
    const data = await makeAuthRequest("login", { email, password });

    // Store token and user data on successful sign in
    const userProfile = {
      uid: data._id,
      displayName: data.name,
      email: data.email,
      token: data.token,
    };
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setCurrentUser(userProfile);

    // Note: Navigation must happen in the component calling this (Login.jsx)
  };

  // 3. Sign Out
  const logOut = () => {
    // Clear all session data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userProfile");
    setCurrentUser(null);
    // Note: Navigation must happen in the component calling this (e.g., Navbar.jsx)
  };

  // Google Sign-in is disabled since it requires complex OAuth implementation on a custom backend
  const signInWithGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // The value exposed by the context provider
  const value = {
    currentUser,
    loading,
    authResolved,
    signUp,
    signIn,
    signInWithGoogle,
    completeLogin,
    logOut,
    userId: currentUser?.uid,
    isAuthenticated: !!currentUser, // Convenience flag
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen text-lg text-green-600">
          Loading Session...
        </div>
      )}
    </AuthContext.Provider>
  );
};
