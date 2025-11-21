import React, { useState } from 'react';

interface NotesWidgetProps {
  widgetId: string;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ widgetId }) => {
  const [notes, setNotes] = useState('');

  return (
    <div className="flex flex-col h-full text-white p-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-blue-200">Ideas Brillantes</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8.25 15h7.5M10.875 18.75L7.5 20.25m4.375-1.5L16.5 20.25M10.875 18.75a3.375 3.375 0 11-6.75 0m6.75 0a3.375 3.375 0 10-6.75 0M10.875 18.75h-.008v-.008h.008zm-6.75 0a.75.75 0 01-.75-.75V6.75c0-1.242 1.008-2.25 2.25-2.25h10.5c1.242 0 2.25 1.008 2.25 2.25v12c0 1.242-1.008 2.25-2.25 2.25H7.5a.75.75 0 01-.75-.75z" />
        </svg>
      </div>
      <textarea
        className="flex-grow w-full p-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-sm custom-scrollbar resize-none"
        placeholder="Escribe tus ideas aquí..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        aria-label="Notes input"
      />
    </div>
  );
};

export default NotesWidget;