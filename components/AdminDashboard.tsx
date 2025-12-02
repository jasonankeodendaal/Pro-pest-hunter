
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
import { Employee, AdminMainTab, AdminSubTab, JobCard, ServiceItem, ProcessStep, FAQItem, WhyChooseUsItem, SocialLink, AdminDashboardProps, Location, AboutItem } from '../types';
import { Input, TextArea, Select, FileUpload, IconPicker } from './ui/AdminShared'; 
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

const EditorLayout: React.FC<{ 
    title: string, 
    icon: React.ElementType, 
    description: string, 
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
            title="Why Choose Us" icon={ThumbsUp} description="Manage the key reasons displayed on the homepage." helpText="Edit the 6 reasons why clients should choose you."
            onSave={() => { updateContent('whyChooseUs', { title: localData.title, subtitle: localData.subtitle }); updateWhyChooseUsItems(localData.items || []); }}
        >
             <div className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 space-y-4 mb-6">
                <Input label="Section Title" value={localData.title || ''} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                <Input label="Subtitle" value={localData.subtitle || ''} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} />
            </div>
            <div className="flex justify-between items-center mb-4"><h3 className="text-white font-bold">Reason Cards</h3><button onClick={handleAddItem} className="bg-pestGreen text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Card</button></div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {(localData.items || []).map((item, idx) => (
                    <div key={idx} className="bg-[#161817] p-3 md:p-6 rounded-2xl border border-white/5 relative group">
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteItem(idx); }} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={16}/></button>
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
    const handleSave = () => { updateContent('company', localData); updateContent('bankDetails', bankData); };
    const handleAddSocial = () => {
        if (!newSocial.name || !newSocial.url) return;
        update({ socials: [...(localData.socials || []), { id: Date.now().toString(), name: newSocial.name, url: newSocial.url, icon: newSocial.icon || '' }] });
        setNewSocial({ name: '', url: '', icon: '' });
    };
    const handleDeleteSocial = (id: string) => { update({ socials: (localData.socials || []).filter(s => s.id !== id) }); };

    return (
        <EditorLayout title="Company Information" icon={Building2} description="Update core business details, hours, and socials." helpText="Manage core business details." onSave={handleSave}>
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Core Details</h3>
                    <Input label="Company Name" value={localData.name} onChange={(v: string) => update({ name: v })} />
                    <Input label="Reg Number" value={localData.regNumber} onChange={(v: string) => update({ regNumber: v })} />
                    <Input label="VAT Number" value={localData.vatNumber} onChange={(v: string) => update({ vatNumber: v })} />
                    <Input label="Phone" value={localData.phone} onChange={(v: string) => update({ phone: v })} />
                    <Input label="Email" value={localData.email} onChange={(v: string) => update({ email: v })} />
                    <TextArea label="Address" value={localData.address} onChange={(v: string) => update({ address: v })} rows={3} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                     <h3 className="text-white font-bold mb-4">Branding & Hours</h3>
                     <FileUpload label="Logo" value={localData.logo} onChange={(v: string) => update({ logo: v })} />
                     <Input label="Weekdays" value={localData.hours?.weekdays} onChange={(v: string) => update({ hours: { ...localData.hours, weekdays: v } })} />
                     <Input label="Saturday" value={localData.hours?.saturday} onChange={(v: string) => update({ hours: { ...localData.hours, saturday: v } })} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 col-span-2">
                    <h3 className="text-white font-bold mb-4">Social Media</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {(localData.socials || []).map(s => (
                            <div key={s.id} className="bg-white/5 p-3 rounded-lg flex items-center gap-3 relative group">
                                <img src={s.icon} className="w-8 h-8"/>
                                <div className="overflow-hidden"><div className="font-bold text-sm truncate">{s.name}</div><div className="text-xs text-gray-500 truncate">{s.url}</div></div>
                                <button onClick={() => handleDeleteSocial(s.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                         <Input placeholder="Name" value={newSocial.name} onChange={(v: string) => setNewSocial({...newSocial, name: v})} />
                         <Input placeholder="URL" value={newSocial.url} onChange={(v: string) => setNewSocial({...newSocial, url: v})} />
                         <FileUpload value={newSocial.icon} onChange={(v: string) => setNewSocial({...newSocial, icon: v})} />
                         <button onClick={handleAddSocial} className="bg-pestGreen px-4 rounded text-white"><Plus/></button>
                    </div>
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 col-span-2">
                    <h3 className="text-white font-bold mb-4">Bank Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Bank" value={bankData.bankName} onChange={(v: string) => updateBank({ bankName: v })} />
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
        if (field === 'isHeadOffice' && value === true) newData.forEach((loc, i) => { if (i !== index) loc.isHeadOffice = false; });
        setLocalData(newData);
    };
    const handleAdd = () => setLocalData([...localData, { id: `loc-${Date.now()}`, name: 'New Branch', address: '', phone: '', email: '', isHeadOffice: false, image: null }]);
    return (
        <EditorLayout title="Physical Locations" icon={MapPin} description="Manage office addresses." helpText="Add/Remove branches." onSave={() => updateLocations(localData)}>
             <div className="flex justify-end mb-4"><button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Location</button></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{localData.map((loc, idx) => (
                    <div key={loc.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 relative">
                         <button onClick={() => setLocalData(localData.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-500"><Trash2 size={16}/></button>
                         <Input label="Name" value={loc.name} onChange={(v: string) => handleUpdate(idx, 'name', v)} />
                         <TextArea label="Address" value={loc.address} onChange={(v: string) => handleUpdate(idx, 'address', v)} rows={2} />
                         <div className="grid grid-cols-2 gap-4"><Input label="Phone" value={loc.phone} onChange={(v: string) => handleUpdate(idx, 'phone', v)} /><Input label="Email" value={loc.email} onChange={(v: string) => handleUpdate(idx, 'email', v)} /></div>
                         <div className="flex items-center gap-2"><input type="checkbox" checked={loc.isHeadOffice} onChange={(e) => handleUpdate(idx, 'isHeadOffice', e.target.checked)} className="accent-pestGreen"/><label className="text-white">Head Office</label></div>
                         <FileUpload label="Image" value={loc.image} onChange={(v: string) => handleUpdate(idx, 'image', v)} />
                    </div>
                ))}</div>
        </EditorLayout>
    );
};

const ContactEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.contact);
    const [bookData, setBookData] = useState(content.bookCTA);
    return (
        <EditorLayout title="Contact & CTA" icon={Phone} description="Contact page and 'Book Now' banner." helpText="Edit map and CTA." onSave={() => { updateContent('contact', localData); updateContent('bookCTA', bookData); }}>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Contact Page</h3>
                    <Input label="Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <Input label="Subtitle" value={localData.subtitle} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} />
                    <TextArea label="Map Embed URL" value={localData.mapEmbedUrl} onChange={(v: string) => setLocalData({ ...localData, mapEmbedUrl: v })} rows={3} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">CTA Banner</h3>
                    <Input label="Title" value={bookData.title} onChange={(v: string) => setBookData({ ...bookData, title: v })} />
                    <TextArea label="Subtitle" value={bookData.subtitle} onChange={(v: string) => setBookData({ ...bookData, subtitle: v })} rows={2} />
                    <Input label="Button Text" value={bookData.buttonText} onChange={(v: string) => setBookData({ ...bookData, buttonText: v })} />
                    <FileUpload label="Background" value={bookData.bgImage} onChange={(v: string) => setBookData({ ...bookData, bgImage: v })} />
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
        <EditorLayout title="Hero Section" icon={Layout} description="Headlines and background media." helpText="First thing visitors see." onSave={() => updateContent('hero', localData)}>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Text Content</h3>
                    <TextArea label="Headline" value={localData.headline} onChange={(v: string) => update({ headline: v })} rows={2} />
                    <TextArea label="Subheadline" value={localData.subheadline} onChange={(v: string) => update({ subheadline: v })} rows={2} />
                    <Input label="Button Text" value={localData.buttonText} onChange={(v: string) => update({ buttonText: v })} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Media</h3>
                    <Select label="Type" value={localData.mediaType || 'video'} options={[{label:'Video', value:'video'}, {label:'Image', value:'static'}, {label:'Carousel', value:'imageCarousel'}]} onChange={(v: string) => update({ mediaType: v })} />
                    {localData.mediaType === 'video' && <FileUpload label="Video (MP4)" value={localData.mediaVideo} onChange={(v: string) => update({ mediaVideo: v })} />}
                    {localData.mediaType === 'static' && <FileUpload label="Image" value={localData.bgImage} onChange={(v: string) => update({ bgImage: v })} />}
                    {localData.mediaType === 'imageCarousel' && <FileUpload label="Images" value={localData.mediaImages} onChange={(v: string[]) => update({ mediaImages: v })} multiple />}
                </div>
            </div>
        </EditorLayout>
    );
};

const AboutEditor = () => {
    const { content, updateAboutItems, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.about);
    const handleItemChange = (index: number, field: keyof AboutItem, value: string) => {
        const newItems = [...(localData.items || [])];
        if (newItems[index]) { newItems[index] = { ...newItems[index], [field]: value }; setLocalData({ ...localData, items: newItems }); }
    };
    const handleAddItem = () => setLocalData({ ...localData, items: [...(localData.items || []), { id: `ab-${Date.now()}`, title: "Feature", description: "Desc", iconName: "Award" }] });
    return (
        <EditorLayout title="About Us" icon={Info} description="Company story and mission." helpText="Edit company history." onSave={() => { updateContent('about', localData); updateAboutItems(localData.items || []); }}>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <Input label="Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} />
                    <TextArea label="Story Text" value={localData.text} onChange={(v: string) => setLocalData({ ...localData, text: v })} rows={6} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <Input label="Mission Title" value={localData.missionTitle} onChange={(v: string) => setLocalData({ ...localData, missionTitle: v })} />
                    <TextArea label="Mission Text" value={localData.missionText} onChange={(v: string) => setLocalData({ ...localData, missionText: v })} rows={3} />
                    <FileUpload label="Owner Image" value={localData.ownerImage} onChange={(v: string) => setLocalData({ ...localData, ownerImage: v })} />
                </div>
                <div className="col-span-2 space-y-4">
                     <div className="flex justify-between"><h3 className="text-white font-bold">Features</h3><button onClick={handleAddItem} className="bg-pestGreen px-2 py-1 rounded text-white"><Plus/></button></div>
                     <div className="grid grid-cols-3 gap-4">{localData.items.map((item, i) => (
                         <div key={i} className="bg-[#161817] p-4 rounded border border-white/5 relative">
                             <button onClick={() => setLocalData({...localData, items: localData.items.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 text-red-500"><Trash2 size={14}/></button>
                             <Input label="Title" value={item.title} onChange={(v: string) => handleItemChange(i, 'title', v)} />
                             <TextArea label="Desc" value={item.description} onChange={(v: string) => handleItemChange(i, 'description', v)} rows={2} />
                             <IconPicker label="Icon" value={item.iconName} onChange={(v: string) => handleItemChange(i, 'iconName', v)} />
                         </div>
                     ))}</div>
                </div>
            </div>
        </EditorLayout>
    );
};

const BookingModalEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.bookingModal);
    return (
        <EditorLayout title="Booking Flow" icon={MousePointerClick} description="Popup texts." helpText="Edit booking labels." onSave={() => updateContent('bookingModal', localData)}>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <Input label="Header Title" value={localData.headerTitle} onChange={(v: string) => setLocalData({...localData, headerTitle: v})} />
                    <Input label="Header Subtitle" value={localData.headerSubtitle} onChange={(v: string) => setLocalData({...localData, headerSubtitle: v})} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <Input label="Success Title" value={localData.successTitle} onChange={(v: string) => setLocalData({...localData, successTitle: v})} />
                    <TextArea label="Success Msg" value={localData.successMessage} onChange={(v: string) => setLocalData({...localData, successMessage: v})} rows={2} />
                </div>
            </div>
        </EditorLayout>
    );
};

const ServicesEditor = () => {
    const { content, updateService } = useContent();
    const [localServices, setLocalServices] = useState(content.services);
    const handleUpdate = (id: string, field: keyof ServiceItem, value: any) => setLocalServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    const handleAdd = () => setLocalServices([...localServices, { id: `srv-${Date.now()}`, title: 'New Service', description: 'Short desc', fullDescription: 'Full desc', details: [], iconName: 'Bug', visible: true, featured: false, price: '' }]);
    const handleDelete = (id: string) => confirm('Delete?') && setLocalServices(localServices.filter(s => s.id !== id));
    return (
        <EditorLayout title="Services" icon={Briefcase} description="Manage services." helpText="Add/Edit services." onSave={() => updateService(localServices)}>
            <div className="flex justify-end mb-4"><button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex gap-2"><Plus/> Add Service</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{localServices.map(s => (
                <div key={s.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative space-y-3">
                    <button onClick={() => handleDelete(s.id)} className="absolute top-4 right-4 text-red-500"><Trash2/></button>
                    <Input label="Title" value={s.title} onChange={(v: string) => handleUpdate(s.id, 'title', v)} />
                    <TextArea label="Short Desc" value={s.description} onChange={(v: string) => handleUpdate(s.id, 'description', v)} rows={2} />
                    <TextArea label="Full Desc" value={s.fullDescription} onChange={(v: string) => handleUpdate(s.id, 'fullDescription', v)} rows={4} />
                    <Input label="Price" value={s.price} onChange={(v: string) => handleUpdate(s.id, 'price', v)} />
                    <IconPicker label="Icon" value={s.iconName} onChange={(v: string) => handleUpdate(s.id, 'iconName', v)} />
                    <FileUpload label="Image" value={s.image} onChange={(v: string) => handleUpdate(s.id, 'image', v)} />
                    <div className="flex gap-4"><label className="flex gap-2 text-white"><input type="checkbox" checked={s.visible} onChange={e => handleUpdate(s.id, 'visible', e.target.checked)}/> Visible</label><label className="flex gap-2 text-white"><input type="checkbox" checked={s.featured} onChange={e => handleUpdate(s.id, 'featured', e.target.checked)}/> Featured</label></div>
                </div>
            ))}</div>
        </EditorLayout>
    );
};

const ProcessEditor = () => {
    const { content, updateProcessSteps } = useContent();
    const [steps, setSteps] = useState(content.process.steps);
    return (
        <EditorLayout title="Process" icon={Workflow} description="Edit workflow steps." helpText="Edit 4 steps." onSave={() => updateProcessSteps(steps)}>
            <div className="grid grid-cols-2 gap-4">{steps.map((step, i) => (
                <div key={i} className="bg-[#161817] p-4 rounded border border-white/5 space-y-2">
                    <h4 className="text-white font-bold">Step {step.step}</h4>
                    <Input label="Title" value={step.title} onChange={(v: string) => { const ns = [...steps]; ns[i].title = v; setSteps(ns); }} />
                    <TextArea label="Desc" value={step.description} onChange={(v: string) => { const ns = [...steps]; ns[i].description = v; setSteps(ns); }} rows={2} />
                    <IconPicker label="Icon" value={step.iconName} onChange={(v: string) => { const ns = [...steps]; ns[i].iconName = v; setSteps(ns); }} />
                </div>
            ))}</div>
        </EditorLayout>
    );
};

const ServiceAreaEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.serviceArea);
    return (
        <EditorLayout title="Service Area" icon={Map} description="Map and towns." helpText="Coverage area." onSave={() => updateContent('serviceArea', local)}>
            <Input label="Title" value={local.title} onChange={(v: string) => setLocal({...local, title: v})} />
            <TextArea label="Description" value={local.description} onChange={(v: string) => setLocal({...local, description: v})} rows={2} />
            <TextArea label="Towns (comma separated)" value={local.towns.join(', ')} onChange={(v: string) => setLocal({...local, towns: v.split(',').map(s=>s.trim())})} rows={2} />
            <FileUpload label="Map Image" value={local.mapImage} onChange={(v: string) => setLocal({...local, mapImage: v})} />
        </EditorLayout>
    );
};

const SafetyEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.safety);
    return (
        <EditorLayout title="Safety" icon={Shield} description="Compliance info." helpText="Safety badges." onSave={() => updateContent('safety', local)}>
            <Input label="Title" value={local.title} onChange={(v: string) => setLocal({...local, title: v})} />
            <TextArea label="Desc" value={local.description} onChange={(v: string) => setLocal({...local, description: v})} rows={2} />
            <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                    <div key={i} className="bg-[#161817] p-4 rounded border border-white/5">
                        <Input label={`Badge ${i} Text`} value={(local as any)[`badge${i}`]} onChange={(v: string) => setLocal({...local, [`badge${i}`]: v})} />
                        <IconPicker label="Icon" value={(local as any)[`badge${i}IconName`]} onChange={(v: string) => setLocal({...local, [`badge${i}IconName`]: v})} />
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const FaqEditor = () => {
    const { content, updateFaqs } = useContent();
    const [faqs, setFaqs] = useState(content.faqs);
    return (
        <EditorLayout title="FAQs" icon={HelpCircle} description="Common questions." helpText="Manage FAQs." onSave={() => updateFaqs(faqs)}>
            <button onClick={() => setFaqs([...faqs, { id: Date.now().toString(), question: 'Q?', answer: 'A.' }])} className="bg-pestGreen text-white px-4 py-2 rounded mb-4">Add FAQ</button>
            <div className="space-y-4">{faqs.map((f, i) => (
                <div key={f.id} className="bg-[#161817] p-4 rounded border border-white/5 relative space-y-2">
                    <button onClick={() => setFaqs(faqs.filter(x => x.id !== f.id))} className="absolute top-2 right-2 text-red-500"><Trash2/></button>
                    <Input label="Question" value={f.question} onChange={(v: string) => { const n = [...faqs]; n[i].question = v; setFaqs(n); }} />
                    <TextArea label="Answer" value={f.answer} onChange={(v: string) => { const n = [...faqs]; n[i].answer = v; setFaqs(n); }} rows={2} />
                </div>
            ))}</div>
        </EditorLayout>
    );
};

const SeoEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.seo);
    return (
        <EditorLayout title="SEO" icon={Search} description="Search Engine settings." helpText="Meta tags." onSave={() => updateContent('seo', local)}>
            <Input label="Meta Title" value={local.metaTitle} onChange={(v: string) => setLocal({...local, metaTitle: v})} />
            <TextArea label="Meta Description" value={local.metaDescription} onChange={(v: string) => setLocal({...local, metaDescription: v})} rows={3} />
            <Input label="Keywords" value={local.keywords} onChange={(v: string) => setLocal({...local, keywords: v})} />
            <FileUpload label="OG Image" value={local.ogImage} onChange={(v: string) => setLocal({...local, ogImage: v})} />
        </EditorLayout>
    );
};

const EmployeeEditor = () => {
    const { content, addEmployee, updateEmployee, deleteEmployee } = useContent();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Employee>>({});

    const startEdit = (e?: Employee) => {
        setEditingId(e ? e.id : 'new');
        setFormData(e || { 
            id: `emp-${Date.now()}`, fullName: '', email: '', loginName: '', pin: '1234', 
            jobTitle: 'Technician', permissions: { isAdmin: false, canDoAssessment: true, canCreateQuotes: false, canExecuteJob: true, canInvoice: false, canViewReports: false, canManageEmployees: false, canEditSiteContent: false },
            doctorsNumbers: [], documents: [], profileImage: null 
        });
    };

    const save = () => {
        if (editingId === 'new') addEmployee(formData as Employee);
        else if (editingId) updateEmployee(editingId, formData);
        setEditingId(null);
    };

    if (editingId) return (
        <div className="bg-[#1e201f] p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-white font-bold">{editingId === 'new' ? 'Add Employee' : 'Edit Employee'}</h3>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" value={formData.fullName} onChange={(v: string) => setFormData({...formData, fullName: v})} />
                <Input label="Job Title" value={formData.jobTitle} onChange={(v: string) => setFormData({...formData, jobTitle: v})} />
                <Input label="Email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                <Input label="Login Name" value={formData.loginName} onChange={(v: string) => setFormData({...formData, loginName: v})} />
                <Input label="PIN" value={formData.pin} onChange={(v: string) => setFormData({...formData, pin: v})} />
            </div>
            <div className="bg-[#0f1110] p-4 rounded border border-white/5">
                <h4 className="text-white font-bold mb-2">Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(formData.permissions || {}).map(perm => (
                        <label key={perm} className="flex items-center gap-2 text-gray-400">
                            <input type="checkbox" checked={(formData.permissions as any)[perm]} onChange={e => setFormData({...formData, permissions: {...formData.permissions, [perm]: e.target.checked} as any})} />
                            {perm}
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={save} className="bg-pestGreen text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <button onClick={() => startEdit()} className="bg-pestGreen text-white px-4 py-2 rounded flex gap-2"><Plus/> Add Employee</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.employees.map(e => (
                    <div key={e.id} className="bg-[#161817] p-4 rounded border border-white/5 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-white">{e.fullName}</div>
                            <div className="text-xs text-gray-500">{e.jobTitle}</div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(e)} className="text-blue-400"><Edit size={16}/></button>
                            <button onClick={() => deleteEmployee(e.id)} className="text-red-500"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreatorDashboard = () => {
    const { content, updateContent, resetSystem, clearSystem, downloadBackup, restoreBackup } = useContent();
    const [local, setLocal] = useState(content.creatorWidget);
    return (
        <EditorLayout title="Creator & System" icon={Database} description="Widget & Backup." helpText="System tools." onSave={() => updateContent('creatorWidget', local)}>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Widget</h3>
                    <Input label="Slogan" value={local.slogan} onChange={(v: string) => setLocal({...local, slogan: v})} />
                    <Input label="CTA" value={local.ctaText} onChange={(v: string) => setLocal({...local, ctaText: v})} />
                    <FileUpload label="Logo" value={local.logo} onChange={(v: string) => setLocal({...local, logo: v})} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">System Actions</h3>
                    <button onClick={downloadBackup} className="w-full bg-blue-600 text-white p-3 rounded flex justify-center gap-2"><Download/> Backup Data</button>
                    <label className="w-full bg-purple-600 text-white p-3 rounded flex justify-center gap-2 cursor-pointer">
                        <Upload/> Restore Data <input type="file" className="hidden" onChange={e => e.target.files?.[0] && restoreBackup(e.target.files[0])} />
                    </label>
                    <button onClick={() => confirm("Reset to defaults?") && resetSystem()} className="w-full bg-yellow-600 text-white p-3 rounded flex justify-center gap-2"><RotateCcw/> Reset to Defaults</button>
                    <button onClick={() => confirm("NUKE ALL DATA?") && clearSystem()} className="w-full bg-red-600 text-white p-3 rounded flex justify-center gap-2"><Trash2/> Clear All Data</button>
                </div>
            </div>
        </EditorLayout>
    );
};

// --- MAIN DASHBOARD ---

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
    const [activeMainTab, setActiveMainTab] = useState<AdminMainTab>('work');
    const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('jobs');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const { content } = useContent();

    // Render Job Manager if job selected
    if (selectedJobId) {
        return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
    }

    const renderSidebar = () => (
        <div className="w-64 bg-[#161817] flex flex-col h-full border-r border-white/5">
            <div className="p-6 border-b border-white/5">
                <h1 className="text-white font-black text-xl uppercase tracking-wider">Admin Panel</h1>
                <p className="text-xs text-gray-500 mt-1">Logged in as {loggedInUser?.fullName || 'Admin'}</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Work</div>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('jobs'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'jobs' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Clipboard size={16}/> Jobs</button>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('faqs'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'faqs' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><HelpCircle size={16}/> FAQs</button>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Content</div>
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('hero'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'hero' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Layout size={16}/> Hero</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('servicesList'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'servicesList' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Briefcase size={16}/> Services</button>
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('about'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'about' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Info size={16}/> About</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('process'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'process' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Workflow size={16}/> Process</button>
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('whyChooseUs'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'whyChooseUs' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><ThumbsUp size={16}/> Why Us</button>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Settings</div>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('companyDetails'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'companyDetails' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Building2 size={16}/> Company</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('locations'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'locations' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><MapPin size={16}/> Locations</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('employeeDirectory'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'employeeDirectory' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Users size={16}/> Employees</button>
                    <button onClick={() => { setActiveMainTab('creator'); setActiveSubTab('creatorSettings'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'creatorSettings' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Database size={16}/> System</button>
                </div>
            </nav>
            <div className="p-4 border-t border-white/5">
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-colors">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeSubTab) {
            // Work
            case 'jobs': return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Clipboard/> Job Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.jobCards.map(job => (
                            <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="bg-[#161817] p-4 rounded-xl border border-white/5 cursor-pointer hover:border-pestGreen transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-white">{job.refNumber}</div>
                                    <div className="text-xs bg-white/10 px-2 py-1 rounded text-white">{job.status}</div>
                                </div>
                                <div className="text-sm text-gray-400">{job.clientName}</div>
                                <div className="text-xs text-gray-500 mt-2">{job.clientAddressDetails.suburb}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'faqs': return <FaqEditor />;
            
            // Content
            case 'hero': return <HeroEditor />;
            case 'about': return <AboutEditor />;
            case 'whyChooseUs': return <WhyChooseUsEditor />;
            case 'process': return <ProcessEditor />;
            case 'servicesList': return <ServicesEditor />;
            case 'safety': return <SafetyEditor />;
            
            // Settings
            case 'companyDetails': return <CompanyEditor />;
            case 'locations': return <LocationsEditor />;
            case 'contactPage': return <ContactEditor />;
            case 'bookingSettings': return <BookingModalEditor />;
            case 'seo': return <SeoEditor />;
            case 'serviceAreaMap': return <ServiceAreaEditor />;
            case 'employeeDirectory': return <EmployeeEditor />;
            case 'creatorSettings': return <CreatorDashboard />;
            
            default: return <div className="text-gray-500">Select a tab</div>;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f1110] flex text-white font-sans overflow-hidden">
            {renderSidebar()}
            <main className="flex-1 overflow-y-auto p-8 relative">
                {renderContent()}
            </main>
        </div>
    );
};
