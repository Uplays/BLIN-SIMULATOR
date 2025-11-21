import React from 'react';
import GlassCard from '../components/GlassCard';
import { useOS } from '../contexts/OSContext';

interface SettingsAppProps {
  windowId: string;
  onClose: () => void;
}

const predefinedBackgrounds = [
  { id: 'default', url: 'https://picsum.photos/1920/1080?blur=5', thumbnail: 'https://picsum.photos/200/120?blur=5', name: 'Default Blur' },
  { id: 'mountain_sunset', url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', thumbnail: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', name: 'Mountain Sunset' },
  { id: 'abstract_waves', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', name: 'Abstract Waves' },
  { id: 'forest', url: 'https://images.unsplash.com/photo-1448375240586-882fc2d3f201?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80', thumbnail: 'https://images.unsplash.com/photo-1448375240586-882fc2d3f201?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', name: 'Misty Forest' },
];

const SettingsApp: React.FC<SettingsAppProps> = ({ windowId, onClose }) => {
  const { desktopBackground, setDesktopBackground } = useOS();

  return (
    <div className="flex flex-col h-full p-4 text-white overflow-y-auto custom-scrollbar">
      <h1 className="text-3xl font-bold text-center text-blue-300 drop-shadow-lg mb-6 flex-shrink-0">Settings</h1>

      <GlassCard className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-200">Desktop Background</h2>
        <p className="text-sm text-white/80 mb-4">Choose a new background for your desktop.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {predefinedBackgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setDesktopBackground(bg.url)}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-lg
                transition-all duration-200 group overflow-hidden
                ${desktopBackground === bg.url ? 'border-2 border-blue-400 bg-blue-500/20' : 'border border-white/20 hover:bg-white/10'}
              `}
              aria-label={`Set background to ${bg.name}`}
            >
              <img
                src={bg.thumbnail}
                alt={bg.name}
                className="w-full h-24 object-cover rounded-md mb-2 shadow-md"
              />
              <span className="text-sm text-white/90">{bg.name}</span>
              {desktopBackground === bg.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white drop-shadow-lg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-200">About Blin OS</h2>
        <p className="text-sm text-white/90 leading-relaxed">
          Blin OS is an interactive desktop environment simulation running in your browser, built with React and a glassmorphism design.
          It features a dynamic file system, draggable widgets, and custom applications.
        </p>
        <p className="mt-4 text-sm text-white/60">Window ID: {windowId}</p>
      </GlassCard>
    </div>
  );
};

export default SettingsApp;