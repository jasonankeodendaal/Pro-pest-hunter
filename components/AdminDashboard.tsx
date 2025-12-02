import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { 
    Save, Image as ImageIcon, X, Plus, Trash2, LogOut, CheckCircle, 
    Layout, Info, Briefcase, List, MapPin, Shield,
    Phone, Globe, Clock, 
    BarChart3, Users, Calendar, AlertCircle, Search, ChevronRight, Video, Youtube, Image,
    User, HardHat, Mail, PhoneCall, Cake, Lock, FileText, Stethoscope, Heart, Clipboard, PlusCircle, Building2,
    MessageSquare, HelpCircle, MousePointerClick, FilePlus, PenTool, DollarSign, Download, Camera, ScanLine, Hash,
    Printer, CheckSquare, FileCheck, ArrowRightCircle, Send, ToggleLeft, ToggleRight,
    CreditCard, Bug, QrCode, FileStack, Edit, BookOpen, Workflow, Server, Cloud, Link, Circle, Code2, Terminal, Copy, Palette, Upload, Zap, Database, RotateCcw, Wifi, GitBranch, Globe2, Inbox, Activity, AlertTriangle, RefreshCw, Layers, Map, Award, ThumbsUp, SwatchBook, Menu, HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Employee, AdminMainTab, AdminSubTab, JobCard, ServiceItem, ProcessStep, FAQItem, WhyChooseUsItem, SocialLink, AdminDashboardProps, Location } from '../types';
import { Input, TextArea, Select, FileUpload, IconPicker } from './ui/AdminShared'; // Import IconPicker
import { JobCardManager } from './JobCardManager';

// --- HELPER COMPONENTS ---

const InfoBlock = ({ title, text, code }: { title: string; text: string, code?: string }) => (
  <div className="bg-[#0f1110] border border-white/10 rounded-xl p-4 mb-6 shadow-sm">
      <h4 className="text-pestGreen font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
          {title}
      </h4>
      <p className="text-gray-400 text-xs leading-relaxed font-medium tracking-wide mb-3">
          {text}
      </p>
      {code && (
          <div className="bg-black p-3 rounded-lg border border-white/5 relative group">
              <code className="text-blue-300 font-mono text-xs break-all">{code}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="absolute top-2 right-2 text-gray-500 hover:text-white"
                title="Copy"
              >
                  <Copy size={12} />
              </button>
          </div>
      )}
  </div>
);

const SectionHeader = ({ title, icon: Icon, description, action, onHelp }: { title: string; icon: React.ElementType; description?: string; action?: React.ReactNode, onHelp?: () => void }) => (
    <div className="mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-pestGreen/10 rounded-lg text-pestGreen">
                    <Icon size={24} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
                {onHelp && (
                    <button 
                        onClick={onHelp}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all border border-yellow-500/30"
                        title="Section Guide"
                    >
                        <Info size={16} />
                    </button>
                )}
                {action}
            </div>
        </div>
        {description && (
            <p className="text-gray-400 text-sm font-medium max-w-3xl leading-relaxed ml-11">
                {description}
            </p>
        )}
    </div>
);

// Explicitly define EditorLayout as a functional component to ensure children prop is recognized
const EditorLayout: React.FC<{ 
    title: string, 
    icon: React.ElementType, 
    description: string, // NEW: Mandatory description for sub-header
    helpText: string, 
    onSave: () => void, 
    children: React.ReactNode 
}> = ({ title, icon, description, helpText, onSave, children }) => {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in relative pb-20">
            <SectionHeader 
                title={title} 
                icon={icon} 
                description={description}
                onHelp={() => setShowHelp(!showHelp)} 
            />
            
            <AnimatePresence>
                {showHelp && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-24 right-0 z-50 w-80 bg-[#1e201f] border border-yellow-500/50 shadow-2xl rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                            <h4 className="text-yellow-500 font-bold flex items-center gap-2">
                                <Info size={16}/> Guide
                            </h4>
                            <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{helpText}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {children}

            <div className="fixed bottom-6 right-6 z-40">
                <button 
                    onClick={onSave}
                    className="bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-6 py-4 rounded-full font-bold transition-all shadow-3d hover:shadow-neon flex items-center gap-2"
                >
                    <Save size={20} /> <span className="hidden md:inline">Save Changes</span>
                </button>
            </div>
        </div>
    );
};

// --- EDITORS ---

const WhyChooseUsEditor = () => {
    const { content, updateWhyChooseUsItems, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.whyChooseUs || { title: '', subtitle: '', items: [] });

    const handleItemChange = (index: number, field: keyof WhyChooseUsItem, value: string) => {
        const newItems = [...(localData.items || [])];
        if (newItems[index]) {
            newItems[index] = { ...newItems[index], [field]: value };
            setLocalData({ ...localData, items: newItems });
        }
    };

    const handleDeleteItem = (index: number) => {
        if(confirm("Delete this reason card?")) {
            const newItems = (localData.items || []).filter((_, i) => i !== index);
            setLocalData({ ...localData, items: newItems });
        }
    };

    const handleAddItem = () => {
        setLocalData({
            ...localData,
            items: [...(localData.items || []), { title: "New Reason", text: "Description", iconName: "Award" }]
        });
    };

    return (
        <EditorLayout
            title="Why Choose Us"
            icon={ThumbsUp}
            description="Manage the key reasons displayed on the homepage that distinguish your business from competitors."
            helpText="Edit the 6 reasons why clients should choose you. These appear on the Home and About pages."
            onSave={() => { updateContent('whyChooseUs', { title: localData.title, subtitle: localData.subtitle }); updateWhyChooseUsItems(localData.items || []); }}
        >
             <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 mb-6">
                <h3 className="text-white font-bold mb-4">Section Header</h3>
                <Input label="Section Title" value={localData.title || ''} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                <Input label="Subtitle" value={localData.subtitle || ''} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} />
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">Reason Cards</h3>
                <button onClick={handleAddItem} className="bg-pestGreen text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Card</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {(localData.items || []).map((item, idx) => (
                    <div key={idx} className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 relative group">
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteItem(idx); }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <Trash2 size={16}/>
                        </button>
                        <Input label="Title" value={item.title} onChange={(v: string) => handleItemChange(idx, 'title', v)} className="mb-4" />
                        <TextArea label="Description" value={item.text} onChange={(v: string) => handleItemChange(idx, 'text', v)} rows={3} className="mb-4" />
                        <IconPicker label="Icon Name" value={item.iconName} onChange={(v: string) => handleItemChange(idx, 'iconName', v)} />
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const CompanyEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.company);
    const [bankData, setBankData] = useState(content.bankDetails);
    const [newSocial, setNewSocial] = useState<Partial<SocialLink>>({ name: '', url: '', icon: '' });
    
    const update = (updates: any) => setLocalData(prev => ({ ...prev, ...updates }));
    const updateBank = (updates: any) => setBankData(prev => ({ ...prev, ...updates }));

    const handleSave = () => {
        updateContent('company', localData);
        updateContent('bankDetails', bankData);
    };

    const handleAddSocial = () => {
        if (!newSocial.name || !newSocial.url) return;
        const link: SocialLink = {
            id: Date.now().toString(),
            name: newSocial.name,
            url: newSocial.url,
            icon: newSocial.icon || ''
        };
        update({ socials: [...(localData.socials || []), link] });
        setNewSocial({ name: '', url: '', icon: '' });
    };

    const handleDeleteSocial = (id: string) => {
        update({ socials: (localData.socials || []).filter(s => s.id !== id) });
    };

    return (
        <EditorLayout
            title="Company Information"
            icon={Building2}
            description="Update core business details, operating hours, social media links, and banking information used on invoices."
            helpText="Manage core business details. 'Bank Details' are used on invoices generated by the system."
            onSave={handleSave}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Core Details</h3>
                    <Input label="Company Name" value={localData.name} onChange={(v: string) => update({ name: v })} />
                    <Input label="Registration Number" value={localData.regNumber} onChange={(v: string) => update({ regNumber: v })} />
                    <Input label="VAT Number" value={localData.vatNumber} onChange={(v: string) => update({ vatNumber: v })} />
                    <Input label="Experience (Years)" type="number" value={localData.yearsExperience} onChange={(v: string) => update({ yearsExperience: parseInt(v) })} />
                </div>
                
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Contact Info</h3>
                    <Input label="Phone Number" value={localData.phone} onChange={(v: string) => update({ phone: v })} />
                    <Input label="Email Address" value={localData.email} onChange={(v: string) => update({ email: v })} />
                    <TextArea label="Physical Address" value={localData.address} onChange={(v: string) => update({ address: v })} rows={3} />
                </div>
                
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Operating Hours</h3>
                    <Input label="Weekdays" value={localData.hours?.weekdays || ''} onChange={(v: string) => update({ hours: { ...localData.hours, weekdays: v } })} />
                    <Input label="Saturday" value={localData.hours?.saturday || ''} onChange={(v: string) => update({ hours: { ...localData.hours, saturday: v } })} />
                    <Input label="Sunday" value={localData.hours?.sunday || ''} onChange={(v: string) => update({ hours: { ...localData.hours, sunday: v } })} />
                </div>

                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Branding</h3>
                    <FileUpload label="Company Logo" value={localData.logo} onChange={(v: string) => update({ logo: v })} />
                </div>

                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-2">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Social Media Links</h3>
                    
                    {/* List Existing */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {(localData.socials || []).map(social => (
                            <div key={social.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 group relative">
                                <div className="w-10 h-10 bg-white/10 rounded-lg p-1 flex-shrink-0">
                                    {social.icon && <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />}
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-white font-bold text-sm truncate">{social.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{social.url}</p>
                                </div>
                                <button onClick={() => handleDeleteSocial(social.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>

                    {/* Add New */}
                    <div className="bg-white/5 p-4 rounded-xl border border-dashed border-white/20">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Add New Link</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <Input placeholder="Name (e.g. TikTok)" value={newSocial.name} onChange={(v: string) => setNewSocial({...newSocial, name: v})} />
                             <Input placeholder="URL (https://...)" value={newSocial.url} onChange={(v: string) => setNewSocial({...newSocial, url: v})} />
                             <div className="flex gap-2">
                                <div className="flex-1">
                                    <FileUpload label="Icon" value={newSocial.icon} onChange={(v: string) => setNewSocial({...newSocial, icon: v})} />
                                </div>
                                <button onClick={handleAddSocial} className="bg-pestGreen text-white px-4 rounded-lg font-bold self-end h-12 flex items-center justify-center"><Plus size={20}/></button>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-2">
                    <h3 className="text-pestGreen font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2"><CreditCard size={18}/> Bank Details (For Invoices)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Bank Name" value={bankData.bankName} onChange={(v: string) => updateBank({ bankName: v })} />
                        <Input label="Account Name" value={bankData.accountName} onChange={(v: string) => updateBank({ accountName: v })} />
                        <Input label="Account Number" value={bankData.accountNumber} onChange={(v: string) => updateBank({ accountNumber: v })} />
                        <Input label="Branch Code" value={bankData.branchCode} onChange={(v: string) => updateBank({ branchCode: v })} />
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

const LocationsEditor = () => {
    const { content, updateLocations } = useContent();
    const [localData, setLocalData] = useState(content.locations);

    const handleUpdate = (index: number, field: keyof Location, value: any) => {
        const newData = [...localData];
        newData[index] = { ...newData[index], [field]: value };
        if (field === 'isHeadOffice' && value === true) {
            newData.forEach((loc, i) => {
                if (i !== index) loc.isHeadOffice = false;
            });
        }
        setLocalData(newData);
    };

    const handleAdd = () => {
        const newLoc: Location = {
            id: `loc-${Date.now()}`,
            name: 'New Branch',
            address: '',
            phone: '',
            email: '',
            isHeadOffice: false,
            image: null
        };
        setLocalData([...localData, newLoc]);
    };

    const handleDelete = (index: number) => {
        if(confirm("Delete location?")) {
            setLocalData(localData.filter((_, i) => i !== index));
        }
    };

    return (
        <EditorLayout
            title="Physical Locations"
            icon={MapPin}
            description="Manage your physical shop or office addresses displayed on the Contact page."
            helpText="Add or remove branch locations. Mark one as 'Head Office'."
            onSave={() => updateLocations(localData)}
        >
             <div className="flex justify-end mb-4">
                <button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Location</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localData.map((loc, idx) => (
                    <div key={loc.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative group space-y-4">
                         <div className="flex justify-between items-start">
                             <h3 className="text-white font-bold text-lg">Location #{idx+1}</h3>
                             <button onClick={() => handleDelete(idx)} className="text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                         </div>
                         
                         <Input label="Name" value={loc.name} onChange={(v: string) => handleUpdate(idx, 'name', v)} />
                         <TextArea label="Address" value={loc.address} onChange={(v: string) => handleUpdate(idx, 'address', v)} rows={2} />
                         
                         <div className="grid grid-cols-2 gap-4">
                            <Input label="Phone" value={loc.phone} onChange={(v: string) => handleUpdate(idx, 'phone', v)} />
                            <Input label="Email" value={loc.email} onChange={(v: string) => handleUpdate(idx, 'email', v)} />
                         </div>

                         <div className="flex items-center gap-2 pt-2">
                             <input 
                                type="checkbox" 
                                checked={loc.isHeadOffice} 
                                onChange={(e) => handleUpdate(idx, 'isHeadOffice', e.target.checked)}
                                className="w-4 h-4 accent-pestGreen"
                             />
                             <label className="text-white text-sm font-bold">Head Office / HQ</label>
                         </div>

                         <FileUpload label="Location Image" value={loc.image} onChange={(v: string) => handleUpdate(idx, 'image', v)} />
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const ContactEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.contact);
    const [bookData, setBookData] = useState(content.bookCTA);

    const handleSave = () => {
        updateContent('contact', localData);
        updateContent('bookCTA', bookData);
    };

    const handleUrlChange = (v: string) => {
        let clean = v;
        if (clean.includes('<iframe') && clean.includes('src="')) {
            const match = clean.match(/src="([^"]+)"/);
            if (match && match[1]) {
                clean = match[1];
            }
        }
        setLocalData({ ...localData, mapEmbedUrl: clean });
    }

    return (
        <EditorLayout
            title="Contact & CTA"
            icon={Phone}
            description="Customize the Contact Us page headings, map location, and the main 'Book Now' call-to-action banner."
            helpText="Edit the contact page map and the 'Book Now' banner found on the home page."
            onSave={handleSave}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold">Contact Page Details</h3>
                    <Input label="Header Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <Input label="Subtitle" value={localData.subtitle} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} />
                    <Input label="Form Title" value={localData.formTitle} onChange={(v: string) => setLocalData({ ...localData, formTitle: v })} />
                    <TextArea 
                        label="Google Maps Embed URL (iframe src)" 
                        value={localData.mapEmbedUrl} 
                        onChange={handleUrlChange}
                        rows={3} 
                        placeholder="Paste URL or <iframe> here..."
                    />
                     <div className="text-xs text-gray-500 italic mt-2 bg-blue-500/10 p-2 rounded border border-blue-500/20 text-blue-300">
                        <Info size={12} className="inline mr-1"/>
                        Tip: You must use the "Embed a map" URL from Google Maps (it starts with <code>https://www.google.com/maps/embed</code>). Normal sharing links (<code>maps.app.goo.gl</code>) will not work.
                    </div>
                    {/* PREVIEW */}
                    <div className="mt-4 rounded-xl overflow-hidden h-48 border border-white/10 bg-black/20 relative">
                        {localData.mapEmbedUrl ? (
                                <iframe 
                                src={localData.mapEmbedUrl} 
                                className="w-full h-full" 
                                title="Map Preview"
                                loading="lazy"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold text-xs uppercase tracking-widest">
                                No Valid Map URL
                            </div>
                        )}
                        <div className="absolute top-0 right-0 bg-pestGreen text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">PREVIEW</div>
                    </div>
                </div>

                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold">Book Now Banner (CTA)</h3>
                    <Input label="Banner Title" value={bookData.title} onChange={(v: string) => setBookData({ ...bookData, title: v })} />
                    <TextArea label="Banner Subtitle" value={bookData.subtitle} onChange={(v: string) => setBookData({ ...bookData, subtitle: v })} rows={2} />
                    <Input label="Button Text" value={bookData.buttonText} onChange={(v: string) => setBookData({ ...bookData, buttonText: v })} />
                    <FileUpload label="Banner Background Image" value={bookData.bgImage} onChange={(v: string) => setBookData({ ...bookData, bgImage: v })} />
                </div>
            </div>
        </EditorLayout>
    );
};

const HeroEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.hero);
    const update = (updates: any) => setLocalData(prev => ({ ...prev, ...updates }));

    return (
        <EditorLayout
            title="Hero Section"
            icon={Layout}
            description="Control the first impression of your website with custom headlines, buttons, and background media (Video/Image)."
            helpText="The Hero section is the first thing visitors see. Choose between a Static Image, a Video Loop (MP4), or an Image Carousel."
            onSave={() => updateContent('hero', localData)}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <TextArea label="Headline" value={localData.headline} onChange={(v: string) => update({ headline: v })} rows={2} />
                    <TextArea label="Subheadline" value={localData.subheadline} onChange={(v: string) => update({ subheadline: v })} rows={2} />
                    <Input label="Button Text" value={localData.buttonText} onChange={(v: string) => update({ buttonText: v })} />
                </div>
                
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Visual Media</h3>
                    <Select 
                        label="Media Type" 
                        value={localData.mediaType || 'video'} 
                        options={[{label:'Video Loop', value:'video'}, {label:'Static Image', value:'static'}, {label:'Image Carousel', value:'imageCarousel'}]}
                        onChange={(v: string) => update({ mediaType: v })} 
                    />
                    
                    {localData.mediaType === 'video' && (
                        <FileUpload 
                            label="Video File (MP4/WebM)" 
                            value={localData.mediaVideo} 
                            onChange={(v: string) => update({ mediaVideo: v })} 
                            accept="video/mp4,video/webm,image/*" 
                        />
                    )}

                    {localData.mediaType === 'static' && (
                        <FileUpload label="Background Image" value={localData.bgImage} onChange={(v: string) => update({ bgImage: v })} />
                    )}

                    {localData.mediaType === 'imageCarousel' && (
                         <div className="space-y-4">
                            <FileUpload 
                                label="Carousel Images" 
                                value={localData.mediaImages || []} 
                                onChange={(v: string[]) => update({ mediaImages: v })} 
                                multiple={true}
                            />
                            <Input label="Interval (ms)" type="number" value={localData.carouselInterval || 3000} onChange={(v: string) => update({ carouselInterval: parseInt(v) })} />
                         </div>
                    )}
                    
                    <Input label="Overlay Opacity (%)" type="number" value={localData.overlayOpacity} onChange={(v: string) => update({ overlayOpacity: parseInt(v) })} />
                </div>
            </div>
        </EditorLayout>
    );
};

const AboutEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.about);
    const update = (updates: any) => setLocalData(prev => ({ ...prev, ...updates }));

    return (
        <EditorLayout
            title="About Us Section"
            icon={Info}
            description="Edit the company history, mission statement, and owner profile displayed on the About page."
            helpText="Manage the story, mission statement, and owner profile image."
            onSave={() => updateContent('about', localData)}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Main Story</h3>
                    <Input label="Title" value={localData.title} onChange={(v: string) => update({ title: v })} />
                    <TextArea label="Main Text" value={localData.text} onChange={(v: string) => update({ text: v })} rows={8} />
                </div>
                
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Mission & Visuals</h3>
                    <Input label="Mission Title" value={localData.missionTitle} onChange={(v: string) => update({ missionTitle: v })} />
                    <TextArea label="Mission Text" value={localData.missionText} onChange={(v: string) => update({ missionText: v })} rows={3} />
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <FileUpload label="Owner / Team Image" value={localData.ownerImage} onChange={(v: string) => update({ ownerImage: v })} />
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

const ServicesEditor = () => {
    const { content, updateService } = useContent();
    const [localServices, setLocalServices] = useState(content.services || []);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempService, setTempService] = useState<ServiceItem | null>(null);

    useEffect(() => {
        setLocalServices(content.services || []);
    }, [content.services]);

    const handleEdit = (service: ServiceItem) => {
        setEditingId(service.id);
        setTempService({ ...service, details: service.details || [] });
    };

    const handleNew = () => {
        const newService: ServiceItem = {
            id: `srv-${Date.now()}`,
            title: 'New Service',
            description: 'Short description for card.',
            fullDescription: 'Detailed description for modal.',
            details: ['Detail 1', 'Detail 2'],
            iconName: 'Bug',
            visible: true,
            featured: false,
            price: 'From R500'
        };
        setTempService(newService);
        setEditingId(newService.id);
    };

    const handleSaveTemp = () => {
        if (!tempService) return;
        const exists = localServices.find(s => s.id === tempService.id);
        let updatedList;
        if (exists) {
            updatedList = localServices.map(s => s.id === tempService.id ? tempService : s);
        } else {
            updatedList = [...localServices, tempService];
        }
        setLocalServices(updatedList);
        setEditingId(null);
        setTempService(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            const updated = localServices.filter(s => s.id !== id);
            setLocalServices(updated);
        }
    };

    const handleDetailChange = (index: number, val: string) => {
        if (!tempService) return;
        const newDetails = [...(tempService.details || [])];
        newDetails[index] = val;
        setTempService({ ...tempService, details: newDetails });
    };

    const addDetail = () => {
        if (!tempService) return;
        setTempService({ ...tempService, details: [...(tempService.details || []), 'New Detail'] });
    };

    const removeDetail = (index: number) => {
        if (!tempService) return;
        setTempService({ ...tempService, details: (tempService.details || []).filter((_, i) => i !== index) });
    };

    const handleGlobalSave = () => {
        updateService(localServices);
    };

    if (editingId && tempService) {
        return (
            <div className="space-y-6 animate-in fade-in pb-20">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Edit Service</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white/10 text-white rounded-lg">Cancel</button>
                        <button onClick={handleSaveTemp} className="px-4 py-2 bg-pestGreen text-white rounded-lg font-bold flex items-center gap-2"><CheckCircle size={16}/> Done (Ready to Save)</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-6">
                    <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                        <Input label="Service Title" value={tempService.title} onChange={(v: string) => setTempService({ ...tempService, title: v })} />
                        <Input label="Price (e.g. From R850)" value={tempService.price} onChange={(v: string) => setTempService({ ...tempService, price: v })} />
                        <IconPicker label="Icon Name" value={tempService.iconName} onChange={(v: string) => setTempService({ ...tempService, iconName: v })} />
                        <div className="flex gap-4 pt-2">
                             <label className="flex items-center gap-2 text-white cursor-pointer">
                                 <input type="checkbox" checked={tempService.visible} onChange={e => setTempService({...tempService, visible: e.target.checked})} />
                                 Visible
                             </label>
                             <label className="flex items-center gap-2 text-white cursor-pointer">
                                 <input type="checkbox" checked={tempService.featured} onChange={e => setTempService({...tempService, featured: e.target.checked})} />
                                 Featured
                             </label>
                        </div>
                    </div>

                    <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                        <FileUpload label="Service Image" value={tempService.image} onChange={(v: string) => setTempService({ ...tempService, image: v })} />
                        <TextArea label="Short Description (Card)" value={tempService.description} onChange={(v: string) => setTempService({ ...tempService, description: v })} rows={3} />
                    </div>

                    <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-2">
                        <TextArea label="Full Description (Panel)" value={tempService.fullDescription} onChange={(v: string) => setTempService({ ...tempService, fullDescription: v })} rows={4} />
                        
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bullet Points (Details)</label>
                        <div className="space-y-2">
                            {(tempService.details || []).map((detail, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={detail} 
                                        onChange={(e) => handleDetailChange(idx, e.target.value)}
                                        className="flex-1 p-2 bg-black/30 border border-white/10 rounded-lg text-white"
                                    />
                                    <button onClick={() => removeDetail(idx)} className="text-red-500 hover:bg-white/5 p-2 rounded"><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button onClick={addDetail} className="text-pestGreen text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={14}/> Add Point</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <EditorLayout
            title="Manage Services"
            icon={Zap}
            description="Add, edit, or remove service offerings. These appear on the Services page and in the booking menu."
            helpText="Add, edit, or remove services offered. Changes are only applied when you click 'Save Changes'."
            onSave={handleGlobalSave}
        >
            <div className="flex justify-end mb-4">
                <button onClick={handleNew} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Service</button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {localServices.map(service => (
                    <div key={service.id} className={`p-3 md:p-6 rounded-2xl border transition-all ${service.visible ? 'bg-[#161817] border-white/5' : 'bg-red-500/5 border-red-500/20 opacity-75'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-pestGreen/20 rounded-lg flex items-center justify-center text-pestGreen">
                                <Icons.Zap size={20} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(service)} className="p-2 hover:bg-white/10 rounded-full text-white"><Edit size={16}/></button>
                                <button 
                                    type="button" 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(service.id); }} 
                                    className="p-2 hover:bg-red-500/20 rounded-full text-red-500 relative z-20"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-white text-lg leading-tight">{service.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-2">{service.description}</p>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {service.featured && <span className="text-[10px] bg-yellow-500 text-black px-2 py-1 rounded font-bold uppercase">Featured</span>}
                            {!service.visible && <span className="text-[10px] bg-red-500 text-white px-2 py-1 rounded font-bold uppercase">Hidden</span>}
                        </div>
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const ProcessEditor = () => {
    const { content, updateContent } = useContent();
    const [localProcess, setLocalProcess] = useState(content.process || { title: '', subtitle: '', steps: [] });

    const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
        const newSteps = [...(localProcess.steps || [])];
        if (newSteps[index]) {
            newSteps[index] = { ...newSteps[index], [field]: value };
            setLocalProcess(prev => ({ ...prev, steps: newSteps }));
        }
    };

    const handleDeleteStep = (index: number) => {
        if(confirm("Delete this step?")) {
            const newSteps = (localProcess.steps || []).filter((_, i) => i !== index);
            setLocalProcess(prev => ({ ...prev, steps: newSteps }));
        }
    }

    return (
        <EditorLayout
            title="Process Section"
            icon={Workflow}
            description="Define the step-by-step workflow displayed to clients, establishing trust and clarity."
            helpText="Describe your workflow steps. These icons correspond to Lucide React icons."
            onSave={() => updateContent('process', localProcess)}
        >
            <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 mb-8">
                <h3 className="text-white font-bold mb-4">Section Headings</h3>
                <Input label="Title" value={localProcess.title || ''} onChange={(v: string) => setLocalProcess({ ...localProcess, title: v })} />
                <TextArea label="Subtitle" value={localProcess.subtitle || ''} onChange={(v: string) => setLocalProcess({ ...localProcess, subtitle: v })} rows={2} />
            </div>

            <div className="space-y-4">
                <h3 className="text-white font-bold px-1">Workflow Steps</h3>
                {(localProcess.steps || []).map((step, idx) => (
                    <div key={idx} className="bg-[#161817] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-start relative group">
                        <button 
                            onClick={() => handleDeleteStep(idx)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <Trash2 size={16}/>
                        </button>
                        <div className="bg-white/5 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold shrink-0 self-start">{step.step}</div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
                            <Input label="Step Title" value={step.title} onChange={(v: string) => handleStepChange(idx, 'title', v)} />
                            <IconPicker label="Icon Name" value={step.iconName} onChange={(v: string) => handleStepChange(idx, 'iconName', v)} />
                            <div className="col-span-2 md:col-span-3">
                                <TextArea label="Description" value={step.description} onChange={(v: string) => handleStepChange(idx, 'description', v)} rows={2} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const ServiceAreaEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState({ 
        title: content.serviceArea?.title || '', 
        description: content.serviceArea?.description || '', 
        towns: content.serviceArea?.towns || [], 
        mapEmbedUrl: content.serviceArea?.mapEmbedUrl || ''
    });
    const [newTown, setNewTown] = useState('');

    const handleAddTown = () => {
        if (!newTown.trim()) return;
        setLocalData(prev => ({ ...prev, towns: [...prev.towns, newTown.trim()] }));
        setNewTown('');
    };

    const handleRemoveTown = (index: number) => {
        setLocalData(prev => ({ ...prev, towns: prev.towns.filter((_, i) => i !== index) }));
    };

    const handleUrlChange = (val: string) => {
        let clean = val;
        if (clean.includes('<iframe') && clean.includes('src="')) {
            const match = clean.match(/src="([^"]+)"/);
            if (match && match[1]) {
                clean = match[1];
            }
        }
        setLocalData({ ...localData, mapEmbedUrl: clean });
    }

    return (
        <EditorLayout
            title="Service Area"
            icon={MapPin}
            description="Specify the towns and regions you cover. This helps clients know if they fall within your service zone."
            helpText="The 'Towns' list populates the interactive map tags. Paste a Google Maps Embed URL to display the map."
            onSave={() => updateContent('serviceArea', { ...localData, mapImage: null })}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <Input label="Title" value={localData.title || ''} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <TextArea label="Description" value={localData.description || ''} onChange={(v: string) => setLocalData({ ...localData, description: v })} rows={4} />
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">Covered Locations</label>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text" 
                                value={newTown}
                                onChange={(e) => setNewTown(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTown()}
                                placeholder="Add town (e.g. White River)"
                                className="flex-1 p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none transition-colors focus:bg-[#1a1d1c]"
                            />
                            <button onClick={handleAddTown} className="bg-pestGreen text-white px-4 rounded-xl hover:bg-white hover:text-pestGreen transition-colors"><Plus size={20}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {localData.towns.map((town, idx) => (
                                <div key={idx} className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-sm text-white flex items-center gap-2">
                                    {town}
                                    <button onClick={() => handleRemoveTown(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Map Visual</h3>
                    <TextArea 
                        label="Google Maps Embed URL (Iframe src)" 
                        value={localData.mapEmbedUrl || ''} 
                        onChange={handleUrlChange} 
                        rows={3} 
                        placeholder="Paste the URL or the full <iframe> tag here..."
                    />
                    <div className="text-xs text-gray-500 italic mt-2 bg-blue-500/10 p-2 rounded border border-blue-500/20 text-blue-300">
                        <Info size={12} className="inline mr-1"/>
                        Tip: You must use the "Embed a map" URL from Google Maps (it starts with <code>https://www.google.com/maps/embed</code>). Normal sharing links (<code>maps.app.goo.gl</code>) will not work.
                    </div>
                    <div className="mt-4 rounded-xl overflow-hidden h-48 border border-white/10 bg-black/20 relative">
                        {localData.mapEmbedUrl ? (
                                <iframe 
                                src={localData.mapEmbedUrl} 
                                className="w-full h-full" 
                                title="Map Preview"
                                loading="lazy"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold text-xs uppercase tracking-widest">
                                No Valid Map URL
                            </div>
                        )}
                        <div className="absolute top-0 right-0 bg-pestGreen text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">PREVIEW</div>
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

const SafetyEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.safety);

    return (
        <EditorLayout
            title="Safety & Certification"
            icon={Shield}
            description="Highlight your safety standards, compliance badges, and certifications to build trust."
            helpText="Upload compliance certificates (Sapca, etc.) and define your 3 key safety badges."
            onSave={() => updateContent('safety', localData)}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Safety Promise</h3>
                    <Input label="Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <TextArea label="Description" value={localData.description} onChange={(v: string) => setLocalData({ ...localData, description: v })} rows={4} />
                </div>
                
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Badges & Certs</h3>
                    <div className="flex items-center gap-2">
                        <Input label="Badge 1 Text" value={localData.badge1} onChange={(v: string) => setLocalData({ ...localData, badge1: v })} />
                        <IconPicker label="Icon" value={localData.badge1IconName} onChange={(v: string) => setLocalData({ ...localData, badge1IconName: v })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input label="Badge 2 Text" value={localData.badge2} onChange={(v: string) => setLocalData({ ...localData, badge2: v })} />
                        <IconPicker label="Icon" value={localData.badge2IconName} onChange={(v: string) => setLocalData({ ...localData, badge2IconName: v })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input label="Badge 3 Text" value={localData.badge3} onChange={(v: string) => setLocalData({ ...localData, badge3: v })} />
                        <IconPicker label="Icon" value={localData.badge3IconName} onChange={(v: string) => setLocalData({ ...localData, badge3IconName: v })} />
                    </div>
                    <div className="mt-4">
                        <FileUpload label="Certificates (Images)" value={localData.certificates} onChange={(v: string[]) => setLocalData({ ...localData, certificates: v })} multiple={true} />
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

const FaqEditor = () => {
    const { content, updateFaqs } = useContent();
    const [localFaqs, setLocalFaqs] = useState(content.faqs || []);

    const handleUpdate = (index: number, field: keyof FAQItem, value: string) => {
        const newFaqs = [...localFaqs];
        if (newFaqs[index]) {
            newFaqs[index] = { ...newFaqs[index], [field]: value };
            setLocalFaqs(newFaqs);
        }
    };

    const handleAdd = () => {
        const newFaq: FAQItem = { id: `faq-${Date.now()}`, question: 'New Question?', answer: 'Answer here.' };
        setLocalFaqs([...localFaqs, newFaq]);
    };

    const handleDelete = (index: number) => {
        const newFaqs = localFaqs.filter((_, i) => i !== index);
        setLocalFaqs(newFaqs);
    };

    return (
        <EditorLayout
            title="Frequently Asked Questions"
            icon={HelpCircle}
            description="Curate a list of frequently asked questions to answer common client queries immediately."
            helpText="Add common questions to reduce support calls. Keep answers concise."
            onSave={() => updateFaqs(localFaqs)}
        >
            <div className="flex justify-end mb-4">
                 <button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add FAQ</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {localFaqs.map((faq, idx) => (
                    <div key={faq.id} className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 relative group col-span-1">
                        <button onClick={() => handleDelete(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        <Input label="Question" value={faq.question} onChange={(v: string) => handleUpdate(idx, 'question', v)} className="mb-4 font-bold" />
                        <TextArea label="Answer" value={faq.answer} onChange={(v: string) => handleUpdate(idx, 'answer', v)} rows={2} />
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const SeoEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.seo);

    return (
        <EditorLayout
            title="SEO Settings"
            icon={Search}
            description="Optimize your website metadata to improve ranking on Google Search."
            helpText="Optimize for Google search. 'Meta Title' and 'Description' are what appear in search results."
            onSave={() => updateContent('seo', localData)}
        >
            <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 grid grid-cols-2 gap-3 md:gap-6">
                <div className="col-span-2">
                    <Input label="Meta Title" value={localData.metaTitle} onChange={(v: string) => setLocalData({ ...localData, metaTitle: v })} />
                </div>
                <div className="col-span-2">
                     <TextArea label="Meta Description" value={localData.metaDescription} onChange={(v: string) => setLocalData({ ...localData, metaDescription: v })} rows={3} />
                </div>
                <div className="col-span-1">
                     <TextArea label="Keywords" value={localData.keywords} onChange={(v: string) => setLocalData({ ...localData, keywords: v })} rows={2} />
                </div>
                <div className="col-span-1">
                    <FileUpload label="Social Share Image (OG Image)" value={localData.ogImage} onChange={(v: string) => setLocalData({ ...localData, ogImage: v })} />
                </div>
                <div className="col-span-1">
                    <Input label="Canonical URL" value={localData.canonicalUrl || ''} onChange={(v: string) => setLocalData({ ...localData, canonicalUrl: v })} />
                </div>
                 <div className="col-span-1">
                     <Input label="Robots" value={localData.robotsDirective || 'index, follow'} onChange={(v: string) => setLocalData({ ...localData, robotsDirective: v })} />
                 </div>
                 <div className="col-span-2">
                     <TextArea label="Structured Data (JSON-LD)" value={localData.structuredDataJSON} onChange={(v: string) => setLocalData({ ...localData, structuredDataJSON: v })} rows={6} />
                 </div>
            </div>
        </EditorLayout>
    );
};

const CreatorDashboard = () => {
    const { content, updateContent, resetSystem, clearSystem, downloadBackup, restoreBackup, connectionError, retryConnection } = useContent();
    const [localData, setLocalData] = useState(content.creatorWidget);

    if (!localData) return null;

    return (
        <EditorLayout
            title="Creator & System Dashboard"
            icon={Code2}
            description="Advanced system configuration, developer widget settings, and database management."
            helpText="Zero to Hero Setup and System Tools."
            onSave={() => updateContent('creatorWidget', localData)}
        >
            <div className="mb-6 grid grid-cols-2 gap-3 md:gap-6">
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Wifi size={18}/> Connection Status</h3>
                    {connectionError ? (
                         <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                            <p className="text-xs text-red-200 font-bold mb-1">Connection Lost</p>
                            <p className="text-xs text-gray-400 mb-2">{connectionError}</p>
                            <button onClick={retryConnection} className="text-[10px] bg-red-500 text-white px-3 py-2 rounded font-bold hover:bg-red-400 w-full">Retry Connection</button>
                        </div>
                    ) : (
                        <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
                            <p className="text-xs text-green-200 font-bold flex items-center gap-2"><CheckCircle size={14}/> System Online</p>
                            <p className="text-xs text-gray-400 mt-1">Database connection active.</p>
                        </div>
                    )}
                </div>

                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                     <h3 className="text-white font-bold mb-2 flex items-center gap-2"><HardDrive size={18}/> Storage Indication</h3>
                     <div className="p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                         <div className="flex justify-between text-xs text-blue-200 font-bold mb-1">
                             <span>Storage Used</span>
                             <span>~45 MB</span>
                         </div>
                         <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full w-[15%]"></div>
                         </div>
                         <p className="text-[10px] text-gray-500 mt-2">Local SQLite / Postgres DB</p>
                     </div>
                </div>
            </div>

             <div className="mb-6 grid grid-cols-2 gap-3 md:gap-6">
                 <div className="col-span-1 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <h4 className="text-blue-400 font-bold text-sm uppercase mb-3 flex items-center gap-2"><Database size={16}/> Backup & Restore</h4>
                    <div className="space-y-3">
                        <button onClick={downloadBackup} className="w-full text-left text-xs font-bold text-white hover:text-blue-400 flex items-center gap-2 bg-blue-500/10 p-2 rounded-lg"><Download size={14}/> Download Backup</button>
                        <label className="w-full text-left text-xs font-bold text-white hover:text-blue-400 flex items-center gap-2 cursor-pointer bg-blue-500/10 p-2 rounded-lg">
                            <Upload size={14}/> Restore Backup
                            <input type="file" className="hidden" accept=".json" onChange={(e) => {
                                if(e.target.files?.[0]) {
                                    if(confirm("Restore backup? This overwrites current data.")) {
                                        restoreBackup(e.target.files[0]).then(success => {
                                            if(success) alert("Restored Successfully!");
                                            else alert("Restore Failed.");
                                        });
                                    }
                                }
                            }}/>
                        </label>
                    </div>
                </div>

                <div className="col-span-1 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <h4 className="text-red-400 font-bold text-sm uppercase mb-3 flex items-center gap-2"><AlertTriangle size={16}/> Danger Zone</h4>
                    <div className="space-y-3">
                        <button onClick={resetSystem} className="w-full text-left text-xs font-bold text-white hover:text-red-400 flex items-center gap-2 bg-red-500/10 p-2 rounded-lg"><RefreshCw size={14}/> Reset Demo Data</button>
                        <button onClick={() => { if(confirm("NUKE DATABASE? This will delete ALL data.")) clearSystem(); }} className="w-full text-left text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-2 bg-red-500/10 p-2 rounded-lg"><Trash2 size={14}/> Nuke System</button>
                    </div>
                </div>
             </div>


            <div className="grid grid-cols-2 gap-3 md:gap-6">
                 <div className="col-span-2">
                     <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Widget Settings</h3>
                 </div>
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <Input label="Slogan" value={localData.slogan} onChange={(v: string) => setLocalData({ ...localData, slogan: v })} />
                    <TextArea label="CTA Text" value={localData.ctaText} onChange={(v: string) => setLocalData({ ...localData, ctaText: v })} rows={3} />
                </div>
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                    <h3 className="text-white font-bold mb-4">Images</h3>
                    <FileUpload label="Logo" value={localData.logo} onChange={(v: string) => setLocalData({ ...localData, logo: v })} />
                    <FileUpload label="Background" value={localData.background} onChange={(v: string) => setLocalData({ ...localData, background: v })} />
                </div>
                <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-2">
                    <h3 className="text-white font-bold mb-4">Contact Icons</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FileUpload label="WhatsApp Icon" value={localData.whatsappIcon} onChange={(v: string) => setLocalData({ ...localData, whatsappIcon: v })} />
                        <FileUpload label="Email Icon" value={localData.emailIcon} onChange={(v: string) => setLocalData({ ...localData, emailIcon: v })} />
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

const EmployeeEditor = () => {
    const { content, addEmployee, updateEmployee, deleteEmployee } = useContent();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempEmp, setTempEmp] = useState<Employee | null>(null);

    const handleEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setTempEmp({ ...emp });
    };

    const handleSave = () => {
        if (!tempEmp) return;
        if (content.employees.find(e => e.id === tempEmp.id)) {
            updateEmployee(tempEmp.id, tempEmp);
        } else {
            addEmployee(tempEmp);
        }
        setEditingId(null);
        setTempEmp(null);
    };

    const handleNew = () => {
        const newEmp: Employee = {
            id: `emp-${Date.now()}`,
            fullName: 'New Employee',
            email: '',
            tel: '',
            jobTitle: 'Technician',
            startDate: new Date().toISOString(),
            loginName: '',
            pin: '0000',
            documents: [],
            doctorsNumbers: [],
            profileImage: null,
            idNumber: '',
            permissions: {
                isAdmin: false,
                canDoAssessment: true,
                canCreateQuotes: false,
                canExecuteJob: true,
                canInvoice: false,
                canViewReports: false,
                canManageEmployees: false,
                canEditSiteContent: false
            }
        };
        setTempEmp(newEmp);
        setEditingId(newEmp.id);
    };

    if (editingId && tempEmp) {
        return (
             <div className="space-y-6 animate-in fade-in pb-20">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Edit Employee</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white/10 text-white rounded-lg">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-pestGreen text-white rounded-lg font-bold flex items-center gap-2"><Save size={16}/> Save Employee</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-6">
                    <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                        <h3 className="text-white font-bold mb-2">Personal Details</h3>
                        <Input label="Full Name" value={tempEmp.fullName} onChange={(v: string) => setTempEmp({...tempEmp, fullName: v})} />
                        <Input label="Job Title" value={tempEmp.jobTitle} onChange={(v: string) => setTempEmp({...tempEmp, jobTitle: v})} />
                        <Input label="Email" value={tempEmp.email} onChange={(v: string) => setTempEmp({...tempEmp, email: v})} />
                        <Input label="Phone" value={tempEmp.tel} onChange={(v: string) => setTempEmp({...tempEmp, tel: v})} />
                        <Input label="Start Date" type="date" value={tempEmp.startDate.split('T')[0]} onChange={(v: string) => setTempEmp({...tempEmp, startDate: new Date(v).toISOString()})} />
                    </div>
                     <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 col-span-1">
                        <h3 className="text-white font-bold mb-2">System Access</h3>
                        <Input label="Login Name" value={tempEmp.loginName} onChange={(v: string) => setTempEmp({...tempEmp, loginName: v})} />
                        <Input label="PIN Code" value={tempEmp.pin} onChange={(v: string) => setTempEmp({...tempEmp, pin: v})} />
                        
                        <div className="pt-4 border-t border-white/5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Permissions</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {Object.entries(tempEmp.permissions).map(([key, val]) => (
                                    <label key={key} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                                        <input 
                                            type="checkbox" 
                                            checked={val} 
                                            onChange={e => setTempEmp({
                                                ...tempEmp, 
                                                permissions: { ...tempEmp.permissions, [key]: e.target.checked }
                                            })} 
                                            className="accent-pestGreen"
                                        />
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^can/, '')}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        );
    }

    return (
        <EditorLayout
            title="Employee Directory"
            icon={Users}
            description="Manage staff profiles, login credentials, and system permissions."
            helpText="Add new employees and control what they can access in the system."
            onSave={() => {}} 
        >
             <div className="flex justify-end mb-4">
                <button onClick={handleNew} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Employee</button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {content.employees.map(emp => (
                    <div key={emp.id} className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                                {emp.profileImage ? <img src={emp.profileImage} alt={emp.fullName} className="w-full h-full object-cover"/> : <User size={24} className="text-gray-400"/>}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{emp.fullName}</h3>
                                <p className="text-xs text-pestGreen font-bold uppercase">{emp.jobTitle}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                             <button onClick={() => handleEdit(emp)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-bold">Edit</button>
                             <button onClick={() => { if(confirm('Remove employee?')) deleteEmployee(emp.id); }} className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const BookingManager = () => {
    const { content, updateBooking } = useContent();

    return (
        <EditorLayout
            title="Inquiries & Bookings"
            icon={Inbox}
            description="View and manage incoming booking requests from the website."
            helpText="Track status of new leads."
            onSave={() => {}}
        >
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {content.bookings.length === 0 && <p className="text-gray-500 italic col-span-2">No bookings yet.</p>}
                {content.bookings.map(booking => (
                    <div key={booking.id} className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-4 col-span-1">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'New' ? 'bg-green-500 text-white' : 'bg-gray-500/20 text-gray-400'}`}>{booking.status}</span>
                                <span className="text-gray-500 text-xs">{new Date(booking.submittedAt).toLocaleString()}</span>
                            </div>
                            <h3 className="font-bold text-white text-lg">{booking.serviceName}</h3>
                            <p className="text-pestGreen font-bold">{booking.clientName}</p>
                            <p className="text-gray-400 text-sm">{booking.clientEmail} | {booking.clientPhone}</p>
                            <p className="text-gray-400 text-sm mt-1">{booking.clientAddress}</p>
                            <p className="text-gray-400 text-sm mt-1">Requested: {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                             <button onClick={() => updateBooking(booking.id, { status: 'Contacted' })} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500/30">Mark Contacted</button>
                             <button onClick={() => updateBooking(booking.id, { status: 'Converted' })} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold hover:bg-green-500/30">Mark Converted</button>
                             <button onClick={() => updateBooking(booking.id, { status: 'Archived' })} className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg text-sm font-bold hover:bg-gray-500/30">Archive</button>
                        </div>
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
    const { content, addJobCard, deleteJobCard } = useContent();
    const [activeTab, setActiveTab] = useState<AdminMainTab>('work'); 
    const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('jobs');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    // REMOVED: isMobileMenuOpen state

    const isCreator = loggedInUser?.id === 'creator-admin';

    const renderContent = () => {
        if (selectedJobId) {
            return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
        }

        switch (activeSubTab) {
            case 'hero': return <HeroEditor />;
            case 'about': return <AboutEditor />;
            case 'whyChooseUs': return <WhyChooseUsEditor />;
            case 'process': return <ProcessEditor />;
            case 'safety': return <SafetyEditor />;
            case 'cta': return <ContactEditor />;
            case 'servicesList': return <ServicesEditor />;
            case 'serviceAreaMap': return <ServiceAreaEditor />;
            case 'companyDetails': return <CompanyEditor />;
            case 'locations': return <LocationsEditor />;
            case 'contactPage': return <ContactEditor />;
            case 'faqs': return <FaqEditor />;
            case 'seo': return <SeoEditor />;
            case 'employeeDirectory': return <EmployeeEditor />;
            case 'inquiries': return <BookingManager />;
            case 'jobs': 
                return (
                    <div className="space-y-6">
                        <SectionHeader title="Job Cards" icon={Briefcase} description="Manage active jobs, quotes, and history." />
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            <button 
                                onClick={handleCreateJob}
                                className="bg-[#161817] border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-pestGreen/50 transition-colors cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pestGreen/20 transition-colors">
                                    <Plus size={32} className="text-gray-500 group-hover:text-pestGreen" />
                                </div>
                                <span className="font-bold text-gray-500 group-hover:text-white">Create New Job Card</span>
                            </button>

                            {content.jobCards.map(job => (
                                <div 
                                    key={job.id} 
                                    onClick={() => setSelectedJobId(job.id)}
                                    className="bg-[#161817] p-6 rounded-2xl border border-white/5 hover:border-pestGreen/50 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-mono text-xs text-gray-500">{job.refNumber}</span>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>{job.status.replace(/_/g, ' ')}</span>
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-1">{job.clientName}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{job.clientAddressDetails.suburb}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={14}/> {new Date(job.assessmentDate).toLocaleDateString()}
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-pestGreen transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'creatorSettings': return <CreatorDashboard />;
            default: return <div className="p-10 text-center text-gray-500">Select a section from the menu.</div>;
        }
    };

    const handleCreateJob = () => {
         const newJob: JobCard = {
            id: `job-${Date.now()}`,
            refNumber: `JOB-${new Date().getFullYear().toString().substr(-2)}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random()*1000)}`,
            clientName: 'New Client',
            clientAddressDetails: { street: '', suburb: '', city: 'Nelspruit', province: 'MP', postalCode: '1200' },
            contactNumber: '',
            email: '',
            propertyType: 'Residential',
            assessmentDate: new Date().toISOString(),
            technicianId: loggedInUser?.id || '',
            selectedServices: [],
            checkpoints: [],
            isFirstTimeService: true,
            treatmentRecommendation: '',
            quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' },
            status: 'Assessment',
            history: [{ date: new Date().toISOString(), action: 'Job Created', user: loggedInUser?.fullName || 'Admin' }]
        };
        addJobCard(newJob);
    };

    // Sub-Tabs Data Structure for Mobile Navigation
    const subTabs = {
        work: [
            { id: 'jobs', label: 'Job Cards', icon: Briefcase },
            { id: 'inquiries', label: 'Inquiries', icon: Inbox }
        ],
        homeLayout: [
            { id: 'hero', label: 'Hero', icon: Image },
            { id: 'about', label: 'About', icon: Info },
            { id: 'whyChooseUs', label: 'Why Us', icon: ThumbsUp },
            { id: 'process', label: 'Process', icon: Workflow },
            { id: 'safety', label: 'Safety', icon: Shield },
            { id: 'cta', label: 'CTA', icon: Phone }
        ],
        companyInfo: [
            { id: 'companyDetails', label: 'Details', icon: Building2 },
            { id: 'locations', label: 'Locations', icon: MapPin },
            { id: 'contactPage', label: 'Contact', icon: Phone },
            { id: 'employeeDirectory', label: 'Staff', icon: Users },
            { id: 'faqs', label: 'FAQs', icon: HelpCircle },
            { id: 'seo', label: 'SEO', icon: Search }
        ],
        servicesArea: [
            { id: 'servicesList', label: 'Services', icon: Zap },
            { id: 'serviceAreaMap', label: 'Area', icon: Map }
        ],
        creator: [
            { id: 'creatorSettings', label: 'System', icon: Code2 }
        ]
    };

    const renderMainArea = () => {
         if (selectedJobId) {
            return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
        }
        
        if (activeSubTab === 'jobs') {
             // ... Job Card Grid (reused logic)
             return (
                    <div className="space-y-6 animate-in fade-in">
                        <SectionHeader title="Job Cards" icon={Briefcase} description="Manage active jobs, quotes, and history." />
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            <button 
                                onClick={handleCreateJob}
                                className="bg-[#161817] border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-pestGreen/50 transition-colors cursor-pointer min-h-[200px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pestGreen/20 transition-colors">
                                    <Plus size={32} className="text-gray-500 group-hover:text-pestGreen" />
                                </div>
                                <span className="font-bold text-gray-500 group-hover:text-white">Create New Job Card</span>
                            </button>

                            {content.jobCards.map(job => (
                                <div 
                                    key={job.id} 
                                    onClick={() => setSelectedJobId(job.id)}
                                    className="bg-[#161817] p-6 rounded-2xl border border-white/5 hover:border-pestGreen/50 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                                >
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            if(confirm("Delete this Job Card?")) deleteJobCard(job.id); 
                                        }}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 bg-black/20 p-2 rounded-full hover:bg-black/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Job"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="font-mono text-xs text-gray-500">{job.refNumber}</span>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${job.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>{job.status.replace(/_/g, ' ')}</span>
                                        </div>
                                        <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">{job.clientName}</h3>
                                        <p className="text-sm text-gray-400 mb-4">{job.clientAddressDetails.suburb || 'No Suburb'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-white/5 pt-4">
                                        <Calendar size={14}/> {new Date(job.assessmentDate).toLocaleDateString()}
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-pestGreen transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }

        return renderContent();
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-[#0f1110] font-sans overflow-hidden text-white flex flex-col md:flex-row"
            style={{ zoom: "133.333%" }}
        >
            {/* --- MOBILE STICKY HEADER (Upper Class) --- */}
            <div className="md:hidden flex flex-col bg-[#0f1110]/95 backdrop-blur border-b border-white/10 z-[120]">
                {/* Top Row: Logo & User */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pestGreen rounded-lg flex items-center justify-center">
                            <Bug size={18} className="text-white"/>
                        </div>
                        <span className="font-black text-sm tracking-wide text-white">ADMIN</span>
                    </div>
                    <button onClick={onLogout} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                        <LogOut size={16} />
                    </button>
                </div>

                {/* Second Row: Main Tabs (Horizontal Scroll) */}
                <div className="flex overflow-x-auto gap-4 px-4 py-3 scrollbar-hide border-b border-white/5 items-center">
                    <button onClick={() => {setActiveTab('work'); setActiveSubTab('jobs'); setSelectedJobId(null);}} className={`flex items-center gap-2 whitespace-nowrap text-sm font-bold transition-colors ${activeTab === 'work' ? 'text-pestGreen' : 'text-gray-500'}`}>
                        <Briefcase size={16}/> Work
                    </button>
                    <div className="w-[1px] h-4 bg-white/10"></div>
                    <button onClick={() => {setActiveTab('homeLayout'); setActiveSubTab('hero'); setSelectedJobId(null);}} className={`flex items-center gap-2 whitespace-nowrap text-sm font-bold transition-colors ${activeTab === 'homeLayout' ? 'text-pestGreen' : 'text-gray-500'}`}>
                        <Layout size={16}/> Home Page
                    </button>
                    <div className="w-[1px] h-4 bg-white/10"></div>
                    <button onClick={() => {setActiveTab('companyInfo'); setActiveSubTab('companyDetails'); setSelectedJobId(null);}} className={`flex items-center gap-2 whitespace-nowrap text-sm font-bold transition-colors ${activeTab === 'companyInfo' ? 'text-pestGreen' : 'text-gray-500'}`}>
                        <Building2 size={16}/> Company
                    </button>
                    <div className="w-[1px] h-4 bg-white/10"></div>
                    <button onClick={() => {setActiveTab('servicesArea'); setActiveSubTab('servicesList'); setSelectedJobId(null);}} className={`flex items-center gap-2 whitespace-nowrap text-sm font-bold transition-colors ${activeTab === 'servicesArea' ? 'text-pestGreen' : 'text-gray-500'}`}>
                        <Zap size={16}/> Services
                    </button>
                    {isCreator && (
                        <>
                            <div className="w-[1px] h-4 bg-white/10"></div>
                            <button onClick={() => {setActiveTab('creator'); setActiveSubTab('creatorSettings'); setSelectedJobId(null);}} className={`flex items-center gap-2 whitespace-nowrap text-sm font-bold transition-colors ${activeTab === 'creator' ? 'text-pestGreen' : 'text-gray-500'}`}>
                                <Code2 size={16}/> System
                            </button>
                        </>
                    )}
                </div>

                {/* Third Row: Sub Tabs (Pills) */}
                <div className="flex overflow-x-auto gap-2 px-4 py-3 scrollbar-hide bg-[#161817]">
                    {(subTabs[activeTab] || []).map(sub => (
                        <button
                            key={sub.id}
                            onClick={() => { setActiveSubTab(sub.id as AdminSubTab); setSelectedJobId(null); }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSubTab === sub.id ? 'bg-pestGreen text-white shadow-lg' : 'bg-white/5 text-gray-400 border border-white/5'}`}
                        >
                            <sub.icon size={12} /> {sub.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar (unchanged) */}
            <aside className="hidden md:flex w-20 bg-[#0a0a0a] border-r border-white/5 flex-col items-center py-6 gap-6 z-20">
                <div className="w-10 h-10 bg-pestGreen rounded-xl flex items-center justify-center shadow-neon mb-4">
                   <Bug className="text-white" size={24} />
                </div>
                {/* ... Sidebar Icons ... */}
                <button onClick={() => { setActiveTab('work'); setActiveSubTab('jobs'); setSelectedJobId(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'work' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} title="Work"><Briefcase size={24}/></button>
                <button onClick={() => { setActiveTab('homeLayout'); setActiveSubTab('hero'); setSelectedJobId(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'homeLayout' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} title="Website Layout"><Layout size={24}/></button>
                <button onClick={() => { setActiveTab('companyInfo'); setActiveSubTab('companyDetails'); setSelectedJobId(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'companyInfo' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} title="Company Info"><Building2 size={24}/></button>
                <button onClick={() => { setActiveTab('servicesArea'); setActiveSubTab('servicesList'); setSelectedJobId(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'servicesArea' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} title="Services"><Zap size={24}/></button>
                {isCreator && (
                    <button onClick={() => { setActiveTab('creator'); setActiveSubTab('creatorSettings'); setSelectedJobId(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'creator' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`} title="System"><Code2 size={24}/></button>
                )}
                
                <div className="mt-auto flex flex-col gap-4">
                     <button onClick={onLogout} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors" title="Logout"><LogOut size={24}/></button>
                </div>
            </aside>

            {/* Sub-Sidebar Desktop (unchanged) */}
            <aside className="hidden md:flex w-64 bg-[#161817] border-r border-white/5 flex-col py-6 px-4 z-10">
                <div className="mb-6 px-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                        {activeTab === 'work' && 'Operations'}
                        {activeTab === 'homeLayout' && 'Home Page'}
                        {activeTab === 'companyInfo' && 'Company'}
                        {activeTab === 'servicesArea' && 'Services'}
                        {activeTab === 'creator' && 'System'}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">Dashboard Menu</p>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    {(subTabs[activeTab] || []).map(sub => (
                        <button 
                            key={sub.id}
                            onClick={() => { setActiveSubTab(sub.id as AdminSubTab); setSelectedJobId(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm mb-1 ${activeSubTab === sub.id ? 'bg-pestGreen/10 text-pestGreen font-bold border border-pestGreen/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <sub.icon size={18} /> {sub.label}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content Render */}
            <main className="flex-1 bg-[#0f1110] relative overflow-hidden flex flex-col">
                <header className="hidden md:flex h-16 border-b border-white/5 items-center justify-between px-6 bg-[#0f1110]/80 backdrop-blur z-20 sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <span>Admin</span> <ChevronRight size={12}/> <span className="text-white capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</span> <ChevronRight size={12}/> <span className="text-pestGreen font-bold capitalize">{activeSubTab.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="text-right">
                             <p className="text-white text-sm font-bold">{loggedInUser?.fullName || 'Admin User'}</p>
                             <p className="text-xs text-gray-500">{loggedInUser?.jobTitle || 'Administrator'}</p>
                         </div>
                         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                             {loggedInUser?.profileImage ? <img src={loggedInUser.profileImage} className="w-full h-full object-cover"/> : <User size={20} className="text-gray-400"/>}
                         </div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-0 md:pt-10 px-0 md:px-10 pb-10">
                     <div className="p-2 md:p-0">
                        {renderMainArea()}
                     </div>
                </div>
            </main>

        </div>
    );
};