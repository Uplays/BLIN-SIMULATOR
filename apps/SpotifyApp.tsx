import React, { useState, useEffect, useCallback, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

interface SpotifyAppProps {
  windowId: string;
  onClose: () => void;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // in seconds
}

const tracks: Track[] = [
  {
    id: '1',
    title: 'Experience',
    artist: 'Victoria Monét, Khalid',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273ce96f0b4d4554f6762391696',
    duration: 210, // 3:30
  },
  {
    id: '2',
    title: 'Neon Dreams',
    artist: 'Cyber Runner',
    albumArt: 'https://cdn-icons-png.flaticon.com/512/3890/3890185.png', // Placeholder
    duration: 180, // 3:00
  },
  {
    id: '3',
    title: 'City Lights',
    artist: 'Urban Echoes',
    albumArt: 'https://cdn-icons-png.flaticon.com/512/3890/3890180.png', // Placeholder
    duration: 240, // 4:00
  },
];

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SpotifyApp: React.FC<SpotifyAppProps> = ({ windowId, onClose }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Current playback time in seconds
  const [volume, setVolume] = useState(0.5); // 0.0 to 1.0

  // For scrubbing the progress bar
  const [isScrubbing, setIsScrubbing] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // For dragging the volume slider
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to number for browser compatibility
    let interval: number;
    if (isPlaying && !isScrubbing) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime + 1 >= currentTrack.duration) {
            setIsPlaying(false);
            return currentTrack.duration; // End of song
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, isScrubbing]);

  // Reset current time when track changes
  useEffect(() => {
    setCurrentTime(0);
  }, [currentTrackIndex]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const skipNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  }, []);

  const skipPrevious = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
  }, []);

  const restartSong = useCallback(() => {
    setCurrentTime(0);
    if (!isPlaying) {
      setIsPlaying(true); // Start playing from beginning if paused
    }
  }, [isPlaying]);

  const handleProgressScrubStart = useCallback((e: React.MouseEvent) => {
    if (!progressBarRef.current) return;
    setIsScrubbing(true);
    setIsPlaying(false); // Pause playback while scrubbing
    document.addEventListener('mousemove', handleProgressScrub);
    document.addEventListener('mouseup', handleProgressScrubEnd);
  }, []);

  const handleProgressScrub = useCallback((e: MouseEvent) => {
    if (!progressBarRef.current || !currentTrack) return;
    const bar = progressBarRef.current.getBoundingClientRect();
    let newTime = ((e.clientX - bar.left) / bar.width) * currentTrack.duration;
    newTime = Math.max(0, Math.min(newTime, currentTrack.duration));
    setCurrentTime(newTime);
  }, [currentTrack]);

  const handleProgressScrubEnd = useCallback(() => {
    setIsScrubbing(false);
    setIsPlaying(true); // Resume playback after scrubbing
    document.removeEventListener('mousemove', handleProgressScrub);
    document.removeEventListener('mouseup', handleProgressScrubEnd);
  }, [handleProgressScrub]);

  const handleVolumeDragStart = useCallback((e: React.MouseEvent) => {
    if (!volumeBarRef.current) return;
    setIsVolumeDragging(true);
    document.addEventListener('mousemove', handleVolumeDrag);
    document.addEventListener('mouseup', handleVolumeDragEnd);
  }, []);

  const handleVolumeDrag = useCallback((e: MouseEvent) => {
    if (!volumeBarRef.current) return;
    const bar = volumeBarRef.current.getBoundingClientRect();
    let newVolume = ((e.clientX - bar.left) / bar.width);
    newVolume = Math.max(0, Math.min(newVolume, 1));
    setVolume(newVolume);
  }, []);

  const handleVolumeDragEnd = useCallback(() => {
    setIsVolumeDragging(false);
    document.removeEventListener('mousemove', handleVolumeDrag);
    document.removeEventListener('mouseup', handleVolumeDragEnd);
  }, [handleVolumeDrag]);

  const progressPercentage = (currentTime / currentTrack.duration) * 100;
  const remainingTime = currentTrack.duration - currentTime;

  return (
    <div className="flex flex-col h-full text-white p-4 items-center justify-between">
      {/* Top Bar (simulated) */}
      <div className="w-full flex justify-end text-white/80 text-xs mb-4">
        <span className="opacity-0">9:41 AM</span> {/* Placeholder for time, to align */}
        <div className="bg-white/20 w-16 h-1 rounded-full absolute top-2"></div> {/* To hide what's playing */}
      </div>

      {/* Album Art */}
      <div className="w-64 h-64 rounded-xl overflow-hidden shadow-lg mb-6 relative">
        <img
          src={currentTrack.albumArt}
          alt="Album Art"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white/90 drop-shadow-sm">{currentTrack.title}</h2>
        <p className="text-sm text-white/70 drop-shadow-sm">{currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-6 px-2">
        <div
          ref={progressBarRef}
          className="relative w-full h-1.5 bg-white/30 rounded-full cursor-pointer group"
          onMouseDown={handleProgressScrubStart}
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <div
            className={`absolute -top-1.5 -ml-2 w-4 h-4 rounded-full bg-white shadow-md
              ${isScrubbing ? 'scale-125' : 'group-hover:scale-125 transition-transform duration-100'}
            `}
            style={{ left: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-white/70 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(remainingTime)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center space-x-6 mb-6">
        <button onClick={skipPrevious} className="text-white/80 hover:text-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-sm">
            <path fillRule="evenodd" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" clipRule="evenodd" />
          </svg>
        </button>
        <button onClick={restartSong} className="text-white/80 hover:text-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-sm">
            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21.41c0 1.108-.806 2.057-1.907 2.185A48.842 48.842 0 0112 23.992c-2.337 0-4.63-.119-6.816-.322C4.08 23.513 3.273 22.564 3.273 21.456V3.544c0-1.108.806-2.057 1.907-2.185A48.841 48.841 0 0112 0c2.337 0 4.63.119 6.816.322z" />
          </svg>
        </button>
        <button onClick={togglePlayPause} className="text-white hover:text-white transition-colors duration-200 p-2 rounded-full bg-white/20">
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 drop-shadow-md">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 drop-shadow-md">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.085.916-1.977 2.046-1.977h11.008c1.13 0 2.046.892 2.046 1.977v12.194a1.75 1.75 0 01-1.75 1.75H5.334a1.75 1.75 0 01-1.75-1.75V5.653zM9.75 16.5c0-.414.336-.75.75-.75h3c.414 0 .75.336.75.75s-.336.75-.75.75h-3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button onClick={skipNext} className="text-white/80 hover:text-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-sm">
            <path fillRule="evenodd" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Volume and Utility Controls */}
      <div className="w-full max-w-sm flex items-center justify-between text-white/70">
        {/* Shuffle/Lyrics */}
        <button className="text-white/80 hover:text-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path d="M7.5 12.75v1.5a3 3 0 003 3h2.25c.621 0 1.125.504 1.125 1.125v.375m-12 0h12m-12 0l-1.5 1.5M7.5 11.25l-1.5 1.5M7.5 8.25v-1.5m-3 7.5l-1.5 1.5M15 11.25l-1.5 1.5m-7.5 0h7.5" />
          </svg>
        </button>

        {/* Volume Slider */}
        <div className="flex items-center flex-grow mx-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            {volume <= 0.05 ? ( // Muted
              <path d="M17.25 12c0 .966-.31 1.859-.84 2.443L19.5 16.25l.707.707 1.25-1.25a.75.75 0 10-1.06-1.06l-1.25 1.25-.707-.707-1.414-1.414zM14.25 12c0-2.375-1.196-4.458-3-5.75l-1.714 1.714a1.75 1.75 0 00-.518 1.085c-.07.697-.07 1.4-.002 2.102L9.75 12h-3L4.5 7.75l-1.5-1.5v9.5l1.5-1.5 3-4.25h3c1.804 0 3-2.075 3-5.75z" />
            ) : volume < 0.5 ? ( // Low volume
              <path d="M9.25 7.5L4.5 12l4.75 4.5v-9zM12 12c0-2.375-1.196-4.458-3-5.75v11.5c1.804-1.292 3-3.375 3-5.75z" />
            ) : ( // High volume
              <path d="M9.25 7.5L4.5 12l4.75 4.5v-9zM12 12c0-2.375-1.196-4.458-3-5.75v11.5c1.804-1.292 3-3.375 3-5.75zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            )}
          </svg>
          <div
            ref={volumeBarRef}
            className="relative flex-grow h-1.5 bg-white/30 rounded-full cursor-pointer group"
            onMouseDown={handleVolumeDragStart}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${volume * 100}%` }}
            ></div>
            <div
              className={`absolute -top-1.5 -ml-2 w-4 h-4 rounded-full bg-white shadow-md
                ${isVolumeDragging ? 'scale-125' : 'group-hover:scale-125 transition-transform duration-100'}
              `}
              style={{ left: `${volume * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Devices/Queue/Repeat */}
        <button className="text-white/80 hover:text-white transition-colors duration-200 ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path d="M12.75 3.03v.355A4.002 4.002 0 0116.73 7.21a4.002 4.002 0 013.268 3.967A4.002 4.002 0 0120 18.003H4.556c-1.39 0-2.52-1.129-2.52-2.52V6.516c0-1.39 1.13-2.52 2.52-2.52h8.194z" />
          </svg>
        </button>
        <button className="text-white/80 hover:text-white transition-colors duration-200 ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M3 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013.75 9h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SpotifyApp;