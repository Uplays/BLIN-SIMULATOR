import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { formatTime } from '../utils/dateTime';

interface CalendarWidgetProps {
  widgetId: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widgetId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Placeholder for days before the 1st
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getMonthDays(currentDate);
  const today = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="flex flex-col h-full text-white p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-blue-200">Calendar & Clock</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
        </svg>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-white/70 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mb-4 flex-grow">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-center p-1 rounded-full
              ${day === today ? 'bg-blue-600/50 text-white font-bold border border-blue-400' : 'text-white/80'}
              ${day === null ? 'opacity-0' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      <p className="text-3xl font-bold text-center text-blue-300 mt-auto drop-shadow-lg">{formatTime(currentDate)}</p>
    </div>
  );
};

export default CalendarWidget;