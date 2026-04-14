import React, { useState } from 'react';
import './CalendarStreak.css';

const CalendarStreak = ({ completedDates = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const todayStr = new Date().toISOString().split('T')[0];

    const isCompleted = (day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;
        return completedDates.includes(dateStr);
    };

    const isToday = (day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;
        return dateStr === todayStr;
    };

    // Calculate current streak (simple logic based on recent contiguous dates)
    // For a real robust streak, this logic might need to check backwards from yesterday/today
    const calculateStreak = () => {
        // Implementation for later if needed, for now we just show completed days
        let streak = 0;
        // logic placeholder
        return completedDates.length;
    };


    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <div>
                    <button className="calendar-nav-btn" onClick={prevMonth}>&lt;</button>
                    <button className="calendar-nav-btn" onClick={nextMonth}>&gt;</button>
                </div>
            </div>

            <div className="calendar-grid">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="calendar-day-label">{day}</div>
                ))}

                {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}

                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const completed = isCompleted(day);
                    const today = isToday(day);

                    return (
                        <div
                            key={day}
                            className={`calendar-day ${completed ? 'completed' : ''} ${today ? 'current-day' : ''}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            <div className="streak-info">
                <span className="streak-count">{calculateStreak()}</span>
                <span className="streak-label">Total Days Completed</span>
            </div>
        </div>
    );
};

export default CalendarStreak;
