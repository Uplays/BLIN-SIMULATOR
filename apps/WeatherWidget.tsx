import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';

interface WeatherWidgetProps {
  widgetId: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widgetId }) => {
  const [weatherEnabled, setWeatherEnabled] = useState(true);

  // Simulated weather data
  const temperature = 16;
  const date = 'September 15, 18:30';
  const description = 'Sunny/Cloud. Wind: 5 km/h';

  return (
    <div className="flex flex-col h-full text-white p-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-blue-200">Weather</h3>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/70">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-.386l1.591-1.591M3 12H5.25m.386-6.364l1.591 1.591M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="flex items-start mb-1 gap-1"> {/* Changed to items-start for better alignment */}
        <span className="text-5xl font-extrabold">{temperature}</span>
        <span className="text-3xl font-bold align-top mt-1">°C</span> {/* Smaller degree symbol, aligned with top */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-yellow-300 ml-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-.386l1.591-1.591M3 12H5.25m.386-6.364l1.591 1.591M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="text-sm text-white/80">{date}</p>
      <p className="text-xs text-white/60 mb-3">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-sm text-white/80">ON</span>
        <label htmlFor={`weather-toggle-${widgetId}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id={`weather-toggle-${widgetId}`}
              className="sr-only"
              checked={weatherEnabled}
              onChange={() => setWeatherEnabled(!weatherEnabled)}
            />
            <div className="block bg-white/30 w-12 h-6 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${weatherEnabled ? 'translate-x-6 bg-blue-500' : ''}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default WeatherWidget;