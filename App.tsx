import React, { useState, useEffect } from 'react';
import { OSProvider } from './contexts/OSContext';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import Window from './components/Window';
import Widget from './components/Widget'; // New import for Widget component
import SpotifyApp from './apps/SpotifyApp'; // Changed from BlinVisionApp
import FileManagerApp from './apps/FileManagerApp';
import TasksApp from './apps/TasksApp';
import SettingsApp from './apps/SettingsApp';
import BrowserApp from './apps/BrowserApp';
import WeatherWidget from './apps/WeatherWidget'; // New import for WeatherWidget
import CalendarWidget from './apps/CalendarWidget'; // New import for CalendarWidget
import MyTasksWidget from './apps/MyTasksWidget'; // New import for MyTasksWidget
import SystemMonitorWidget from './apps/SystemMonitorWidget'; // New import for SystemMonitorWidget
import NotesWidget from './apps/NotesWidget'; // New import for NotesWidget
import LoginScreen from './components/LoginScreen'; // New import for LoginScreen
import WelcomeAnimation from './components/WelcomeAnimation'; // New import for WelcomeAnimation
import { useOS } from './contexts/OSContext';

// Define the available applications for the Dock
const appDefinitions = [
  {
    id: 'spotify', // Changed ID
    name: 'Spotify', // Changed Name
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/800px-Spotify_logo_without_text.svg.png', // New Spotify icon
    component: SpotifyApp, // New component
  },
  {
    id: 'file-manager',
    name: 'BLIN Navigator',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233075.png', // Apple folder icon
    component: FileManagerApp,
  },
  {
    id: 'tasks',
    name: 'BLIN Tareas',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233045.png', // Apple Notes icon
    component: TasksApp,
  },
  {
    id: 'settings',
    name: 'Settings',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2040/2040504.png', // Sleek gear for Settings
    component: SettingsApp,
  },
  {
    id: 'browser',
    name: 'Browser',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png', // Google logo for Browser
    component: BrowserApp,
  },
];

// Main OS application component
function OSApp() {
  const { windows, widgets, focusWindow, updateWindowPositionAndSize, closeWindow, updateWidgetPosition } = useOS();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Desktop />

      {/* Render Widgets */}
      {widgets.map((widget) => (
        <Widget
          key={widget.id}
          id={widget.id}
          x={widget.x}
          y={widget.y}
          width={widget.width}
          height={widget.height}
          zIndex={widget.zIndex}
          onDragEnd={(newX, newY) => updateWidgetPosition(widget.id, newX, newY)}
          className={widget.className} // Pass className from widget definition
        >
          <widget.contentComponent widgetId={widget.id} {...widget.props} />
        </Widget>
      ))}

      {/* Render Windows */}
      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          minimized={win.minimized}
          maximized={win.maximized}
          zIndex={win.zIndex}
          onFocus={() => focusWindow(win.id)}
          onClose={() => closeWindow(win.id)}
          onDragEnd={(newX, newY) => updateWindowPositionAndSize(win.id, { x: newX, y: newY })}
          onResizeEnd={(newX, newY, newWidth, newHeight) => updateWindowPositionAndSize(win.id, { x: newX, y: newY, width: newWidth, height: newHeight })}
        >
          {/* Render the content component for each window */}
          <win.contentComponent windowId={win.id} onClose={() => closeWindow(win.id)} {...win.props} />
        </Window>
      ))}

      <Dock appDefinitions={appDefinitions} />
    </div>
  );
}

// Root component for the entire OS experience, wrapping OSApp with the Provider
function App() {
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true); // New state for welcome animation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Alex Chen'); // Default user for login screen

  useEffect(() => {
    // No auto-login for development, let welcome animation run
  }, []);

  const handleWelcomeAnimationComplete = () => {
    setShowWelcomeAnimation(false);
  };

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  return (
    <OSProvider>
      {showWelcomeAnimation ? (
        <WelcomeAnimation onAnimationComplete={handleWelcomeAnimationComplete} />
      ) : isLoggedIn ? (
        <OSApp />
      ) : (
        <LoginScreen onLogin={handleLogin} username={username} />
      )}
    </OSProvider>
  );
}

export default App;