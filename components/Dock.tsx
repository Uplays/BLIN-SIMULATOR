import React from 'react';
import GlassCard from './GlassCard';
import { useOS } from '../contexts/OSContext';
import { IWindow } from '../contexts/OSContext';

interface AppDefinition {
  id: string;
  name: string;
  imageUrl: string; // Changed from icon: React.ReactNode to imageUrl: string
  component: React.ComponentType<any>;
}

interface DockProps {
  appDefinitions: AppDefinition[];
}

const Dock: React.FC<DockProps> = ({ appDefinitions }) => {
  const { openWindow, focusWindow, windows } = useOS();

  const handleAppClick = (app: AppDefinition) => {
    const existingWindow = windows.find(win => win.id === app.id);
    if (existingWindow) {
      focusWindow(app.id); // Bring existing window to front
    } else {
      openWindow(app.id, app.name, app.component);
    }
  };

  const openAppIds = windows.map(win => win.id);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
      <GlassCard className="flex items-center space-x-4 p-3 px-6">
        {appDefinitions.map((app) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app)}
            className={`
              flex flex-col items-center justify-center p-1.5 rounded-lg
              text-white transition-all duration-200 group relative
              ${openAppIds.includes(app.id) ? 'bg-white/20' : 'hover:bg-white/15'}
              focus:outline-none focus:ring-2 focus:ring-blue-400
            `}
            aria-label={`Launch ${app.name}`}
          >
            <img src={app.imageUrl} alt={app.name} className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="sr-only group-hover:not-sr-only group-hover:absolute group-hover:-top-8 group-hover:bg-white/20 group-hover:px-2 group-hover:py-1 group-hover:rounded-md group-hover:text-sm group-hover:whitespace-nowrap group-hover:backdrop-blur-sm">
              {app.name}
            </span>
          </button>
        ))}
      </GlassCard>
    </div>
  );
};

export default Dock;