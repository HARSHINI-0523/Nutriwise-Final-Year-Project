// src/services/api.js
import axios from "axios"
import api from "../api/axios";
export const fetchFriends = (userId) => {
  return api.get(`/friendships/friends/${userId}`);
};

export const fetchReceivedRequests = (userId) => {
  return api.get(`/friendships/requests/received/${userId}`);
};

export const respondToRequest = (friendshipId, action) => {
  return api.post(`/friendships/requests/handle/${friendshipId}`, { action });
};

export const fetchSuggestions = (userId) => {
  return api.get(`/friendships/suggestions/${userId}`);
};

export const verifyEmailOTP = (userId, otp) => {
  return axios.post(
    "http://localhost:5000/api/auth/verify-email",
    { userId, otp },
    { withCredentials: true }
  );
};


/**
 * Searches for users based on a query string.
 */
export const searchUsers = (userId, query) => {
  // If the search query is empty, return an empty array without hitting the API
  if (!query) return Promise.resolve({ data: [] });
  
  return api.get(`/users/search/${userId}?query=${query}`);
};

/**
 * Sends a friend request from one user to another.
 */
export const sendFriendRequest = (requesterId, recipientId) => {
  return api.post(`/friendships/request/send`, { requesterId, recipientId });
};


/**
 * Gets all appointments for a user.
 */
export const getAppointments = (userId) => {
  return api.get(`/appointments/${userId}`);
};

/**
 * Creates a new appointment.
 * @param {object} appointmentData - { title, start, end, user, notes }
 */
export const createAppointment = (appointmentData) => {
  return api.post('/appointments', appointmentData);
};

/**
 * Deletes an appointment by its ID.
 */
export const deleteAppointment = (appointmentId) => {
  return api.delete(`/appointments/${appointmentId}`);
};