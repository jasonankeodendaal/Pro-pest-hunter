
import React, { useState } from 'react';
import { Upload, X, Trash2, ChevronRight, Video } from 'lucide-react';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export const Input = ({ label, value, onChange, type = "text", placeholder, disabled = false, className = "" }: any) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none transition-colors focus:bg-[#1a1d1c] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);

export const TextArea = ({ label, value, onChange, rows = 4, placeholder }: any) => (
  <div className="space-y-1">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
    <textarea 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      rows={rows}
      placeholder={placeholder}
      className="w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none transition-colors resize-none focus:bg-[#1a1d1c]"
    />
  </div>
);

export const Select = ({ label, value, onChange, options, disabled = false }: any) => (
  <div className="space-y-1">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative">
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none appearance-none cursor-pointer focus:bg-[#1a1d1c] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
        <ChevronRight className="rotate-90" size={16} />
      </div>
    </div>
  </div>
);

export const FileUpload = ({ label, value, onChange, onClear, accept = "image/*", multiple = false }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const files = Array.from(e.target.files) as File[];
      const urls: string[] = [];

      // Upload sequentially
      for (const file of files) {
          const formData = new FormData();
          formData.append('image', file); // Backend expects 'image'

          try {
              const res = await fetch(`${API_URL}/api/upload`, {
                  method: 'POST',
                  body: formData
              });
              const data = await res.json();
              if (data.url) urls.push(data.url);
          } catch (err) {
              console.error("Upload failed", err);
              alert("Upload failed for " + file.name);
          }
      }

      setUploading(false);
      
      if (multiple) {
          // Append new files to existing array
          const current = Array.isArray(value) ? value : (value ? [value] : []);
          onChange([...current, ...urls]);
      } else {
          // Replace single value
          onChange(urls[0] || '');
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
      <div className="flex flex-col gap-4">
        {/* Preview Area */}
        {multiple ? (
            <div className="flex flex-wrap gap-2">
                {(Array.isArray(value) ? value : []).map((url: string, i: number) => (
                    <div key={i} className="relative w-24 h-24 bg-white/5 rounded-lg overflow-hidden border border-white/10 group">
                        {url.match(/\.(mp4|webm|mov)$/i) ? <video src={url} className="w-full h-full object-cover" /> : <img src={url} className="w-full h-full object-cover" />}
                        <button onClick={() => {
                            const newValue = (value as string[]).filter((_, idx) => idx !== i);
                            onChange(newValue);
                        }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                    </div>
                ))}
            </div>
        ) : (
             value && (
                <div className="relative w-full h-48 bg-white/5 rounded-lg overflow-hidden border border-white/10 group">
                    {/* UPDATED: Added key to force re-render on value change and better video attributes */}
                    {value.match(/\.(mp4|webm|mov)$/i) ? (
                        <video key={value} src={value} className="w-full h-full object-cover" controls playsInline preload="metadata" />
                    ) : (
                        <img key={value} src={value} className="w-full h-full object-cover" />
                    )}
                     <button onClick={onClear} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                </div>
             )
        )}

        <div className="flex items-center gap-2">
            <label className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl cursor-pointer transition-colors border border-white/10 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="p-1 bg-pestGreen rounded-md"><Upload size={16} className="text-white"/></div>
                <span className="text-xs font-bold text-white">{uploading ? 'Uploading...' : (multiple ? 'Add Files' : (value ? 'Change File' : 'Select File'))}</span>
                <input type="file" accept={accept} multiple={multiple} onChange={handleFileChange} className="hidden" />
            </label>
            <span className="text-[10px] text-gray-500">{multiple ? 'Multi-select' : 'Single file'}</span>
        </div>
      </div>
    </div>
  );
};
