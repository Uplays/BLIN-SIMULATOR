import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import { formatTime, formatDate } from '../utils/dateTime';
import { useOS } from '../contexts/OSContext'; // Import useOS

interface LoginScreenProps {
  onLogin: (username: string) => void;
  username: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, username }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('BLIN: Good morning, Alex');
  const { desktopBackground } = useOS(); // Get desktopBackground from context

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginAttempt = () => {
    // In a real app, you'd check credentials. For this simulation, any password logs in.
    if (password.length > 0) {
      onLogin(username);
    } else {
      setNotification('Please enter a password.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoginAttempt();
    }
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white z-50"
      style={{
        backgroundImage: `url('${desktopBackground}')`, // Use dynamic desktopBackground
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <GlassCard className="flex flex-col items-center p-12 w-full max-w-lg text-center backdrop-blur-3xl">
        <h1 className="text-6xl font-extrabold mb-2 text-blue-300 drop-shadow-lg">{formatTime(currentTime)}</h1>
        <p className="text-lg text-white/90 mb-8">{formatDate(currentTime)}</p>

        <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 border-4 border-white/50 shadow-lg">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg" // Placeholder image
            alt="User Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-center pb-1 text-sm font-semibold">
            {/* Optional: Add a small status indicator here */}
          </div>
        </div>
        <p className="text-xl font-semibold mb-4 text-blue-200">{username}</p>

        <div className="relative w-2/3 max-w-xs mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-12 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Password"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-6 1.5h12a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H2.25a2.25 2.25 0 01-2.25-2.25V12.75a2.25 2.25 0 012.25-2.25z" />
          </svg>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={handleLoginAttempt}
            className="group relative flex flex-col items-center justify-center p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Login with fingerprint"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.212-.818 4.287-2.296 5.864-.143.16-.29.317-.44.47l-1.606 1.606m-9.454-9.454A7.5 7.5 0 015.25 10.5c0 2.212.818 4.287 2.296 5.864.143.16.29.317.44.47l1.606 1.606M1.5 1.5l1.606 1.606m16.818 16.818l1.606 1.606M9.75 10.5c0-1.036 1.05-1.875 2.344-1.875s2.344.839 2.344 1.875C14.438 11.536 12.484 12.5 12 12.5c-.484 0-2.438-.964-2.25-2zm4.004 5.341l-1.374 1.373M10.125 16.71l-1.374 1.373M5.562 21L6 20.437m-.438-.563L5.625 20.5m-3.937-2.625L2.5 17.25" />
            </svg>
            <span className="sr-only group-hover:not-sr-only group-hover:absolute group-hover:-top-8 group-hover:bg-white/20 group-hover:px-2 group-hover:py-1 group-hover:rounded-md group-hover:text-sm group-hover:whitespace-nowrap group-hover:backdrop-blur-sm">
              Login
            </span>
          </button>
          <button
            className="group relative flex flex-col items-center justify-center p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Switch User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white/70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h.75v7.5m-7.5 0h.75H12m-7.5 0H7.5m-7.5 0v-3.375c0-1.036.84-1.875 1.875-1.875h.375m-1.5 0H7.5m0 0H7.875m0 0H12m4.125 0H12v6.75m-4.875-6.75H7.5m0 0H3.375m0 0H.75" />
            </svg>
            <span className="sr-only group-hover:not-sr-only group-hover:absolute group-hover:-top-8 group-hover:bg-white/20 group-hover:px-2 group-hover:py-1 group-hover:rounded-md group-hover:text-sm group-hover:whitespace-nowrap group-hover:backdrop-blur-sm">
              Switch User
            </span>
          </button>
        </div>
      </GlassCard>

      <GlassCard className="absolute bottom-8 right-8 p-3 px-5 text-sm bg-white/10 border border-white/30">
        <p className="font-semibold text-white/90">{notification}</p>
      </GlassCard>
    </div>
  );
};

export default LoginScreen;