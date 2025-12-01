

import React, { useState, useMemo } from 'react';
import { Upload, X, Trash2, ChevronRight, Video, Camera, Search, Circle, AlertTriangle, Shield, Bug, Briefcase } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react'; 

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

// --- ROBUST ICON FILTERING ---
// Filters out internal Lucide exports that cause crashes (like createReactComponent, default, etc.)
const getValidIconNames = () => {
    return Object.keys(LucideIcons).filter(key => {
        // 1. Must start with Uppercase (React Component convention)
        if (!/^[A-Z]/.test(key)) return false;
        
        // 2. Exclude specific internal keywords/exports known to crash
        const blacklist = ['Icon', 'LucideProps', 'LucideIcon', 'createReactComponent', 'default'];
        if (blacklist.includes(key)) return false;

        // 3. Verify it's actually a function/object (Component)
        const val = (LucideIcons as any)[key];
        if (typeof val !== 'function' && typeof val !== 'object') return false;

        return true;
    });
};

const ValidIconNames = getValidIconNames();

// --- ERROR BOUNDARY FOR ICONS ---
// Prevents one bad icon from white-screening the entire app
interface IconErrorBoundaryProps {
  fallback: React.ReactNode;
  children?: React.ReactNode;
}

interface IconErrorBoundaryState {
  hasError: boolean;
}

class IconErrorBoundary extends React.Component<IconErrorBoundaryProps, IconErrorBoundaryState> {
    constructor(props: IconErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any) { console.warn("Icon render failed:", error); }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

// --- SHARED COMPONENTS ---

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

    // Categories for quick access
    const categories = [
        { name: 'Safety', icon: Shield, terms: ['shield', 'check', 'lock', 'hard', 'alert', 'siren', 'triangle', 'safe'] },
        { name: 'Pests/Bugs', icon: Bug, terms: ['bug', 'spider', 'ant', 'rat', 'cat', 'dog', 'bird', 'fish', 'snail', 'biohazard'] },
        { name: 'Tools', icon: Briefcase, terms: ['tool', 'wrench', 'hammer', 'drill', 'clipboard', 'file'] },
        { name: 'General', icon: Circle, terms: ['user', 'home', 'building', 'map', 'phone', 'mail'] },
    ];

    const filteredIcons = useMemo(() => {
        if (!searchTerm) return ValidIconNames.slice(0, 100); 
        
        // Search functionality
        return ValidIconNames.filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 150);
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
                className="w-full p-2 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none transition-colors focus:bg-[#1a1d1c] flex items-center justify-between group hover:border-pestGreen/50"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-pestGreen border border-white/5 group-hover:bg-pestGreen group-hover:text-white transition-colors">
                        <IconErrorBoundary fallback={<AlertTriangle size={18}/>}>
                            <CurrentIconComponent size={20} />
                        </IconErrorBoundary>
                    </div>
                    <div className="text-left">
                        <span className="block text-xs text-gray-500 font-bold uppercase">Selected</span>
                        <span className="text-sm font-bold">{value || 'Choose Icon'}</span>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
                        onClick={() => setIsOpen(false)} 
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1e201f] rounded-3xl shadow-3d max-w-5xl w-full mx-auto p-6 flex flex-col h-[85vh] border border-white/10"
                            onClick={e => e.stopPropagation()} 
                        >
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                <div>
                                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                                        Icon Library
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Select an icon for your content.</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Search and Filters */}
                            <div className="space-y-4 mb-6">
                                <div className="relative">
                                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search 1000+ icons (e.g. 'bug', 'check', 'home')..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:border-pestGreen focus:ring-1 focus:ring-pestGreen outline-none text-lg placeholder-gray-600 font-medium"
                                        autoFocus
                                    />
                                </div>
                                
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSearchTerm(cat.terms.join(' '))} // Quick hack to filter by these terms broadly
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-pestGreen hover:text-white rounded-xl border border-white/10 transition-all whitespace-nowrap text-sm font-bold text-gray-400"
                                        >
                                            <cat.icon size={16} /> {cat.name}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/20 rounded-xl border border-white/10 text-xs font-bold text-gray-400"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 p-2 custom-scrollbar bg-black/20 rounded-2xl border border-white/5">
                                {filteredIcons.length > 0 ? (
                                    filteredIcons.map(iconName => {
                                        const Icon = (LucideIcons as any)[iconName];
                                        // Skip invalid icons silently
                                        if (!Icon) return null;
                                        
                                        const isSelected = iconName === value;
                                        return (
                                            <button
                                                key={iconName}
                                                onClick={() => handleSelectIcon(iconName)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 group relative
                                                            ${isSelected ? 'bg-pestGreen text-white border-pestGreen shadow-lg scale-105 z-10' : 'bg-[#161817] border-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-105 hover:z-10'}`}
                                                title={iconName}
                                            >
                                                <IconErrorBoundary fallback={<AlertTriangle size={24} className="text-red-500"/>}>
                                                    <Icon size={24} className="mb-2" />
                                                </IconErrorBoundary>
                                                <span className="text-[9px] font-medium truncate w-full text-center opacity-70 group-hover:opacity-100">{iconName}</span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-20">
                                        <Search size={48} className="mb-4 opacity-20" />
                                        <p>No icons found matching "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4 text-center text-xs text-gray-600 font-medium uppercase tracking-widest">
                                Showing {filteredIcons.length} icons
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
