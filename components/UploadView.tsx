
import React, { useState, useCallback } from 'react';
import { UploadIcon, FileIcon } from './common/Icons';

interface UploadViewProps {
  onFileSelect: (file: File | 'sample') => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const handleUploadClick = () => {
    document.getElementById('file-upload-input')?.click();
  }

  return (
    <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-center gap-16">
      <input type="file" id="file-upload-input" className="hidden" onChange={handleFileChange} accept=".pcap,.pcapng" />
      {/* Left Side: Upload Zone */}
      <div className="w-full lg:w-1/3">
        <div className="flex items-center mb-4">
            <button className="px-4 py-2 bg-brand-gray-light border-b-2 border-brand-green text-white">Upload</button>
            <button onClick={() => onFileSelect('sample')} className="px-4 py-2 bg-brand-gray-dark text-brand-gray-text">Samples</button>
        </div>
        <div className="bg-brand-gray-dark p-4 rounded-lg mb-4 text-sm text-brand-gray-text">
            <p><span className="font-semibold text-white">Your enterprise plan allows files up to 2GB.</span></p>
            <p>Credits: <span className="font-semibold text-white">Unlimited</span></p>
        </div>
        <div 
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-brand-green bg-brand-gray-light' : 'border-brand-gray-light bg-brand-gray-dark'}`}
        >
          <div className="flex flex-col items-center text-brand-gray-text">
            <UploadIcon className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Professional PCAP Analysis</h3>
            <p>Drop your .pcap/.pcapng file here for professional analysis.</p>
            <ul className="text-xs list-disc list-inside my-4 text-left">
              <li>Supports files up to 2GB</li>
              <li>No packet limits</li>
              <li>Advanced threat detection</li>
            </ul>
            <button onClick={handleUploadClick} className="w-full bg-brand-gray-light hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md transition-all">
                Select PCAP File
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Welcome Text */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <FileIcon className="w-20 h-20 mx-auto lg:mx-0 text-brand-gray-light mb-6" />
        <h2 className="text-4xl font-bold text-white mb-4">Network Packet Analyzer</h2>
        <p className="text-brand-gray-text text-lg mb-8">
          Upload a packet capture (.pcap) file or select a sample to start analyzing network traffic.
        </p>
        <div className="flex justify-center lg:justify-start space-x-4">
          <button onClick={handleUploadClick} className="bg-brand-gray-light hover:bg-opacity-80 text-white font-semibold py-3 px-6 rounded-md transition-all">
            Upload PCAP File
          </button>
          <button onClick={() => onFileSelect('sample')} className="bg-brand-green hover:bg-opacity-80 text-brand-dark font-semibold py-3 px-6 rounded-md transition-all">
            Browse Samples
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
