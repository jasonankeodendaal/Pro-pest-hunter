

import React, { useState, useMemo } from 'react';
import { Upload, X, Trash2, ChevronRight, Video, Camera, Search, Circle } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react'; 

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

// SAFE ICON MAP GENERATOR
// We need to filter out internal exports from lucide-react that aren't valid React components
// otherwise the IconPicker will crash when trying to map over them.
const getValidIconNames = () => {
    return Object.keys(LucideIcons).filter(key => {
        // Exclude known non-component exports
        if (['createReactComponent', 'IconNode', 'default', 'lucideReact'].includes(key)) return false;
        // Check if it starts with uppercase (Convention for React Components)
        return /^[A-Z]/.test(key);
    });
};

const ValidIconNames = getValidIconNames();

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

export const FileUpload = ({ label, value, onChange, onClear, accept = "image/*", multiple = false, capture }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const files = Array.from(e.target.files) as File[];
      const urls: string[] = [];

      for (const file of files) {
          const formData = new FormData();
          formData.append('image', file);

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
          const current = Array.isArray(value) ? value : (value ? [value] : []);
          onChange([...current, ...urls]);
      } else {
          onChange(urls[0] || '');
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
      <div className="flex flex-col gap-4">
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
                <div className="p-1 bg-pestGreen rounded-md">
                   {capture ? <Camera size={16} className="text-white"/> : <Upload size={16} className="text-white"/>}
                </div>
                <span className="text-xs font-bold text-white">
                    {uploading ? 'Uploading...' : (capture ? 'Take Photo' : (multiple ? 'Add Files' : (value ? 'Change File' : 'Select File')))}
                </span>
                <input 
                  type="file" 
                  accept={accept} 
                  multiple={multiple} 
                  capture={capture} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
            </label>
            <span className="text-[10px] text-gray-500">{multiple ? 'Multi-select' : 'Single file'}</span>
        </div>
      </div>
    </div>
  );
};

interface IconPickerProps {
    label: string;
    value: string;
    onChange: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = useMemo(() => {
        if (!searchTerm) return ValidIconNames.slice(0, 100); // Limit initial render for performance
        return ValidIconNames.filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 100);
    }, [searchTerm]);

    const CurrentIconComponent = (LucideIcons as any)[value] || LucideIcons.Circle;

    const handleSelectIcon = (iconName: string) => {
        onChange(iconName);
        setIsOpen(false);
        setSearchTerm(''); 
    };

    return (
        <div className="space-y-1">
            {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full p-2 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none transition-colors focus:bg-[#1a1d1c] flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-pestGreen/20 rounded-md text-pestGreen">
                        <CurrentIconComponent size={18} />
                    </div>
                    <span className="text-sm">{value || 'Choose Icon'}</span>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex flex-col p-4"
                        onClick={() => setIsOpen(false)} 
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1e201f] rounded-2xl shadow-3xl max-w-4xl w-full mx-auto my-auto p-6 flex flex-col h-[90vh]"
                            onClick={e => e.stopPropagation()} 
                        >
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <LucideIcons.SwatchBook size={24} className="text-pestGreen"/> Select an Icon
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search icons..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 p-2 custom-scrollbar">
                                {filteredIcons.length > 0 ? (
                                    filteredIcons.map(iconName => {
                                        const Icon = (LucideIcons as any)[iconName];
                                        // Safety check in case something slipped through
                                        if (!Icon) return null;
                                        
                                        const isSelected = iconName === value;
                                        return (
                                            <button
                                                key={iconName}
                                                onClick={() => handleSelectIcon(iconName)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 
                                                            ${isSelected ? 'bg-pestGreen/20 border-pestGreen text-pestGreen' : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                                title={iconName}
                                            >
                                                <Icon size={24} />
                                                <span className="text-[8px] mt-2 truncate w-full text-center">{iconName}</span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 col-span-full text-center py-10">No icons found for "{searchTerm}"</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};