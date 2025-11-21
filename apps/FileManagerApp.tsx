import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useOS } from '../contexts/OSContext';
import { IFile, FileType } from '../contexts/OSContext';

interface FileManagerAppProps {
  windowId: string;
  onClose: () => void;
}

const FileManagerApp: React.FC<FileManagerAppProps> = ({ windowId, onClose }) => {
  const { fileSystem, createFile, createFolder, deleteFileOrFolder, renameFileOrFolder, moveFileOrFolder } = useOS();
  const [currentPath, setCurrentPath] = useState<string[]>([]); // e.g., ['Desktop', 'Project Aurora']
  const [newEntryName, setNewEntryName] = useState('');
  const [selectedFileOrFolder, setSelectedFileOrFolder] = useState<string | null>(null);
  const [renameMode, setRenameMode] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Drag and Drop States
  const [draggedItem, setDraggedItem] = useState<{ path: string[]; name: string; type: FileType } | null>(null);
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  // File Content Preview State
  const [showFileContentModal, setShowFileContentModal] = useState<IFile | null>(null);

  const navigateTo = (path: string[]) => {
    setCurrentPath(path);
    setSelectedFileOrFolder(null); // Clear selection on navigation
  };

  const currentFolder = currentPath.reduce((acc: IFile | null, name: string) => {
    if (!acc || acc.type !== 'folder' || !acc.children) return null;
    return acc.children.find(child => child.name === name) || null;
  }, fileSystem);

  const handleCreate = (type: 'file' | 'folder') => {
    if (newEntryName.trim()) {
      let fileType: FileType = 'document'; // Default to document for files
      let content = 'This is a new document.';

      // Assign a default type/content based on a simple extension guess for better visuals
      if (newEntryName.includes('.txt')) fileType = 'text';
      else if (newEntryName.includes('.jpg') || newEntryName.includes('.png')) fileType = 'image';
      else if (newEntryName.includes('.pdf')) fileType = 'pdf';
      else if (newEntryName.includes('.mp3')) fileType = 'audio';
      else if (newEntryName.includes('.mp4')) fileType = 'video';
      
      createFile(currentPath, newEntryName, type === 'folder' ? 'folder' : fileType, content);
      setNewEntryName('');
    }
  };

  const handleDelete = () => {
    if (selectedFileOrFolder) {
      deleteFileOrFolder(currentPath, selectedFileOrFolder);
      setSelectedFileOrFolder(null);
    }
  };

  const handleRename = () => {
    if (renameMode && renameInput.trim()) {
      renameFileOrFolder(currentPath, renameMode, renameInput);
      setRenameMode(null);
      setRenameInput('');
      setSelectedFileOrFolder(null);
    }
  };

  const handleDoubleClick = (item: IFile) => {
    if (item.type === 'folder') {
      navigateTo([...currentPath, item.name]);
    } else {
      // Open file content for preview
      setShowFileContentModal(item);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-1.763-1.059a1.875 1.875 0 00-2.284 0L6.75 6.22V8.25m4.5 5.25l-4.5 4.5h9l-4.5-4.5z" />
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-300">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75v-1.94l-2.433-1.217a1.125 1.125 0 00-1.176-.07C15.15 14.547 13.5 15.824 12 15.824s-3.15-.927-3.646-1.454a1.125 1.125 0 00-1.176-.07L3 16.06zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
          </svg>
        );
      case 'document':
      case 'text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-400">
            <path d="M2.25 18.75a3.75 3.75 0 100-7.5h16.5a3.75 3.75 0 100 7.5H2.25z" />
            <path fillRule="evenodd" d="M3 5.625c0-1.036.84-1.875 1.875-1.875h.375a.75.75 0 01.75.75v3.75c0 .414.336.75.75.75H9.75a.75.75 0 01.75.75v.375c0 .414.336.75.75.75H12a.75.75 0 01.75.75v.375c0 .414.336.75.75.75H15a.75.75 0 01.75.75v.375c0 .414.336.75.75.75h.375A1.875 1.875 0 0021 12.375V12A2.25 2.25 0 0018.75 9.75H5.625A2.25 2.25 0 003.375 12v1.125M12 11.25H9.75A.75.75 0 019 10.5V7.5a.75.75 0 01.75-.75h3.75c.414 0 .75.336.75.75V10.5a.75.75 0 01-.75.75" clipRule="evenodd" />
          </svg>
        );
      case 'audio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-400">
            <path d="M13.5 4.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM8.25 17.25a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM18 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-purple-400">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.085.916-1.977 2.046-1.977h11.008c1.13 0 2.046.892 2.046 1.977v12.194a1.75 1.75 0 01-1.75 1.75H5.334a1.75 1.75 0 01-1.75-1.75V5.653zM9.75 16.5c0-.414.336-.75.75-.75h3c.414 0 .75.336.75.75s-.336.75-.75.75h-3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, item: IFile) => {
    e.stopPropagation();
    setDraggedItem({ path: currentPath, name: item.name, type: item.type });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ path: currentPath, name: item.name, type: item.type })); // For potential external drop, not strictly needed for internal
  };

  const handleDragOver = (e: React.DragEvent, targetFolder?: IFile) => {
    e.preventDefault(); // Essential to allow a drop
    e.stopPropagation();

    if (!draggedItem) return;

    const destinationPath = targetFolder ? [...currentPath, targetFolder.name] : currentPath;

    // Prevent dropping onto itself
    if (draggedItem.path.join('/') === destinationPath.join('/') && draggedItem.name === (targetFolder?.name || null)) {
        setHoveredFolder(null);
        e.dataTransfer.dropEffect = 'none';
        return;
    }

    // Prevent dropping a folder into its own subfolder
    if (draggedItem.type === 'folder' && targetFolder && destinationPath.join('/').startsWith([...draggedItem.path, draggedItem.name].join('/'))) {
        setHoveredFolder(null);
        e.dataTransfer.dropEffect = 'none';
        return;
    }

    setHoveredFolder(targetFolder ? targetFolder.name : '_current_folder_bg');
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setHoveredFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolder?: IFile) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredFolder(null);

    if (draggedItem) {
      const { path: sourceParentPath, name: itemName } = draggedItem;
      const destinationParentPath = targetFolder ? [...currentPath, targetFolder.name] : currentPath;

      // Prevent dropping if source and destination are the same parent folder
      if (sourceParentPath.join('/') === destinationParentPath.join('/')) {
        console.log(`Item "${itemName}" is already in the current folder.`);
        setDraggedItem(null);
        return;
      }
      
      moveFileOrFolder(sourceParentPath, itemName, destinationParentPath);
      setDraggedItem(null);
    }
  };

  return (
    <div className="flex flex-col h-full text-white p-4">
      <div className="flex items-center space-x-2 mb-4 flex-shrink-0">
        <Button onClick={() => navigateTo(currentPath.slice(0, -1))} disabled={currentPath.length === 0} variant="secondary" className="px-3 py-1 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Button>
        <span className="text-lg font-semibold flex-grow">/{currentPath.join('/')}</span>
      </div>

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {/* Sidebar */}
        <GlassCard className="w-full md:w-1/4 p-4 mb-4 md:mb-0 md:mr-4 flex-shrink-0 overflow-y-auto custom-scrollbar">
          <h3 className="font-semibold text-lg text-blue-200 mb-3">Quick Access</h3>
          <ul>
            {['Desktop', 'Documents', 'Downloads'].map(item => (
              <li key={item} className="mb-2">
                <Button variant="secondary" onClick={() => navigateTo([item])} className="w-full justify-start text-sm px-3 py-2 text-white/90 hover:text-white">
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Main Content Area */}
        <GlassCard
          className={`flex-grow p-4 overflow-y-auto custom-scrollbar ${hoveredFolder === '_current_folder_bg' ? 'border-2 border-dashed border-blue-400 bg-blue-500/20' : ''}`}
          onDragOver={(e) => handleDragOver(e)} // Allow dropping on the current folder background
          onDrop={(e) => handleDrop(e)}
          onDragLeave={handleDragLeave}
        >
          <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2 flex-shrink-0">
            <input
              type="text"
              value={newEntryName}
              onChange={(e) => setNewEntryName(e.target.value)}
              placeholder="New name..."
              className="p-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-sm"
            />
            <Button onClick={() => handleCreate('folder')} variant="secondary" className="px-3 py-1 text-sm text-white/90 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.562a1.5 1.5 0 00-.44-1.06l-2.12-2.12a1.5 1.5 0 00-1.061-.44H12.939a1.5 1.5 0 00-1.06 0z" />
              </svg>
              New Folder
            </Button>
            <Button onClick={() => handleCreate('file')} variant="secondary" className="px-3 py-1 text-sm text-white/90 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              New File
            </Button>
            {selectedFileOrFolder && (
              <>
                <Button onClick={handleDelete} variant="secondary" className="px-3 py-1 text-sm bg-red-500/30 hover:bg-red-500/40 text-white/90 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.14-2.006-2.296a48.07 48.07 0 00-4.337 0c-1.096.156-2.006 1.117-2.006 2.296v.916m7.5 0h-7.5" />
                  </svg>
                  Delete
                </Button>
                <Button onClick={() => { setRenameMode(selectedFileOrFolder); setRenameInput(selectedFileOrFolder); }} variant="secondary" className="px-3 py-1 text-sm text-white/90 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V7.5a2.25 2.25 0 012.25-2.25H9" />
                  </svg>
                  Rename
                </Button>
              </>
            )}
          </div>

          {renameMode && (
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="p-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-sm"
              />
              <Button onClick={handleRename} variant="primary" className="px-3 py-1 text-sm">Save</Button>
              <Button onClick={() => setRenameMode(null)} variant="secondary" className="px-3 py-1 text-sm">Cancel</Button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentFolder && currentFolder.children?.map(item => (
              <div
                key={item.id}
                draggable="true" // Make item draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => setSelectedFileOrFolder(item.name === selectedFileOrFolder ? null : item.name)}
                onDoubleClick={() => handleDoubleClick(item)}
                onDragOver={item.type === 'folder' ? (e) => handleDragOver(e, item) : undefined} // Only folders are specific drop targets
                onDrop={item.type === 'folder' ? (e) => handleDrop(e, item) : undefined}
                onDragLeave={item.type === 'folder' ? handleDragLeave : undefined}
                className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedFileOrFolder === item.name ? 'bg-blue-600/30 border-blue-400' : 'hover:bg-white/10'}
                  ${item.type === 'folder' ? 'brightness-110' : ''}
                  ${hoveredFolder === item.name ? 'border-2 border-dashed border-blue-400 bg-blue-500/20' : ''}
                `}
              >
                {getFileIcon(item.type)}
                <span className="mt-2 text-sm text-center truncate w-full text-white/90">{item.name}</span>
              </div>
            ))}
            {!currentFolder || currentFolder.children?.length === 0 && (
              <p className="text-white/60 text-center col-span-full">This folder is empty.</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* File Content Modal */}
      {showFileContentModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <GlassCard className="p-6 w-full max-w-lg min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2 flex-shrink-0">
              <h2 className="text-xl font-semibold text-blue-200">{showFileContentModal.name}</h2>
              <Button onClick={() => setShowFileContentModal(null)} variant="secondary" className="px-3 py-1 text-sm text-white/90">
                Close
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar text-white/80">
              {showFileContentModal.type === 'image' && (
                <img
                  src="https://picsum.photos/400/300?random=1" // Placeholder image
                  alt={showFileContentModal.name}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                />
              )}
              {(showFileContentModal.type === 'document' || showFileContentModal.type === 'text' || showFileContentModal.type === 'pdf') && (
                <p className="whitespace-pre-wrap">{showFileContentModal.content || 'This file has no readable content preview.'}</p>
              )}
              {(showFileContentModal.type === 'audio' || showFileContentModal.type === 'video') && (
                <p>Playback not supported in preview. ({showFileContentModal.type} file)</p>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default FileManagerApp;