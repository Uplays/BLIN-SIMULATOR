import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

interface BrowserAppProps {
  windowId: string;
  onClose: () => void;
}

interface HistoryEntry {
  url: string;
  content: string; // Simulated content
}

const BrowserApp: React.FC<BrowserAppProps> = ({ windowId, onClose }) => {
  const [urlInput, setUrlInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    // Initialize with a default home page
    if (history.length === 0) {
      navigate('blin.os'); // Simulate a default home page
    }
  }, []);

  const generateSimulatedContent = (url: string): string => {
    if (url.includes('google.com')) {
      return `
        <h3 class="text-2xl font-bold text-blue-400 mb-4">Google Search Results for "${url.split('=')[1] || 'Blin OS'}"</h3>
        <p class="mb-2">1. <a href="#" class="text-blue-300 hover:underline">Blin OS Official Site</a></p>
        <p class="mb-2">2. <a href="#" class="text-blue-300 hover:underline">Wikipedia: Operating Systems</a></p>
        <p class="mb-2">3. <a href="#" class="text-blue-300 hover:underline">Frontend Development Trends</a></p>
        <p class="text-sm text-white/70 mt-4">Simulated content from Google.</p>
      `;
    } else if (url.includes('blin.os')) {
      return `
        <h3 class="text-2xl font-bold text-blue-400 mb-4">Welcome to Blin OS!</h3>
        <p class="mb-3">This is your interactive browser experience. Explore the web (simulated).</p>
        <p class="text-sm text-white/70">Type a URL in the address bar above and press enter or click Go.</p>
        <div class="mt-6">
          <img src="https://picsum.photos/400/200?random=browser-home" alt="Browser Home Image" class="rounded-lg shadow-md mx-auto" />
        </div>
      `;
    } else if (url.includes('aistudio.google.com')) {
      return `
        <h3 class="text-2xl font-bold text-green-400 mb-4">Google AI Studio</h3>
        <p class="mb-3">Explore the power of Gemini models and build amazing AI applications.</p>
        <p class="text-sm text-white/70">Start building with cutting-edge AI technology.</p>
        <div class="mt-6">
          <img src="https://aistudio.google.com/images/favicon.svg" alt="AI Studio Logo" class="h-20 w-20 mx-auto" />
        </div>
      `;
    } else if (url.trim() === '') {
      return `
        <h3 class="text-2xl font-bold text-blue-400 mb-4">Search or type URL</h3>
        <p class="text-sm text-white/70">Start browsing!</p>
      `;
    }
    return `
      <h3 class="text-2xl font-bold text-red-400 mb-4">Error: Could not load "${url}"</h3>
      <p class="text-sm text-white/70">The page you requested could not be found or loaded in this simulated browser.</p>
      <div class="mt-6">
          <img src="https://picsum.photos/400/200?random=browser-error" alt="Browser Error Image" class="rounded-lg shadow-md mx-auto" />
        </div>
    `;
  };

  const navigate = (url: string) => {
    const newContent = generateSimulatedContent(url);
    const newEntry: HistoryEntry = { url, content: newContent };

    // Clear forward history when navigating to a new URL
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newEntry]);
    setHistoryIndex(newHistory.length);
    setUrlInput(url);
  };

  const handleGo = () => {
    if (urlInput.trim()) {
      navigate(urlInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrlInput(history[newIndex].url);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrlInput(history[newIndex].url);
    }
  };

  const currentEntry = history[historyIndex];

  return (
    <div className="flex flex-col h-full text-white overflow-hidden">
      {/* Address Bar */}
      <GlassCard className="flex items-center p-2 rounded-none rounded-t-lg flex-shrink-0 border-b border-white/20">
        <Button onClick={goBack} disabled={historyIndex <= 0} variant="secondary" className="p-2 text-white/80 hover:text-white text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Button>
        <Button onClick={goForward} disabled={historyIndex >= history.length - 1} variant="secondary" className="p-2 text-white/80 hover:text-white text-sm ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>

        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type URL or search..."
          className="flex-grow p-2 mx-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-sm"
          aria-label="Address bar"
        />
        <Button onClick={handleGo} variant="primary" className="px-4 py-2 text-sm">
          Go
        </Button>
      </GlassCard>

      {/* Page Content */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar text-white/90 text-center">
        {currentEntry ? (
          <div dangerouslySetInnerHTML={{ __html: currentEntry.content }} />
        ) : (
          <p className="text-lg text-white/80 mt-8">Start your browsing journey!</p>
        )}
      </div>
    </div>
  );
};

export default BrowserApp;