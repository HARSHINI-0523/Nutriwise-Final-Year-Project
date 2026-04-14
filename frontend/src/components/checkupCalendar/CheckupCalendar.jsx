// components/CheckupCalendar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CheckupCalendar.css"; // We'll create this file for custom styles
import enUS from 'date-fns/locale/en-US';
import { useAuth } from "../../contexts/UserLoginContext";
import { useSidebar } from '../../contexts/SidebarContext';

import { getAppointments, createAppointment, deleteAppointment } from "../../services/api";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


const CheckupCalendar = () => {
  const { userId, isAuthenticated } = useAuth();
  const { setSidebarMode } = useSidebar();

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    // Set the active sidebar to null, which will cause it to unmount
    setSidebarMode(null);
  }, [setSidebarMode]);
  // Fetch appointments when the component mounts
  const fetchEvents = useCallback(async () => {
    if (isAuthenticated) {
      const res = await getAppointments(userId);
      // react-big-calendar needs Date objects, so we parse the strings
      const formattedEvents = res.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle clicking an empty slot on the calendar
  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
    setShowModal(true);
  }, []);

  // Handle clicking an existing event to delete it
  const handleSelectEvent = useCallback(async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      await deleteAppointment(event._id);
      fetchEvents(); // Refresh events after deleting
    }
  }, [fetchEvents]);
  
  // Handle form submission to create a new event
  const handleAddEvent = async (title) => {
      if(title && selectedSlot) {
          const newEvent = { title, start: selectedSlot.start, end: selectedSlot.end, user: userId };
          await createAppointment(newEvent);
          setShowModal(false);
          setSelectedSlot(null);
          fetchEvents(); // Refresh events after adding
      }
  };

  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const handleView = useCallback((newView) => setView(newView), [setView]);

  if (!isAuthenticated) {
    return <h2>Please log in to view your checkup calendar.</h2>;
  }

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        selectable // Allows you to click and drag to select a slot
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        view={view}
        date={date}
        onView={handleView}
        onNavigate={handleNavigate}
      />
      
      {/* Modal for adding a new event */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add a New Checkup</h3>
            <p><strong>Time:</strong> {format(selectedSlot.start, 'PPpp')} - {format(selectedSlot.end, 'p')}</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleAddEvent(e.target.title.value);
            }}>
                <input name="title" placeholder="Checkup Title (e.g., Annual Physical)" required />
                <div className="modal-actions">
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckupCalendar;