import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'; // Added useEffect

// Import widget components
import WeatherWidget from '../apps/WeatherWidget';
import CalendarWidget from '../apps/CalendarWidget';
import MyTasksWidget from '../apps/MyTasksWidget';
import SystemMonitorWidget from '../apps/SystemMonitorWidget';
import NotesWidget from '../apps/NotesWidget'; // New import for NotesWidget

// --- File System Interfaces ---
export type FileType = 'folder' | 'document' | 'image' | 'pdf' | 'audio' | 'video' | 'text';

export interface IFile {
  id: string; // Added ID for unique identification
  name: string;
  type: FileType;
  content?: string; // For documents or generic files
  children?: IFile[]; // For folders
}

// --- Window Management Interfaces ---
export interface IWindow {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  contentComponent: React.ComponentType<any>;
  props?: Record<string, any>;
}

// --- Widget Management Interfaces (New) ---
export interface IWidget {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  contentComponent: React.ComponentType<any>;
  props?: Record<string, any>;
  className?: string; // Optional custom class for the widget card
}

// --- OS Context Type ---
interface OSContextType {
  windows: IWindow[];
  widgets: IWidget[]; // New: List of active widgets
  fileSystem: IFile; // Root of the file system
  desktopBackground: string; // New: Current desktop background image URL
  openWindow: (id: string, title: string, component: React.ComponentType<any>, props?: Record<string, any>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPositionAndSize: (id: string, updates: Partial<{ x: number; y: number; width: number; height: number; maximized: boolean; minimized: boolean }>) => void;
  
  // New: Widget actions
  addWidget: (id: string, component: React.ComponentType<any>, x: number, y: number, width: number, height: number, className?: string, props?: Record<string, any>) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, newX: number, newY: number) => void;
  focusWidget: (id: string) => void; // New: Focus a widget

  // File system actions
  createFile: (path: string[], name: string, type: FileType, content?: string) => void;
  createFolder: (path: string[], name: string) => void;
  deleteFileOrFolder: (path: string[], name: string) => void;
  renameFileOrFolder: (path: string[], oldName: string, newName: string) => void;
  moveFileOrFolder: (sourceParentPath: string[], itemName: string, destinationParentPath: string[]) => void;

  // New: Desktop background action
  setDesktopBackground: (imageUrl: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

// --- Helper for File System Operations ---
const findParentFolder = (root: IFile, path: string[]): IFile | null => {
  let current: IFile = root;
  for (const segment of path) {
    if (current.type !== 'folder' || !current.children) return null;
    const next = current.children.find(child => child.name === segment && child.type === 'folder');
    if (!next) return null;
    current = next;
  }
  return current;
};

// --- OS Provider Component ---
export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<IWindow[]>([]);
  const [widgets, setWidgets] = useState<IWidget[]>([]); // New state for widgets
  const [lastZIndex, setLastZIndex] = useState(0); // For windows
  const [widgetsLastZIndex, setWidgetsLastZIndex] = useState(0); // New: For widgets
  const [desktopBackground, setDesktopBackground] = useState<string>('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80'); // New: Desktop background state

  // Initial simulated file system
  const [fileSystem, setFileSystem] = useState<IFile>({
    id: crypto.randomUUID(), // Unique ID for root
    name: 'Root',
    type: 'folder',
    children: [
      {
        id: crypto.randomUUID(),
        name: 'Desktop',
        type: 'folder',
        children: [
          { id: crypto.randomUUID(), name: 'Project Aurora', type: 'folder', children: [] },
          { id: crypto.randomUUID(), name: 'Meeting_Notes.pdf', type: 'pdf', content: 'This is a PDF document for the meeting notes of Project Aurora.' },
          { id: crypto.randomUUID(), name: 'Mountain_img.jpg', type: 'image', content: 'Description of mountain image.' },
          { id: crypto.randomUUID(), name: 'Work_Report.docx', type: 'document', content: 'This is an important work report.' },
          { id: crypto.randomUUID(), name: 'Audio_Track.mp3', type: 'audio', content: 'This is an audio file.' },
          { id: crypto.randomUUID(), name: 'Holiday_Video.mp4', type: 'video', content: 'This is a video from the holidays.' },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Documents',
        type: 'folder',
        children: [
          { id: crypto.randomUUID(), name: 'Annual Report.docx', type: 'document', content: 'This is the annual report content.' },
          { id: crypto.randomUUID(), name: 'Personal_Notes.txt', type: 'text', content: 'These are some personal notes: Remember to buy groceries, call mom, and finish the project.' },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Downloads',
        type: 'folder',
        children: [
          { id: crypto.randomUUID(), name: 'setup.exe', type: 'document', content: 'Executable file. Use with caution.' }, // generic type for exe
        ],
      },
      // Add other top-level directories as needed
    ],
  });

  // Initial Widgets setup
  useEffect(() => {
    // Add initial widgets after the component mounts
    const initialWidgets: IWidget[] = [
      { id: 'weather-widget', contentComponent: WeatherWidget, x: 50, y: 100, width: 250, height: 180, zIndex: 1, className: "p-4" },
      { id: 'calendar-widget', contentComponent: CalendarWidget, x: window.innerWidth - 300, y: 100, width: 250, height: 280, zIndex: 1, className: "p-4" },
      { id: 'mytasks-widget', contentComponent: MyTasksWidget, x: 50, y: window.innerHeight - 300, width: 250, height: 200, zIndex: 1, className: "p-4" },
      { id: 'system-monitor-widget', contentComponent: SystemMonitorWidget, x: window.innerWidth - 300, y: window.innerHeight - 280, width: 250, height: 180, zIndex: 1, className: "p-4" },
      { id: 'notes-widget', contentComponent: NotesWidget, x: 350, y: 100, width: 250, height: 180, zIndex: 1, className: "p-4" }, // New Notes Widget
    ];
    setWidgets(initialWidgets);
  }, []);

  // Fix: Define focusWindow before openWindow, as openWindow depends on it.
  const focusWindow = useCallback((id: string) => {
    setWindows(prevWindows => {
      const newZIndex = lastZIndex + 1;
      setLastZIndex(newZIndex);
      return prevWindows.map(win =>
        win.id === id ? { ...win, zIndex: newZIndex, minimized: false } : win
      ).sort((a, b) => a.zIndex - b.zIndex); // Re-sort to maintain correct visual order
    });
  }, [lastZIndex]);

  const openWindow = useCallback((id: string, title: string, component: React.ComponentType<any>, props?: Record<string, any>) => {
    setWindows(prevWindows => {
      // If window already open, just focus it
      if (prevWindows.some(win => win.id === id)) {
        focusWindow(id);
        return prevWindows.map(win => win.id === id ? { ...win, minimized: false } : win);
      }

      const newZIndex = lastZIndex + 1;
      setLastZIndex(newZIndex);

      const newWindow: IWindow = {
        id,
        title,
        contentComponent: component,
        x: Math.max(50, (window.innerWidth / 2) - 300 + (newZIndex * 10)), // Center + slight offset
        y: Math.max(50, (window.innerHeight / 2) - 200 + (newZIndex * 10)),
        width: 800,
        height: 600,
        minimized: false,
        maximized: false,
        zIndex: newZIndex,
        props,
      };
      // When opening a new window, simply add it. `newZIndex` already ensures it's on top.
      return [...prevWindows, newWindow];
    });
  }, [lastZIndex, focusWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.filter(win => win.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.map(win =>
      win.id === id ? { ...win, minimized: true } : win
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.map(win =>
      win.id === id ? { ...win, maximized: !win.maximized, minimized: false } : win
    ));
  }, []);

  const updateWindowPositionAndSize = useCallback((id: string, updates: Partial<{ x: number; y: number; width: number; height: number; maximized: boolean; minimized: boolean }>) => {
    setWindows(prevWindows => prevWindows.map(win =>
      win.id === id ? { ...win, ...updates } : win
    ));
  }, []);

  // --- Widget Functions (New) ---
  const focusWidget = useCallback((id: string) => {
    setWidgets(prevWidgets => {
      const newZIndex = widgetsLastZIndex + 1;
      setWidgetsLastZIndex(newZIndex);
      return prevWidgets.map(widget =>
        widget.id === id ? { ...widget, zIndex: newZIndex + 100 } : widget // Widgets get a lower range than windows
      ).sort((a, b) => a.zIndex - b.zIndex);
    });
  }, [widgetsLastZIndex]);

  const addWidget = useCallback((id: string, component: React.ComponentType<any>, x: number, y: number, width: number, height: number, className?: string, props?: Record<string, any>) => {
    setWidgets(prevWidgets => {
      if (prevWidgets.some(w => w.id === id)) {
        console.warn(`Widget with ID ${id} already exists.`);
        return prevWidgets;
      }
      const newZIndex = widgetsLastZIndex + 1;
      setWidgetsLastZIndex(newZIndex);
      const newWidget: IWidget = {
        id, contentComponent: component, x, y, width, height, zIndex: newZIndex + 100, className, props, // Widgets typically appear below windows
      };
      return [...prevWidgets, newWidget];
    });
  }, [widgetsLastZIndex]);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== id));
  }, []);

  const updateWidgetPosition = useCallback((id: string, newX: number, newY: number) => {
    setWidgets(prevWidgets => prevWidgets.map(widget =>
      widget.id === id ? { ...widget, x: newX, y: newY } : widget
    ));
    focusWidget(id); // Focus widget on drag end
  }, [focusWidget]);

  const createFile = useCallback((path: string[], name: string, type: FileType, content?: string) => {
    setFileSystem(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs)); // Deep copy
      const parent = findParentFolder(newFs, path);
      if (parent && parent.children) {
        if (parent.children.some(f => f.name === name)) {
          alert(`A file or folder named "${name}" already exists.`);
          return prevFs;
        }
        parent.children.push({ id: crypto.randomUUID(), name, type, content });
      }
      return newFs;
    });
  }, []);

  const createFolder = useCallback((path: string[], name: string) => {
    setFileSystem(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs));
      const parent = findParentFolder(newFs, path);
      if (parent && parent.children) {
        if (parent.children.some(f => f.name === name)) {
          alert(`A file or folder named "${name}" already exists.`);
          return prevFs;
        }
        parent.children.push({ id: crypto.randomUUID(), name, type: 'folder', children: [] });
      }
      return newFs;
    });
  }, []);

  const deleteFileOrFolder = useCallback((path: string[], name: string) => {
    setFileSystem(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs));
      const parent = findParentFolder(newFs, path);
      if (parent && parent.children) {
        parent.children = parent.children.filter(f => f.name !== name);
      }
      return newFs;
    });
  }, []);

  const renameFileOrFolder = useCallback((path: string[], oldName: string, newName: string) => {
    setFileSystem(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs));
      const parent = findParentFolder(newFs, path);
      if (parent && parent.children) {
        const item = parent.children.find(f => f.name === oldName);
        if (item) {
          if (parent.children.some(f => f.name === newName && f.id !== item.id)) {
            alert(`A file or folder named "${newName}" already exists in this location.`);
            return prevFs;
          }
          item.name = newName;
        }
      }
      return newFs;
    });
  }, []);

  const moveFileOrFolder = useCallback((sourceParentPath: string[], itemName: string, destinationParentPath: string[]) => {
    setFileSystem(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs)); // Deep copy

      const sourceParent = findParentFolder(newFs, sourceParentPath);
      const destinationParent = findParentFolder(newFs, destinationParentPath);

      if (!sourceParent || !sourceParent.children || !destinationParent || !destinationParent.children) {
        console.error('Source or destination parent not found.');
        return prevFs;
      }

      const itemIndex = sourceParent.children.findIndex(f => f.name === itemName);
      if (itemIndex === -1) {
        console.error(`Item "${itemName}" not found in source folder.`);
        return prevFs;
      }

      const [itemToMove] = sourceParent.children.splice(itemIndex, 1);

      // Check if an item with the same name already exists in the destination
      if (destinationParent.children.some(f => f.name === itemToMove.name)) {
        alert(`An item named "${itemToMove.name}" already exists in the destination folder.`);
        // Put the item back to its original location
        sourceParent.children.splice(itemIndex, 0, itemToMove);
        return prevFs;
      }

      // Prevent moving a folder into itself or its subfolder
      const isMovingFolderIntoItself = itemToMove.type === 'folder' && 
                                       [...destinationParentPath, itemToMove.name].join('/') === [...sourceParentPath, itemName].join('/');
      const isMovingIntoSubfolder = itemToMove.type === 'folder' && 
                                     destinationParentPath.join('/').startsWith([...sourceParentPath, itemName].join('/'));

      if (isMovingFolderIntoItself || isMovingIntoSubfolder) {
        alert("Cannot move a folder into itself or its subfolder.");
        // Put the item back to its original location
        sourceParent.children.splice(itemIndex, 0, itemToMove);
        return prevFs;
      }

      destinationParent.children.push(itemToMove);
      return newFs;
    });
  }, []);

  const contextValue = {
    windows,
    widgets, // New: Include widgets in context value
    fileSystem,
    desktopBackground, // New: Include desktopBackground in context value
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPositionAndSize,
    addWidget, // New: Include widget actions
    removeWidget,
    updateWidgetPosition,
    focusWidget, // New: Include focusWidget
    createFile,
    createFolder,
    deleteFileOrFolder,
    renameFileOrFolder,
    moveFileOrFolder,
    setDesktopBackground, // New: Include setDesktopBackground in context value
  };

  return (
    <OSContext.Provider value={contextValue}>
      {children}
    </OSContext.Provider>
  );
};

// --- Custom Hook to Use OS Context ---
export const useOS = () => {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};