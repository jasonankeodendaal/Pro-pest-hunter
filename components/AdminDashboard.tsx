

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
    CreditCard, Bug, QrCode, FileStack, Edit, BookOpen, Workflow, Server, Cloud, Link, Circle, Code2, Terminal, Copy, Palette, Upload, Zap, Database, RotateCcw, Wifi, GitBranch, Globe2, Inbox, Activity, AlertTriangle, RefreshCw, Layers, Map, Award, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Employee, AdminMainTab, AdminSubTab, JobCard, ServiceItem, ProcessStep, FAQItem, WhyChooseUsItem, SocialLink } from '../types';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';
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

const SectionHeader = ({ title, icon: Icon, action, onHelp }: { title: string; icon: any; action?: React.ReactNode, onHelp?: () => void }) => (
    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
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
);

const EditorLayout = ({ title, icon, helpText, onSave, children }: { title: string, icon: any, helpText: string, onSave: () => void, children: React.ReactNode }) => {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in relative pb-20">
            <SectionHeader title={title} icon={icon} onHelp={() => setShowHelp(!showHelp)} />
            
            <AnimatePresence>
                {showHelp && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-16 right-0 z-50 w-80 bg-[#1e201f] border border-yellow-500/50 shadow-2xl rounded-2xl p-6"
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
    const [localData, setLocalData] = useState(content.whyChooseUs);

    const handleItemChange = (index: number, field: keyof WhyChooseUsItem, value: string) => {
        const newItems = [...localData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setLocalData({ ...localData, items: newItems });
    };

    const handleDeleteItem = (index: number) => {
        const newItems = localData.items.filter((_, i) => i !== index);
        setLocalData({ ...localData, items: newItems });
    };

    const handleAddItem = () => {
        setLocalData({
            ...localData,
            items: [...localData.items, { title: "New Reason", text: "Description", iconName: "Award" }]
        });
    };

    return (
        <EditorLayout
            title="Why Choose Us"
            icon={ThumbsUp}
            helpText="Edit the 6 reasons why clients should choose you. These appear on the Home and About pages."
            onSave={() => { updateContent('whyChooseUs', { title: localData.title, subtitle: localData.subtitle }); updateWhyChooseUsItems(localData.items); }}
        >
             <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 mb-6">
                <h3 className="text-white font-bold mb-4">Section Header</h3>
                <Input label="Section Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                <Input label="Subtitle" value={localData.subtitle} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} />
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold">Reason Cards</h3>
                <button onClick={handleAddItem} className="bg-pestGreen text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Card</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localData.items.map((item, idx) => (
                    <div key={idx} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative group">
                        <button onClick={() => handleDeleteItem(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        <Input label="Title" value={item.title} onChange={(v: string) => handleItemChange(idx, 'title', v)} className="mb-4" />
                        <TextArea label="Description" value={item.text} onChange={(v: string) => handleItemChange(idx, 'text', v)} rows={3} className="mb-4" />
                        <Input label="Icon Name (Lucide)" value={item.iconName} onChange={(v: string) => handleItemChange(idx, 'iconName', v)} />
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
        update({ socials: [...localData.socials, link] });
        setNewSocial({ name: '', url: '', icon: '' });
    };

    const handleDeleteSocial = (id: string) => {
        update({ socials: localData.socials.filter(s => s.id !== id) });
    };

    return (
        <EditorLayout
            title="Company Information"
            icon={Building2}
            helpText="Manage core business details. 'Bank Details' are used on invoices generated by the system."
            onSave={handleSave}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Core Details</h3>
                    <Input label="Company Name" value={localData.name} onChange={(v: string) => update({ name: v })} />
                    <Input label="Registration Number" value={localData.regNumber} onChange={(v: string) => update({ regNumber: v })} />
                    <Input label="VAT Number" value={localData.vatNumber} onChange={(v: string) => update({ vatNumber: v })} />
                    <Input label="Experience (Years)" type="number" value={localData.yearsExperience} onChange={(v: string) => update({ yearsExperience: parseInt(v) })} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Contact Info</h3>
                    <Input label="Phone Number" value={localData.phone} onChange={(v: string) => update({ phone: v })} />
                    <Input label="Email Address" value={localData.email} onChange={(v: string) => update({ email: v })} />
                    <TextArea label="Physical Address" value={localData.address} onChange={(v: string) => update({ address: v })} rows={3} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Operating Hours</h3>
                    <Input label="Weekdays" value={localData.hours.weekdays} onChange={(v: string) => update({ hours: { ...localData.hours, weekdays: v } })} />
                    <Input label="Saturday" value={localData.hours.saturday} onChange={(v: string) => update({ hours: { ...localData.hours, saturday: v } })} />
                    <Input label="Sunday" value={localData.hours.sunday} onChange={(v: string) => update({ hours: { ...localData.hours, sunday: v } })} />
                </div>

                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Branding</h3>
                    <FileUpload label="Company Logo" value={localData.logo} onChange={(v: string) => update({ logo: v })} />
                </div>

                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 md:col-span-2">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Social Media Links</h3>
                    
                    {/* List Existing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {localData.socials.map(social => (
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

                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 md:col-span-2">
                    <h3 className="text-pestGreen font-bold mb-4 border-b border-white/10 pb-2 flex items-center gap-2"><CreditCard size={18}/> Bank Details (For Invoices)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

const ContactEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.contact);
    const [bookData, setBookData] = useState(content.bookCTA);

    const handleSave = () => {
        updateContent('contact', localData);
        updateContent('bookCTA', bookData);
    };

    return (
        <EditorLayout
            title="Contact & CTA"
            icon={Phone}
            helpText="Edit the contact page map and the 'Book Now' banner found on the home page."
            onSave={handleSave}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Contact Page Details</h3>
                    <Input label="Header Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <Input label="Subtitle" value={localData.subtitle} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} />
                    <Input label="Form Title" value={localData.formTitle} onChange={(v: string) => setLocalData({ ...localData, formTitle: v })} />
                    <TextArea 
                        label="Google Maps Embed URL (iframe src)" 
                        value={localData.mapEmbedUrl} 
                        onChange={(v: string) => setLocalData({ ...localData, mapEmbedUrl: v })} 
                        rows={3} 
                        placeholder="https://www.google.com/maps/embed?..."
                    />
                </div>

                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Book Now Banner (CTA)</h3>
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
            helpText="The Hero section is the first thing visitors see. Choose between a Static Image, a Video Loop (MP4), or an Image Carousel."
            onSave={() => updateContent('hero', localData)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <TextArea label="Headline" value={localData.headline} onChange={(v: string) => update({ headline: v })} rows={2} />
                    <TextArea label="Subheadline" value={localData.subheadline} onChange={(v: string) => update({ subheadline: v })} rows={2} />
                    <Input label="Button Text" value={localData.buttonText} onChange={(v: string) => update({ buttonText: v })} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
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
            helpText="Manage the story, mission statement, and owner profile image."
            onSave={() => updateContent('about', localData)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Main Story</h3>
                    <Input label="Title" value={localData.title} onChange={(v: string) => update({ title: v })} />
                    <TextArea label="Main Text" value={localData.text} onChange={(v: string) => update({ text: v })} rows={8} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
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
    const [localServices, setLocalServices] = useState(content.services);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempService, setTempService] = useState<ServiceItem | null>(null);

    // Sync with content only on initial load or if content changes externally
    useEffect(() => {
        setLocalServices(content.services);
    }, [content.services]);

    const handleEdit = (service: ServiceItem) => {
        setEditingId(service.id);
        setTempService({ ...service });
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
            // Update local state immediately
            const updated = localServices.filter(s => s.id !== id);
            setLocalServices(updated);
        }
    };

    const handleDetailChange = (index: number, val: string) => {
        if (!tempService) return;
        const newDetails = [...tempService.details];
        newDetails[index] = val;
        setTempService({ ...tempService, details: newDetails });
    };

    const addDetail = () => {
        if (!tempService) return;
        setTempService({ ...tempService, details: [...tempService.details, 'New Detail'] });
    };

    const removeDetail = (index: number) => {
        if (!tempService) return;
        setTempService({ ...tempService, details: tempService.details.filter((_, i) => i !== index) });
    };

    // Global Save
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                        <Input label="Service Title" value={tempService.title} onChange={(v: string) => setTempService({ ...tempService, title: v })} />
                        <Input label="Price (e.g. From R850)" value={tempService.price} onChange={(v: string) => setTempService({ ...tempService, price: v })} />
                        <Input label="Icon Name (Lucide)" value={tempService.iconName} onChange={(v: string) => setTempService({ ...tempService, iconName: v })} />
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

                    <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                        <FileUpload label="Service Image" value={tempService.image} onChange={(v: string) => setTempService({ ...tempService, image: v })} />
                        <TextArea label="Short Description (Card)" value={tempService.description} onChange={(v: string) => setTempService({ ...tempService, description: v })} rows={3} />
                    </div>

                    <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 md:col-span-2">
                        <TextArea label="Full Description (Panel)" value={tempService.fullDescription} onChange={(v: string) => setTempService({ ...tempService, fullDescription: v })} rows={4} />
                        
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bullet Points (Details)</label>
                        <div className="space-y-2">
                            {tempService.details.map((detail, idx) => (
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
            helpText="Add, edit, or remove services offered. Changes are only applied when you click 'Save Changes'."
            onSave={handleGlobalSave}
        >
            <div className="flex justify-end mb-4">
                <button onClick={handleNew} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Service</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localServices.map(service => (
                    <div key={service.id} className={`p-6 rounded-2xl border transition-all ${service.visible ? 'bg-[#161817] border-white/5' : 'bg-red-500/5 border-red-500/20 opacity-75'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-pestGreen/20 rounded-lg flex items-center justify-center text-pestGreen">
                                <Zap size={20} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(service)} className="p-2 hover:bg-white/10 rounded-full text-white"><Edit size={16}/></button>
                                <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-red-500/20 rounded-full text-red-500"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h3 className="font-bold text-white text-lg">{service.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-2">{service.description}</p>
                        <div className="flex gap-2 mt-4">
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
    const [localProcess, setLocalProcess] = useState(content.process);

    const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
        const newSteps = [...localProcess.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setLocalProcess(prev => ({ ...prev, steps: newSteps }));
    };

    return (
        <EditorLayout
            title="Process Section"
            icon={Workflow}
            helpText="Describe your workflow steps. These icons correspond to Lucide React icons."
            onSave={() => updateContent('process', localProcess)}
        >
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 mb-8">
                <h3 className="text-white font-bold mb-4">Section Headings</h3>
                <Input label="Title" value={localProcess.title} onChange={(v: string) => setLocalProcess({ ...localProcess, title: v })} />
                <TextArea label="Subtitle" value={localProcess.subtitle} onChange={(v: string) => setLocalProcess({ ...localProcess, subtitle: v })} rows={2} />
            </div>

            <div className="space-y-4">
                <h3 className="text-white font-bold px-1">Workflow Steps</h3>
                {localProcess.steps.map((step, idx) => (
                    <div key={idx} className="bg-[#161817] p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                        <div className="bg-white/5 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold shrink-0">{step.step}</div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Step Title" value={step.title} onChange={(v: string) => handleStepChange(idx, 'title', v)} />
                            <Input label="Icon Name" value={step.iconName} onChange={(v: string) => handleStepChange(idx, 'iconName', v)} />
                            <div className="md:col-span-3">
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
    const [localData, setLocalData] = useState(content.serviceArea);

    const handleTownsChange = (v: string) => {
        const towns = v.split(',').map(t => t.trim()).filter(t => t);
        setLocalData({ ...localData, towns });
    };

    return (
        <EditorLayout
            title="Service Area"
            icon={MapPin}
            helpText="The 'Towns' list populates the interactive map tags. Upload a clear map image OR paste a Google Maps Embed URL."
            onSave={() => updateContent('serviceArea', localData)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <Input label="Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <TextArea label="Description" value={localData.description} onChange={(v: string) => setLocalData({ ...localData, description: v })} rows={4} />
                    <TextArea label="Towns (Comma Separated)" value={localData.towns.join(', ')} onChange={handleTownsChange} rows={3} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Map Visual</h3>
                    <TextArea 
                        label="Google Maps Embed URL (Iframe src)" 
                        value={localData.mapEmbedUrl || ''} 
                        onChange={(v: string) => setLocalData({ ...localData, mapEmbedUrl: v })} 
                        rows={3} 
                        placeholder="https://www.google.com/maps/embed?..."
                    />
                    <div className="text-center text-xs text-gray-500 font-bold uppercase my-2">- OR -</div>
                    <FileUpload label="Area Map Image" value={localData.mapImage} onChange={(v: string) => setLocalData({ ...localData, mapImage: v })} />
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
            helpText="Upload compliance certificates (Sapca, etc.) and define your 3 key safety badges."
            onSave={() => updateContent('safety', localData)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Safety Promise</h3>
                    <Input label="Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <TextArea label="Description" value={localData.description} onChange={(v: string) => setLocalData({ ...localData, description: v })} rows={4} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Badges & Certs</h3>
                    <Input label="Badge 1 Text" value={localData.badge1} onChange={(v: string) => setLocalData({ ...localData, badge1: v })} />
                    <Input label="Badge 2 Text" value={localData.badge2} onChange={(v: string) => setLocalData({ ...localData, badge2: v })} />
                    <Input label="Badge 3 Text" value={localData.badge3} onChange={(v: string) => setLocalData({ ...localData, badge3: v })} />
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
    const [localFaqs, setLocalFaqs] = useState(content.faqs);

    const handleUpdate = (index: number, field: keyof FAQItem, value: string) => {
        const newFaqs = [...localFaqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setLocalFaqs(newFaqs);
    };

    const handleAdd = () => {
        const newFaq: FAQItem = { id: `faq-${Date.now()}`, question: 'New Question?', answer: 'Answer here.' };
        setLocalFaqs([...localFaqs, newFaq]);
    };

    const handleDelete = (index: number) => {
        // Update local state immediately
        const newFaqs = localFaqs.filter((_, i) => i !== index);
        setLocalFaqs(newFaqs);
    };

    return (
        <EditorLayout
            title="Frequently Asked Questions"
            icon={HelpCircle}
            helpText="Add common questions to reduce support calls. Keep answers concise."
            onSave={() => updateFaqs(localFaqs)}
        >
            <div className="flex justify-end mb-4">
                 <button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add FAQ</button>
            </div>
            
            <div className="space-y-4">
                {localFaqs.map((faq, idx) => (
                    <div key={faq.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative group">
                        <button onClick={() => handleDelete(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
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
            helpText="Optimize for Google search. 'Meta Title' and 'Description' are what appear in search results."
            onSave={() => updateContent('seo', localData)}
        >
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                <Input label="Meta Title" value={localData.metaTitle} onChange={(v: string) => setLocalData({ ...localData, metaTitle: v })} />
                <TextArea label="Meta Description" value={localData.metaDescription} onChange={(v: string) => setLocalData({ ...localData, metaDescription: v })} rows={3} />
                <TextArea label="Keywords" value={localData.keywords} onChange={(v: string) => setLocalData({ ...localData, keywords: v })} rows={2} />
                <div className="pt-4 border-t border-white/5">
                    <FileUpload label="Social Share Image (OG Image)" value={localData.ogImage} onChange={(v: string) => setLocalData({ ...localData, ogImage: v })} />
                </div>
                <Input label="Canonical URL" value={localData.canonicalUrl || ''} onChange={(v: string) => setLocalData({ ...localData, canonicalUrl: v })} />
                <Input label="Robots" value={localData.robotsDirective || 'index, follow'} onChange={(v: string) => setLocalData({ ...localData, robotsDirective: v })} />
                <TextArea label="Structured Data (JSON-LD)" value={localData.structuredDataJSON} onChange={(v: string) => setLocalData({ ...localData, structuredDataJSON: v })} rows={6} />
            </div>
        </EditorLayout>
    );
};

const CreatorWidgetEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.creatorWidget);

    return (
        <EditorLayout
            title="Creator Widget Settings"
            icon={Code2}
            helpText="Configure the floating developer widget. Only visible to you."
            onSave={() => updateContent('creatorWidget', localData)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <Input label="Slogan" value={localData.slogan} onChange={(v: string) => setLocalData({ ...localData, slogan: v })} />
                    <TextArea label="CTA Text" value={localData.ctaText} onChange={(v: string) => setLocalData({ ...localData, ctaText: v })} rows={3} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Images</h3>
                    <FileUpload label="Logo" value={localData.logo} onChange={(v: string) => setLocalData({ ...localData, logo: v })} />
                    <FileUpload label="Background" value={localData.background} onChange={(v: string) => setLocalData({ ...localData, background: v })} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 md:col-span-2">
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

// --- CREATOR EXCLUSIVE: ZERO TO HERO GUIDE ---
const ZeroToHeroGuide = () => {
    const { apiUrl } = useContent();
    
    return (
        <div className="space-y-8 animate-in fade-in pb-20">
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                            <Terminal size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white">Zero-to-Hero Masterclass</h2>
                            <p className="text-purple-200">The complete full-stack deployment guide for beginners.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* PHASE 1 */}
                        <div>
                             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><GitBranch size={20}/> Phase 1: GitHub (Source Code)</h3>
                             <InfoBlock 
                                title="1. Initialize Git" 
                                text="Open your project folder in VS Code terminal. Run these commands one by one."
                                code={`git init\ngit add .\ngit commit -m "Initial commit"`}
                             />
                             <InfoBlock 
                                title="2. Push to GitHub" 
                                text="Create a NEW repository on GitHub (e.g., 'pest-app'). Do not add a README. Then run:"
                                code={`git remote add origin https://github.com/YOUR_USERNAME/pest-app.git\ngit branch -M main\ngit push -u origin main`}
                             />
                        </div>

                        {/* PHASE 2 */}
                        <div>
                             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Database size={20}/> Phase 2: Supabase (Database)</h3>
                             <InfoBlock 
                                title="1. Create Project" 
                                text="Go to Supabase.com -> New Project. Name it 'pest-db'. Save your Database Password!" 
                             />
                             <InfoBlock 
                                title="2. Get Connection String" 
                                text="Go to Project Settings -> Database -> Connection String -> URI. Copy it. It looks like: postgresql://postgres.xxxx:password@aws-0-region.pooler.supabase.com:6543/postgres" 
                             />
                             <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-4">
                                <p className="text-yellow-500 text-xs font-bold">IMPORTANT: Replace `[YOUR-PASSWORD]` in the URL with the password you created in step 1.</p>
                             </div>
                        </div>

                        {/* PHASE 3 */}
                        <div>
                             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Server size={20}/> Phase 3: Render (Backend Hosting)</h3>
                             <InfoBlock 
                                title="1. Create Web Service" 
                                text="Go to Render.com -> New Web Service -> Connect GitHub -> Select 'pest-app'." 
                             />
                             <InfoBlock 
                                title="2. Configure Settings" 
                                text="Runtime: Node.  Build Command: `npm install`.  Start Command: `node server.js`." 
                             />
                             <InfoBlock 
                                title="3. Add Environment Variables" 
                                text="Scroll down to 'Environment Variables'. Add Key: `DATABASE_URL`, Value: (Paste your Supabase URL from Phase 2)." 
                             />
                             <InfoBlock 
                                title="4. Deploy" 
                                text="Click Create Web Service. Wait for it to show 'Live'. Copy the Render URL (e.g. https://pest-app.onrender.com)." 
                             />
                        </div>

                        {/* PHASE 4 */}
                        <div>
                             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Globe2 size={20}/> Phase 4: Vercel (Frontend Hosting)</h3>
                             <InfoBlock 
                                title="1. Import Project" 
                                text="Go to Vercel.com -> Add New -> Project -> Import 'pest-app' from GitHub." 
                             />
                             <InfoBlock 
                                title="2. Environment Variables" 
                                text="In the setup screen, add variable: `VITE_API_URL`. Value: (Paste your Render URL from Phase 3). IMPORTANT: Remove any trailing slash!" 
                             />
                             <InfoBlock 
                                title="3. Deploy" 
                                text="Click Deploy. Vercel will build the site. Once done, your app is live!" 
                             />
                        </div>
                        
                        <div className="border-t border-purple-500/30 pt-6 mt-8">
                            <h3 className="text-white font-bold mb-2">Current System Connection</h3>
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <code className="text-pestGreen font-mono">{apiUrl}</code>
                                <span className="text-xs text-gray-500 uppercase font-bold">Active API</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- EMPLOYEE EDITOR ---

const EmployeeEditor = () => {
    const { content, addEmployee, updateEmployee, deleteEmployee } = useContent();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempEmp, setTempEmp] = useState<Employee | null>(null);

    const handleEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setTempEmp({ ...emp });
    };

    const handleNew = () => {
        const newEmp: Employee = {
            id: `emp-${Date.now()}`,
            fullName: 'New Staff Member',
            email: '',
            tel: '',
            idNumber: '',
            jobTitle: 'Technician',
            startDate: new Date().toISOString(),
            loginName: 'newuser',
            pin: '0000',
            profileImage: null,
            doctorsNumbers: [],
            documents: [],
            permissions: { isAdmin: false, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: false, canViewReports: false, canManageEmployees: false, canEditSiteContent: false }
        };
        setTempEmp(newEmp);
        setEditingId(newEmp.id);
    };

    const handleSave = () => {
        if (!tempEmp) return;
        const exists = content.employees.find(e => e.id === tempEmp.id);
        if (exists) updateEmployee(tempEmp.id, tempEmp);
        else addEmployee(tempEmp);
        setEditingId(null);
        setTempEmp(null);
    };

    if (editingId && tempEmp) {
        return (
            <div className="space-y-6 animate-in fade-in pb-20">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Edit Employee</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white/10 text-white rounded-lg">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-pestGreen text-white rounded-lg font-bold flex items-center gap-2"><Save size={16}/> Save</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-white font-bold mb-4">Personal Info</h3>
                        <Input label="Full Name" value={tempEmp.fullName} onChange={(v: string) => setTempEmp({ ...tempEmp, fullName: v })} />
                        <Input label="Job Title" value={tempEmp.jobTitle} onChange={(v: string) => setTempEmp({ ...tempEmp, jobTitle: v })} />
                        <Input label="Email" value={tempEmp.email} onChange={(v: string) => setTempEmp({ ...tempEmp, email: v })} />
                        <Input label="Phone" value={tempEmp.tel} onChange={(v: string) => setTempEmp({ ...tempEmp, tel: v })} />
                        <Input label="ID Number" value={tempEmp.idNumber} onChange={(v: string) => setTempEmp({ ...tempEmp, idNumber: v })} />
                        <FileUpload label="Profile Image" value={tempEmp.profileImage} onChange={(v: string) => setTempEmp({ ...tempEmp, profileImage: v })} />
                    </div>

                    <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-white font-bold mb-4">System Access</h3>
                        <Input label="Login Name" value={tempEmp.loginName} onChange={(v: string) => setTempEmp({ ...tempEmp, loginName: v })} />
                        <Input label="PIN Code" value={tempEmp.pin} onChange={(v: string) => setTempEmp({ ...tempEmp, pin: v })} />
                        
                        <h4 className="text-white font-bold text-sm mt-6 mb-2">Permissions</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(tempEmp.permissions).map(([key, val]) => (
                                <label key={key} className="flex items-center gap-2 text-gray-300 text-xs cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={val} 
                                        onChange={e => setTempEmp({...tempEmp, permissions: { ...tempEmp.permissions, [key]: e.target.checked }})} 
                                        className="rounded border-gray-600 bg-black/50 text-pestGreen focus:ring-pestGreen"
                                    />
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^can/, '')}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in pb-20">
            <SectionHeader 
                title="Staff Directory" 
                icon={Users} 
                action={<button onClick={handleNew} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Staff</button>}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.employees.map(emp => (
                    <div key={emp.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-700 overflow-hidden flex-shrink-0">
                                {emp.profileImage ? <img src={emp.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">{emp.fullName.charAt(0)}</div>}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{emp.fullName}</h3>
                                <p className="text-pestGreen text-xs uppercase font-bold">{emp.jobTitle}</p>
                                <p className="text-gray-500 text-xs mt-1">{emp.tel}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                             <button onClick={() => handleEdit(emp)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-bold transition-colors">Edit</button>
                             <button onClick={() => deleteEmployee(emp.id)} className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SYSTEM STATUS & GUIDE ---

const SystemGuide = () => {
    const { apiUrl, resetSystem, clearSystem, downloadBackup, restoreBackup, dbType, connectionError, isConnecting, retryConnection } = useContent();
    const [confirmClear, setConfirmClear] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (window.confirm("WARNING: This will overwrite ALL current data. Are you sure?")) {
                const success = await restoreBackup(e.target.files[0]);
                if (success) alert("System restored successfully.");
                else alert("Restore failed. Check file format.");
            }
        }
    };

    const isRenderWithSqlite = dbType === 'sqlite' && !apiUrl.includes('localhost');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* SETUP & STATUS SECTION */}
            <div className="bg-[#161817] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
                 <div className="relative z-10">
                     <SectionHeader 
                        title="System Status" 
                        icon={Server} 
                    />

                     {isRenderWithSqlite && (
                         <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-8 animate-pulse">
                             <div className="flex items-start gap-4">
                                 <AlertTriangle className="text-red-500 shrink-0" size={32} />
                                 <div>
                                     <h3 className="text-xl font-black text-red-500 uppercase mb-2">CRITICAL: DATA LOSS RISK DETECTED</h3>
                                     <p className="text-white font-bold mb-2">You are running on a Live Render Server using a Local SQLite Database.</p>
                                     <p className="text-gray-300 text-sm mb-4">
                                         Render deletes local files every time the server restarts. Any content you upload will be DELETED automatically. 
                                         Please refer to the "Zero-to-Hero" guide in the Creator tab to connect Supabase.
                                     </p>
                                 </div>
                             </div>
                         </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                 <Link size={16} className={connectionError ? "text-red-500" : "text-pestGreen"}/> Connection Status
                             </h4>
                             <div className={`bg-black/30 p-3 rounded-lg border flex items-center justify-between mb-2 ${connectionError ? 'border-red-500/30 bg-red-500/10' : 'border-white/5'}`}>
                                <div className="flex-1 mr-2 overflow-hidden">
                                     <code className={`text-xs font-mono break-all block ${connectionError ? 'text-red-400' : 'text-pestGreen'}`}>{apiUrl}</code>
                                     {connectionError && (
                                         <span className="text-[10px] text-red-500 font-bold block mt-1 uppercase">Error: {connectionError}</span>
                                     )}
                                </div>
                                <div className={`w-3 h-3 rounded-full shadow-neon flex-shrink-0 ${isConnecting ? 'bg-yellow-500 animate-ping' : (connectionError ? 'bg-red-500' : 'bg-pestGreen animate-pulse')}`}></div>
                             </div>
                             <div className="flex justify-between items-center">
                                 <p className="text-[10px] text-gray-500">
                                     {connectionError 
                                        ? "Cannot reach server." 
                                        : `Connected via ${apiUrl.includes('localhost') ? 'Local Environment' : 'Live Remote Server'}`}
                                 </p>
                                 <button onClick={retryConnection} className="text-[10px] font-bold text-blue-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded">
                                     <RefreshCw size={10} className={isConnecting ? 'animate-spin' : ''} /> Retry
                                 </button>
                             </div>
                         </div>

                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Database size={16} className="text-blue-400"/> Database Mode</h4>
                             <div className="flex items-center gap-3">
                                 {dbType === 'postgres' ? (
                                     <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/30 flex items-center gap-2">
                                         <CheckCircle size={12} /> Supabase (PostgreSQL)
                                     </span>
                                 ) : dbType === 'sqlite' ? (
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-2 ${isRenderWithSqlite ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                         <AlertTriangle size={12} /> SQLite (Local)
                                     </span>
                                 ) : (
                                     <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-500/30 flex items-center gap-2">
                                         <HelpCircle size={12} /> Unknown Status
                                     </span>
                                 )}
                             </div>
                         </div>
                     </div>
                     
                     {/* BACKUP & RESTORE SECTION */}
                     <div className="border-t border-white/10 pt-8 mb-8">
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Cloud size={20} className="text-blue-400"/> Data Backup & Restore
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
                                <h4 className="font-bold text-blue-100 mb-2">Create Backup</h4>
                                <p className="text-xs text-gray-400 mb-4">Download a JSON snapshot of the entire database.</p>
                                <button onClick={downloadBackup} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors w-full justify-center">
                                    <Download size={16} /> Download Full Backup
                                </button>
                            </div>
                            
                            <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-2xl">
                                <h4 className="font-bold text-purple-100 mb-2">Restore Backup</h4>
                                <p className="text-xs text-gray-400 mb-4">Upload a previously saved JSON backup file.</p>
                                <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors w-full justify-center">
                                    <Upload size={16} /> Restore from File
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleRestore} accept=".json" className="hidden" />
                            </div>
                         </div>
                     </div>

                     <div className="border-t border-white/10 pt-8">
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database size={20} className="text-red-400"/> Data Management
                         </h3>
                         <div className="flex gap-4 items-center flex-wrap">
                             <button 
                                onClick={() => { if(window.confirm("This will replace all current data with a fresh set of Pro Pest Hunters mock data. Continue?")) resetSystem(); }}
                                className="bg-pestGreen/20 hover:bg-pestGreen text-pestGreen hover:text-white border border-pestGreen/50 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                             >
                                 <RotateCcw size={18} /> Load Mock Data
                             </button>
                             
                             {!confirmClear ? (
                                <button 
                                    onClick={() => setConfirmClear(true)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={18} /> Delete All Data
                                </button>
                             ) : (
                                 <div className="flex items-center gap-2 animate-in fade-in">
                                     <span className="text-red-400 text-xs font-bold uppercase mr-2">Are you sure?</span>
                                     <button onClick={() => { clearSystem(); setConfirmClear(false); }} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Yes</button>
                                     <button onClick={() => setConfirmClear(false)} className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-sm">Cancel</button>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

// --- MAIN ADMIN DASHBOARD ---

interface AdminDashboardProps {
  onLogout: () => void;
  loggedInUser: Employee | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
  const { content, deleteJobCard } = useContent(); 
  
  // Permissions & Roles
  const perms = loggedInUser?.permissions || {
    isAdmin: false,
    canEditSiteContent: false,
    canManageEmployees: false,
    canDoAssessment: false,
    canCreateQuotes: false,
    canExecuteJob: false,
    canInvoice: false,
    canViewReports: false
  };
  
  const isCreator = loggedInUser?.id === 'creator-admin';
  const isAdmin = perms.isAdmin;

  const showSiteTab = perms.isAdmin || perms.canEditSiteContent;
  const showWorkTab = true; 
  const showTeamTab = perms.isAdmin || perms.canManageEmployees;
  // Creator tab is only for Creator ID
  const showCreatorTab = isCreator;

  const [activeMainTab, setActiveMainTab] = useState<AdminMainTab>(showSiteTab ? 'homeLayout' : 'work');
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>(showSiteTab ? 'hero' : 'jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Security Redirect
  useEffect(() => {
     if (activeMainTab === 'homeLayout' && !showSiteTab) {
         setActiveMainTab('work');
         setActiveSubTab('jobs');
     }
  }, [activeMainTab, showSiteTab]);

  if (selectedJobId) {
      return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
  }

  const handleDeleteJob = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to delete this job card?")) {
        deleteJobCard(id);
    }
  };

  const SidebarItem = ({ id, label, icon: Icon, mainTab }: { id: AdminSubTab, label: string, icon: any, mainTab: AdminMainTab }) => (
      activeMainTab === mainTab ? (
        <button 
            onClick={() => setActiveSubTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeSubTab === id ? 'bg-pestGreen text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
            <Icon size={16} />
            <span>{label}</span>
            {activeSubTab === id && <ChevronRight size={14} className="ml-auto opacity-50" />}
        </button>
      ) : null
  );

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f1110] flex overflow-hidden font-sans">
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-[#161817] border-r border-white/5 flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-pestGreen rounded-xl flex items-center justify-center shadow-neon">
                        <Lock size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-lg leading-none">{isAdmin ? 'Admin' : 'Staff'}</h2>
                        <span className="text-pestGreen text-xs font-bold uppercase tracking-wider">Dashboard</span>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex p-2 gap-1 border-b border-white/5 overflow-x-auto scrollbar-hide">
                {showSiteTab && (
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('hero'); }} className={`flex-1 min-w-[60px] py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'homeLayout' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Layout size={18} /> Home
                    </button>
                )}
                 {showSiteTab && (
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('servicesList'); }} className={`flex-1 min-w-[60px] py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'servicesArea' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Zap size={18} /> Svcs
                    </button>
                )}
                 {showSiteTab && (
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('companyDetails'); }} className={`flex-1 min-w-[60px] py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'companyInfo' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Info size={18} /> Info
                    </button>
                )}
                {showWorkTab && (
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('jobs'); }} className={`flex-1 min-w-[60px] py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'work' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Briefcase size={18} /> Work
                    </button>
                )}
                {showCreatorTab && (
                    <button onClick={() => { setActiveMainTab('creator'); setActiveSubTab('creatorSettings'); }} className={`flex-1 min-w-[60px] py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'creator' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-purple-400'}`}>
                        <Code2 size={18} /> Dev
                    </button>
                )}
            </div>

            {/* Sub Tabs Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 mt-2 px-2">Menu</div>
                
                {/* Home Layout */}
                <SidebarItem id="hero" label="Hero Section" icon={Layout} mainTab="homeLayout" />
                <SidebarItem id="about" label="About Us" icon={Info} mainTab="homeLayout" />
                <SidebarItem id="whyChooseUs" label="Why Choose Us" icon={ThumbsUp} mainTab="homeLayout" />
                <SidebarItem id="process" label="Our Process" icon={Workflow} mainTab="homeLayout" />
                <SidebarItem id="safety" label="Safety & Compliance" icon={Shield} mainTab="homeLayout" />
                <SidebarItem id="cta" label="CTA Banner" icon={Phone} mainTab="homeLayout" />

                {/* Services & Area */}
                <SidebarItem id="servicesList" label="Services List" icon={Zap} mainTab="servicesArea" />
                <SidebarItem id="serviceAreaMap" label="Service Area Map" icon={MapPin} mainTab="servicesArea" />

                {/* Company & Info */}
                {isAdmin && <SidebarItem id="systemGuide" label="System Status" icon={Activity} mainTab="companyInfo" />}
                <SidebarItem id="companyDetails" label="Company Info" icon={Building2} mainTab="companyInfo" />
                <SidebarItem id="contactPage" label="Contact Page" icon={Phone} mainTab="companyInfo" />
                <SidebarItem id="faqs" label="FAQs" icon={HelpCircle} mainTab="companyInfo" />
                <SidebarItem id="seo" label="SEO Settings" icon={Search} mainTab="companyInfo" />
                <SidebarItem id="employeeDirectory" label="Staff Directory" icon={Users} mainTab="companyInfo" />

                {/* Work Subtabs */}
                <SidebarItem id="jobs" label="Job Cards" icon={Clipboard} mainTab="work" />
                <SidebarItem id="inquiries" label="Web Inquiries" icon={Inbox} mainTab="work" />
                
                {/* Creator Only */}
                {isCreator && activeMainTab === 'creator' && (
                    <>
                        <button onClick={() => setActiveSubTab('creatorSettings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeSubTab === 'creatorSettings' ? 'bg-purple-900/50 text-white' : 'text-gray-400 hover:text-white'}`}><Code2 size={16}/> Widget Settings</button>
                        <button onClick={() => setActiveSubTab('deploymentGuide')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeSubTab === 'deploymentGuide' ? 'bg-purple-900/50 text-white' : 'text-gray-400 hover:text-white'}`}><GitBranch size={16}/> Zero-to-Hero Guide</button>
                    </>
                )}

            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0f1110]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pestGreen/20 flex items-center justify-center border border-pestGreen/50 text-pestGreen font-bold">
                        {loggedInUser?.fullName.charAt(0) || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-white font-bold text-sm truncate">{loggedInUser?.fullName || 'User'}</h4>
                        <p className="text-gray-500 text-xs truncate">{loggedInUser?.jobTitle || 'Staff'}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg font-bold text-sm transition-all">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#0f1110] relative">
            <div className="max-w-5xl mx-auto p-8 pb-24">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* HOME PAGE LAYOUT GROUP */}
                    {activeMainTab === 'homeLayout' && activeSubTab === 'hero' && <HeroEditor />}
                    {activeMainTab === 'homeLayout' && activeSubTab === 'about' && <AboutEditor />}
                    {activeMainTab === 'homeLayout' && activeSubTab === 'whyChooseUs' && <WhyChooseUsEditor />}
                    {activeMainTab === 'homeLayout' && activeSubTab === 'process' && <ProcessEditor />}
                    {activeMainTab === 'homeLayout' && activeSubTab === 'safety' && <SafetyEditor />}
                    {activeMainTab === 'homeLayout' && activeSubTab === 'cta' && <ContactEditor />}

                    {/* SERVICES & AREA GROUP */}
                    {activeMainTab === 'servicesArea' && activeSubTab === 'servicesList' && <ServicesEditor />}
                    {activeMainTab === 'servicesArea' && activeSubTab === 'serviceAreaMap' && <ServiceAreaEditor />}

                    {/* COMPANY & INFO GROUP */}
                    {activeMainTab === 'companyInfo' && activeSubTab === 'systemGuide' && isAdmin && <SystemGuide />}
                    {activeMainTab === 'companyInfo' && activeSubTab === 'companyDetails' && <CompanyEditor />}
                    {activeMainTab === 'companyInfo' && activeSubTab === 'contactPage' && <ContactEditor />}
                    {activeMainTab === 'companyInfo' && activeSubTab === 'faqs' && <FaqEditor />}
                    {activeMainTab === 'companyInfo' && activeSubTab === 'seo' && <SeoEditor />}
                    {activeMainTab === 'companyInfo' && activeSubTab === 'employeeDirectory' && <EmployeeEditor />}
                    
                    {/* CREATOR GROUP */}
                    {activeMainTab === 'creator' && activeSubTab === 'creatorSettings' && isCreator && <CreatorWidgetEditor />}
                    {activeMainTab === 'creator' && activeSubTab === 'deploymentGuide' && isCreator && <ZeroToHeroGuide />}
                    
                    {/* WORK GROUP - INQUIRIES */}
                    {activeMainTab === 'work' && activeSubTab === 'inquiries' && (
                         <div className="space-y-6">
                            <SectionHeader title="Web Inquiries & Bookings" icon={Inbox} />
                            <div className="bg-[#161817] rounded-2xl border border-white/5 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                            <th className="p-4">Date Rec.</th>
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Service</th>
                                            <th className="p-4">Requested Date</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {content.bookings.length > 0 ? content.bookings.map((b) => (
                                            <tr key={b.id} className="text-white hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-xs text-gray-500">{new Date(b.submittedAt).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <div className="font-bold">{b.clientName}</div>
                                                    <div className="text-xs text-gray-500">{b.clientPhone}</div>
                                                </td>
                                                <td className="p-4 text-sm">{b.serviceName}</td>
                                                <td className="p-4 text-sm font-mono">{new Date(b.date).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${b.status === 'New' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-500 italic">No inquiries received yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {/* WORK GROUP - JOB CARDS */}
                    {activeMainTab === 'work' && activeSubTab === 'jobs' && (
                        <div className="space-y-6 pb-20">
                            <SectionHeader title="Active Job Cards" icon={Clipboard} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.jobCards.map(job => (
                                    <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="bg-[#161817] border border-white/5 hover:border-pestGreen/50 p-6 rounded-2xl cursor-pointer group transition-all relative">
                                        {isAdmin && (
                                            <button 
                                                onClick={(e) => handleDeleteJob(e, job.id)} 
                                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                                                title="Delete Job Card"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-bold text-gray-500 font-mono">{job.refNumber}</span>
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${job.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {job.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pestGreen transition-colors">{job.clientName}</h3>
                                        <p className="text-sm text-gray-400 mb-4 flex items-center gap-1"><MapPin size={12}/> {job.clientAddressDetails.suburb}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#161817] flex items-center justify-center text-xs text-white">
                                                    {content.employees.find(e => e.id === job.technicianId)?.fullName.charAt(0) || '?'}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(job.assessmentDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                {(perms.isAdmin || perms.canCreateQuotes) && (
                                    <button 
                                        onClick={() => alert("To create a new job, please use the Booking system on the website.")} 
                                        className="bg-white/5 border border-dashed border-white/10 hover:border-pestGreen hover:bg-pestGreen/5 rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[200px] transition-all"
                                    >
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                                            <Plus size={24} />
                                        </div>
                                        <span className="font-bold text-white">Create New Job Card</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};