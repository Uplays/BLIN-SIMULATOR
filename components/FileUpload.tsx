import React, { useState } from 'react';
import Button from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, className }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      onFileSelect(null as unknown as File); // Explicitly pass null for consistency
      setPreviewUrl(null);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-4 ${className}`}>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <Button variant="secondary" className="w-auto flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span>{selectedFile ? 'Change Image' : 'Upload Image'}</span>
        </Button>
      </label>
      {previewUrl && (
        <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-white/30 shadow-md">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;