import React, { useState, useEffect, useCallback } from "react";
import { fetchFriends, fetchReceivedRequests, respondToRequest, fetchSuggestions, searchUsers, sendFriendRequest } from "../../services/api";
import { useAuth } from "../../contexts/UserLoginContext"; 
import { useToast } from '../../contexts/ToastContext';
import { useSidebar } from '../../contexts/SidebarContext';
import "./FriendsPage.css";

const FriendsPage = () => {
  
  const { userId, isAuthenticated } = useAuth();
  const { setSidebarMode } = useSidebar();

  const { showToast } = useToast();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  console.log(userId);
  useEffect(() => {
    // Set the active sidebar to null, which will cause it to unmount
    setSidebarMode(null);
  }, [setSidebarMode]);
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    const res = await searchUsers(userId, query);
    setSearchResults(res.data);
  };

 const handleSendRequest = async (recipientId) => {
    try {
      await sendFriendRequest(userId, recipientId);
      showToast("Friend request sent!", "success");
      setSearchResults(prev => prev.filter(user => user._id !== recipientId));
      setSuggestions(prev => prev.filter(user => user._id !== recipientId));
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Could not send request.";
      showToast(errorMessage, "error");
      
    }
  };
  
  const loadData = useCallback(async () => {
    // Only fetch data if we have a userId
    if (!userId) return;

    try {
      setLoading(true);
      const [friendsRes, requestsRes, suggestionsRes] = await Promise.all([
        fetchFriends(userId),
        fetchReceivedRequests(userId),
        fetchSuggestions(userId),
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
      setSuggestions(suggestionsRes.data);
      
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

 console.log("FRIENDS PAGE USER ID →", userId);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      // If not authenticated, don't bother trying to load data
      setLoading(false);
    }
  }, [isAuthenticated, loadData]);

 

  const handleResponse = async (friendshipId, action) => {
    try {
      await respondToRequest(friendshipId, action);
      // Reload all data to reflect the change
      loadData();
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
    }
  };

  // ✅ 5. Handle different states: loading, not authenticated, and authenticated
  if (loading) {
    return <p>Loading Friends...</p>;
  }

  if (!isAuthenticated) {
    return <h2>Please log in to manage your friends.</h2>;
  }

  return (
  <div className="friends-page">
    {/* Section 1: Search Bar (Full Width) */}
    <div className="search-section card">
      <h2>Find People</h2>
      <input
        type="text"
        placeholder="Search by name or email..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
     
      <div className="results-list">
        {searchResults.map((user) => (
          <div key={user._id} className="result-card">
            <p><strong>{user.name}</strong> ({user.email})</p>
            <button className="btn add" onClick={() => handleSendRequest(user._id)}>Add Friend</button>
          </div>
        ))}
      </div>
    </div>

    {/* Section 2: Container for the other cards */}
    <div className="card-container">
      {/* Friend Requests Card */}
      <div className="card">
        <h2>Friend Requests ({requests.length})</h2>
        <div className="results-list">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div key={req._id} className="result-card">
                <p><strong>{req.requester.name}</strong> sent you a request.</p>
                <div className="actions">
                  <button className="btn accept" onClick={() => handleResponse(req._id, "accept")}>Accept</button>
                  <button className="btn reject" onClick={() => handleResponse(req._id, "reject")}>Reject</button>
                </div>
              </div>
            ))
          ) : (<p className="empty-message">No new friend requests.</p>)}
        </div>
      </div>

      {/* Your Friends Card */}
      <div className="card">
        <h2>Your Friends ({friends.length})</h2>
        <div className="results-list">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="result-card">
                <p><strong>{friend.name}</strong> ({friend.email})</p>
              </div>
            ))
          ) : (<p className="empty-message">Your friend list is empty.</p>)}
        </div>
      </div>

      {/* Suggestions Card */}
      <div className="card">
        <h2>Suggestions ({suggestions.length})</h2>
        <div className="results-list">
          {suggestions.length > 0 ? (
            suggestions.map((user) => (
              <div key={user._id} className="result-card">
                <p><strong>{user.name}</strong></p>
                <button className="btn add" onClick={() => handleSendRequest(user._id)}>Add Friend</button>
              </div>
            ))
          ) : (<p className="empty-message">No new suggestions right now.</p>)}
        </div>
      </div>
    </div>
  </div>
);
};

export default FriendsPage;