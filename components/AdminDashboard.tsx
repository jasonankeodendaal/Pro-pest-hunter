
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
import { Employee, AdminMainTab, AdminSubTab, JobCard, ServiceItem, ProcessStep, FAQItem, WhyChooseUsItem, SocialLink, AdminDashboardProps, Location, AboutItem, Booking } from '../types';
import { Input, TextArea, Select, FileUpload, IconPicker } from './ui/AdminShared'; 
import { JobCardManager } from './JobCardManager';

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
        if(confirm("Delete?")) { 
            const newItems = (localData.items || []).filter((_, i) => i !== index); 
            setLocalData({ ...localData, items: newItems }); 
        } 
    }; 
    const handleAddItem = () => { 
        setLocalData({ ...localData, items: [...(localData.items || []), { title: "New", text: "Desc", iconName: "Award" }] }); 
    }; 
    
    return ( 
        <EditorLayout 
            title="Why Choose Us" 
            icon={ThumbsUp} 
            description="Manage the reasons displayed on the homepage." 
            helpText="Add unique selling points." 
            onSave={() => { updateContent('whyChooseUs', { title: localData.title, subtitle: localData.subtitle }); updateWhyChooseUsItems(localData.items || []); }}
        > 
            <div className="space-y-4"> 
                <Input label="Title" value={localData.title} onChange={(v: string) => setLocalData({ ...localData, title: v })} /> 
                <Input label="Subtitle" value={localData.subtitle} onChange={(v: string) => setLocalData({ ...localData, subtitle: v })} /> 
                <button onClick={handleAddItem} className="bg-pestGreen px-3 py-1 rounded text-white">+ Add Item</button> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(localData.items||[]).map((item,i)=> (
                        <div key={i} className="bg-[#161817] p-4 rounded border border-white/5 relative">
                            <button onClick={()=>handleDeleteItem(i)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                            <Input label="Title" value={item.title} onChange={(v:string)=>handleItemChange(i,'title',v)}/>
                            <TextArea label="Desc" value={item.text} onChange={(v:string)=>handleItemChange(i,'text',v)} rows={2}/>
                            <IconPicker label="Icon" value={item.iconName} onChange={(v:string)=>handleItemChange(i,'iconName',v)}/>
                        </div>
                    ))}
                </div> 
            </div> 
        </EditorLayout> 
    ); 
};

const CompanyEditor = () => { 
    const { content, updateContent } = useContent(); 
    const [localData, setLocalData] = useState(content.company); 
    const [bankData, setBankData] = useState(content.bankDetails); 
    
    const handleSave = () => { 
        updateContent('company', localData); 
        updateContent('bankDetails', bankData); 
    }; 

    return ( 
        <EditorLayout 
            title="Company Info" 
            icon={Building2} 
            description="General company details, hours, and banking." 
            helpText="These details appear in the footer, contact page, and invoices." 
            onSave={handleSave}
        > 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"> 
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">General Details</h3>
                    <Input label="Company Name" value={localData.name} onChange={(v:string)=>setLocalData({...localData, name: v})}/> 
                    <Input label="Reg Number" value={localData.regNumber || ''} onChange={(v:string)=>setLocalData({...localData, regNumber: v})}/> 
                    <Input label="VAT Number" value={localData.vatNumber || ''} onChange={(v:string)=>setLocalData({...localData, vatNumber: v})}/> 
                    <Input label="Phone" value={localData.phone} onChange={(v:string)=>setLocalData({...localData, phone: v})}/> 
                    <Input label="Email" value={localData.email} onChange={(v:string)=>setLocalData({...localData, email: v})}/> 
                    <Input label="Address" value={localData.address} onChange={(v:string)=>setLocalData({...localData, address: v})}/> 
                    <FileUpload label="Logo" value={localData.logo} onChange={(v:string)=>setLocalData({...localData, logo: v})} />
                </div>
                
                <div className="space-y-4">
                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                        <h3 className="text-white font-bold">Banking Details</h3>
                        <Input label="Bank Name" value={bankData.bankName} onChange={(v:string)=>setBankData({...bankData, bankName: v})}/>
                        <Input label="Account Name" value={bankData.accountName} onChange={(v:string)=>setBankData({...bankData, accountName: v})}/>
                        <Input label="Account Number" value={bankData.accountNumber} onChange={(v:string)=>setBankData({...bankData, accountNumber: v})}/>
                        <Input label="Branch Code" value={bankData.branchCode} onChange={(v:string)=>setBankData({...bankData, branchCode: v})}/>
                    </div>

                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                        <h3 className="text-white font-bold">Business Hours</h3>
                        <Input label="Weekdays" value={localData.hours.weekdays} onChange={(v:string)=>setLocalData({...localData, hours: {...localData.hours, weekdays: v}})}/>
                        <Input label="Saturdays" value={localData.hours.saturday} onChange={(v:string)=>setLocalData({...localData, hours: {...localData.hours, saturday: v}})}/>
                        <Input label="Sundays" value={localData.hours.sunday} onChange={(v:string)=>setLocalData({...localData, hours: {...localData.hours, sunday: v}})}/>
                    </div>
                </div>
            </div> 
        </EditorLayout> 
    ); 
};

const LocationsEditor = () => { 
    const { content, updateLocations } = useContent(); 
    const [local, setLocal] = useState(content.locations); 
    
    return (
        <EditorLayout 
            title="Locations" 
            icon={MapPin} 
            description="Manage office and shop locations." 
            helpText="Add all physical branches." 
            onSave={()=>updateLocations(local)}
        >
            <div className="space-y-4">
                <button onClick={() => setLocal([...local, { id: Date.now().toString(), name: 'New Branch', address: '', phone: '', email: '', isHeadOffice: false, image: '' }])} className="bg-pestGreen px-3 py-1 rounded text-white">+ Add Location</button>
                {local.map((l,i)=>(
                    <div key={i} className="bg-[#161817] p-4 rounded-xl border border-white/5 relative grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={()=>{const n=local.filter((_,idx)=>idx!==i);setLocal(n)}} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                        <Input label="Name" value={l.name} onChange={(v:string)=>{const n=[...local];n[i].name=v;setLocal(n)}}/>
                        <Input label="Address" value={l.address} onChange={(v:string)=>{const n=[...local];n[i].address=v;setLocal(n)}}/>
                        <Input label="Phone" value={l.phone} onChange={(v:string)=>{const n=[...local];n[i].phone=v;setLocal(n)}}/>
                        <Input label="Email" value={l.email} onChange={(v:string)=>{const n=[...local];n[i].email=v;setLocal(n)}}/>
                        <FileUpload label="Image" value={l.image} onChange={(v:string)=>{const n=[...local];n[i].image=v;setLocal(n)}}/>
                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" checked={l.isHeadOffice} onChange={(e)=>{const n=[...local];n.forEach(x=>x.isHeadOffice=false);n[i].isHeadOffice=e.target.checked;setLocal(n)}} />
                            <label className="text-white text-sm">Head Office</label>
                        </div>
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const ContactEditor = () => { 
    const { content, updateContent } = useContent(); 
    const [local, setLocal] = useState(content.contact);
    const [ctaLocal, setCtaLocal] = useState(content.bookCTA);

    return (
        <EditorLayout 
            title="Contact & CTA" 
            icon={Phone} 
            description="Manage contact page details and global Call-To-Action banners." 
            helpText="Update the contact form title and the Book Now banner." 
            onSave={()=>{updateContent('contact', local); updateContent('bookCTA', ctaLocal);}}
        >
            <div className="space-y-8">
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Contact Section</h3>
                    <Input label="Title" value={local.title} onChange={(v:string)=>setLocal({...local, title: v})}/>
                    <Input label="Subtitle" value={local.subtitle} onChange={(v:string)=>setLocal({...local, subtitle: v})}/>
                    <Input label="Form Title" value={local.formTitle} onChange={(v:string)=>setLocal({...local, formTitle: v})}/>
                    <Input label="Map Embed URL" value={local.mapEmbedUrl || ''} onChange={(v:string)=>setLocal({...local, mapEmbedUrl: v})}/>
                </div>
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Book CTA Banner</h3>
                    <Input label="Title" value={ctaLocal.title} onChange={(v:string)=>setCtaLocal({...ctaLocal, title: v})}/>
                    <Input label="Subtitle" value={ctaLocal.subtitle} onChange={(v:string)=>setCtaLocal({...ctaLocal, subtitle: v})}/>
                    <Input label="Button Text" value={ctaLocal.buttonText} onChange={(v:string)=>setCtaLocal({...ctaLocal, buttonText: v})}/>
                    <FileUpload label="Background Image" value={ctaLocal.bgImage} onChange={(v:string)=>setCtaLocal({...ctaLocal, bgImage: v})}/>
                </div>
            </div>
        </EditorLayout>
    );
};

const HeroEditor = () => {
    const { content, updateContent } = useContent();
    const [localData, setLocalData] = useState(content.hero);
    return (
        <EditorLayout title="Hero" icon={Layout} description="Main homepage banner configuration." helpText="Control the first impression." onSave={()=>updateContent('hero', localData)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Input label="Headline" value={localData.headline} onChange={(v:string)=>setLocalData({...localData, headline: v})}/>
                    <Input label="Subheadline" value={localData.subheadline} onChange={(v:string)=>setLocalData({...localData, subheadline: v})}/>
                    <Input label="Button Text" value={localData.buttonText} onChange={(v:string)=>setLocalData({...localData, buttonText: v})}/>
                    <FileUpload label="Background Image (Static)" value={localData.bgImage} onChange={(v:string)=>setLocalData({...localData, bgImage: v})}/>
                </div>
                <div className="space-y-4">
                    {/* UPDATED: VIDEO UPLOAD instead of Input URL */}
                    <FileUpload 
                        label="Video Upload (MP4/WebM)" 
                        value={localData.mediaVideo || ''} 
                        onChange={(v:string)=>setLocalData({...localData, mediaVideo: v})} 
                        accept="video/mp4,video/webm,video/ogg"
                    />
                    <div className="flex items-center gap-2">
                         <label className="text-white text-sm">Overlay Opacity %</label>
                         <input type="number" value={localData.overlayOpacity} onChange={(e)=>setLocalData({...localData, overlayOpacity: parseInt(e.target.value)})} className="bg-black text-white border border-white/20 p-1 rounded w-20"/>
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

const AboutEditor = () => { 
    const { content, updateContent, updateAboutItems } = useContent(); 
    const [local, setLocal] = useState(content.about);

    const handleItemChange = (i: number, f: keyof AboutItem, v: string) => {
        const items = [...local.items];
        items[i] = { ...items[i], [f]: v };
        setLocal({ ...local, items });
    };

    return (
        <EditorLayout title="About" icon={Info} description="Company story and core values." helpText="Edit the about section." onSave={()=>{updateContent('about', local);}}>
            <div className="space-y-6">
                 <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <Input label="Title" value={local.title} onChange={(v:string)=>setLocal({...local, title: v})}/>
                    <TextArea label="Story Text" value={local.text} onChange={(v:string)=>setLocal({...local, text: v})}/>
                    <Input label="Mission Title" value={local.missionTitle} onChange={(v:string)=>setLocal({...local, missionTitle: v})}/>
                    <TextArea label="Mission Text" value={local.missionText} onChange={(v:string)=>setLocal({...local, missionText: v})}/>
                    <FileUpload label="Owner Image" value={local.ownerImage} onChange={(v:string)=>setLocal({...local, ownerImage: v})}/>
                 </div>
                 
                 <div className="space-y-4">
                     <h3 className="text-white font-bold">Key Highlights</h3>
                     {local.items.map((item, i) => (
                         <div key={item.id} className="bg-[#161817] p-4 rounded border border-white/5 relative">
                             <Input label="Title" value={item.title} onChange={(v:string)=>handleItemChange(i, 'title', v)}/>
                             <TextArea label="Description" value={item.description} onChange={(v:string)=>handleItemChange(i, 'description', v)} rows={2}/>
                             <IconPicker label="Icon" value={item.iconName} onChange={(v:string)=>handleItemChange(i, 'iconName', v)}/>
                         </div>
                     ))}
                 </div>
            </div>
        </EditorLayout>
    ); 
};

const ServicesEditor = () => { 
    const { content, updateService } = useContent(); 
    const [local, setLocal] = useState(content.services);
    
    const updateItem = (i: number, f: keyof ServiceItem, v: any) => {
        const n = [...local];
        n[i] = { ...n[i], [f]: v };
        setLocal(n);
    };

    return (
        <EditorLayout title="Services" icon={Briefcase} description="Manage service offerings." helpText="Edit services list." onSave={()=>updateService(local)}>
            <div className="space-y-4">
                 <button onClick={() => setLocal([...local, { id: Date.now().toString(), title: 'New Service', description: '', fullDescription: '', details: [], iconName: 'Bug', visible: true, featured: false }])} className="bg-pestGreen px-3 py-1 rounded text-white">+ Add Service</button>
                 {local.map((s, i) => (
                     <div key={s.id} className="bg-[#161817] p-6 rounded-xl border border-white/5 relative grid grid-cols-1 md:grid-cols-2 gap-4">
                         <button onClick={()=>{const n=local.filter((_,idx)=>idx!==i);setLocal(n)}} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                         <div className="space-y-4">
                            <Input label="Title" value={s.title} onChange={(v:string)=>updateItem(i, 'title', v)}/>
                            <Input label="Price Text" value={s.price || ''} onChange={(v:string)=>updateItem(i, 'price', v)}/>
                            <TextArea label="Short Desc" value={s.description} onChange={(v:string)=>updateItem(i, 'description', v)} rows={2}/>
                            <IconPicker label="Icon" value={s.iconName} onChange={(v:string)=>updateItem(i, 'iconName', v)}/>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2 text-white"><input type="checkbox" checked={s.visible} onChange={(e)=>updateItem(i, 'visible', e.target.checked)}/> Visible</label>
                                <label className="flex items-center gap-2 text-white"><input type="checkbox" checked={s.featured} onChange={(e)=>updateItem(i, 'featured', e.target.checked)}/> Featured</label>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <TextArea label="Full Description" value={s.fullDescription} onChange={(v:string)=>updateItem(i, 'fullDescription', v)} rows={4}/>
                            <FileUpload label="Detail Image" value={s.image} onChange={(v:string)=>updateItem(i, 'image', v)}/>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Bullet Points (One per line)</label>
                                <textarea 
                                    className="w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white outline-none" 
                                    rows={4} 
                                    value={s.details.join('\n')} 
                                    onChange={(e) => updateItem(i, 'details', e.target.value.split('\n'))}
                                />
                            </div>
                         </div>
                     </div>
                 ))}
            </div>
        </EditorLayout>
    ); 
};

// --- RESTORED MISSING EDITORS ---

const FaqEditor = () => {
    const { content, updateFaqs } = useContent();
    const [local, setLocal] = useState(content.faqs);

    const updateItem = (i: number, f: keyof FAQItem, v: string) => {
        const n = [...local];
        n[i] = { ...n[i], [f]: v };
        setLocal(n);
    };

    return (
        <EditorLayout title="FAQs" icon={HelpCircle} description="Manage Frequently Asked Questions." helpText="Add helpful Q&A." onSave={()=>updateFaqs(local)}>
            <div className="space-y-4">
                <button onClick={() => setLocal([...local, { id: Date.now().toString(), question: 'New Question?', answer: 'Answer here.' }])} className="bg-pestGreen px-3 py-1 rounded text-white">+ Add FAQ</button>
                {local.map((faq, i) => (
                    <div key={faq.id} className="bg-[#161817] p-4 rounded-xl border border-white/5 relative space-y-2">
                         <button onClick={()=>{const n=local.filter((_,idx)=>idx!==i);setLocal(n)}} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
                         <Input label="Question" value={faq.question} onChange={(v:string)=>updateItem(i, 'question', v)}/>
                         <TextArea label="Answer" value={faq.answer} onChange={(v:string)=>updateItem(i, 'answer', v)} rows={2}/>
                    </div>
                ))}
            </div>
        </EditorLayout>
    );
};

const ProcessEditor = () => {
    const { content, updateProcessSteps, updateContent } = useContent();
    const [local, setLocal] = useState(content.process);

    const updateStep = (i: number, f: keyof ProcessStep, v: any) => {
        const n = [...local.steps];
        n[i] = { ...n[i], [f]: v };
        setLocal({...local, steps: n});
    };

    return (
        <EditorLayout title="Process" icon={Workflow} description="Define the 4-step process." helpText="Keep steps concise." onSave={()=>{ updateContent('process', local); updateProcessSteps(local.steps); }}>
            <div className="space-y-6">
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <Input label="Section Title" value={local.title} onChange={(v:string)=>setLocal({...local, title: v})}/>
                    <Input label="Subtitle" value={local.subtitle} onChange={(v:string)=>setLocal({...local, subtitle: v})}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {local.steps.map((step, i) => (
                        <div key={step.step} className="bg-[#161817] p-4 rounded-xl border border-white/5 relative space-y-3">
                             <span className="absolute top-2 right-2 text-pestGreen font-bold text-lg">#{step.step}</span>
                             <Input label="Step Title" value={step.title} onChange={(v:string)=>updateStep(i, 'title', v)}/>
                             <TextArea label="Description" value={step.description} onChange={(v:string)=>updateStep(i, 'description', v)} rows={3}/>
                             <IconPicker label="Icon" value={step.iconName} onChange={(v:string)=>updateStep(i, 'iconName', v)}/>
                        </div>
                    ))}
                </div>
            </div>
        </EditorLayout>
    );
};

const SafetyEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.safety);

    return (
        <EditorLayout title="Safety" icon={Shield} description="Compliance and safety badges." helpText="Upload certs." onSave={()=>updateContent('safety', local)}>
            <div className="space-y-6">
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <Input label="Title" value={local.title} onChange={(v:string)=>setLocal({...local, title: v})}/>
                    <TextArea label="Description" value={local.description} onChange={(v:string)=>setLocal({...local, description: v})} rows={3}/>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {['badge1', 'badge2', 'badge3'].map((b, i) => (
                        <div key={b} className="bg-[#161817] p-4 rounded border border-white/5">
                            <Input label={`Badge ${i+1}`} value={(local as any)[b]} onChange={(v:string)=>setLocal({...local, [b]: v})}/>
                            <IconPicker label="Icon" value={(local as any)[`${b}IconName`]} onChange={(v:string)=>setLocal({...local, [`${b}IconName`]: v})}/>
                        </div>
                    ))}
                </div>
                <div>
                    <h4 className="text-white font-bold mb-2">Certificates</h4>
                    <FileUpload label="Upload Certificates" value={local.certificates} onChange={(v:string[])=>setLocal({...local, certificates: v})} multiple={true}/>
                </div>
            </div>
        </EditorLayout>
    );
};

const ServiceAreaEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.serviceArea);

    return (
        <EditorLayout title="Service Area" icon={Map} description="Map and covered towns." helpText="Towns comma separated." onSave={()=>updateContent('serviceArea', local)}>
            <div className="space-y-6">
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <Input label="Title" value={local.title} onChange={(v:string)=>setLocal({...local, title: v})}/>
                    <TextArea label="Description" value={local.description} onChange={(v:string)=>setLocal({...local, description: v})} rows={2}/>
                    <Input label="Towns (Comma Separated)" value={local.towns.join(', ')} onChange={(v:string)=>setLocal({...local, towns: v.split(',').map(t=>t.trim()).filter(Boolean)})}/>
                </div>
                <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold">Map Visuals</h3>
                    <Input label="Google Maps Embed URL" value={local.mapEmbedUrl || ''} onChange={(v:string)=>setLocal({...local, mapEmbedUrl: v})}/>
                    <FileUpload label="Static Map Image" value={local.mapImage} onChange={(v:string)=>setLocal({...local, mapImage: v})}/>
                </div>
            </div>
        </EditorLayout>
    );
};

const BookingModalEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.bookingModal);

    return (
        <EditorLayout title="Booking Flow" icon={MousePointerClick} description="Customize the booking popup." helpText="Edit labels and success messages." onSave={()=>updateContent('bookingModal', local)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Header Title" value={local.headerTitle} onChange={(v:string)=>setLocal({...local, headerTitle: v})}/>
                <Input label="Header Subtitle" value={local.headerSubtitle} onChange={(v:string)=>setLocal({...local, headerSubtitle: v})}/>
                <Input label="Step 1 Title" value={local.stepServiceTitle} onChange={(v:string)=>setLocal({...local, stepServiceTitle: v})}/>
                <Input label="Step 2 Title" value={local.stepDateTitle} onChange={(v:string)=>setLocal({...local, stepDateTitle: v})}/>
                <Input label="Step 3 Title" value={local.stepDetailsTitle} onChange={(v:string)=>setLocal({...local, stepDetailsTitle: v})}/>
                <Input label="Success Title" value={local.successTitle} onChange={(v:string)=>setLocal({...local, successTitle: v})}/>
                <Input label="Success Message" value={local.successMessage} onChange={(v:string)=>setLocal({...local, successMessage: v})}/>
                <Input label="Terms Text" value={local.termsText || ''} onChange={(v:string)=>setLocal({...local, termsText: v})}/>
            </div>
        </EditorLayout>
    );
};

const SeoEditor = () => {
    const { content, updateContent } = useContent();
    const [local, setLocal] = useState(content.seo);

    return (
        <EditorLayout title="SEO & Meta" icon={Search} description="Search Engine Optimization settings." helpText="Meta tags for Google." onSave={()=>updateContent('seo', local)}>
            <div className="space-y-4">
                <Input label="Meta Title" value={local.metaTitle} onChange={(v:string)=>setLocal({...local, metaTitle: v})}/>
                <TextArea label="Meta Description" value={local.metaDescription} onChange={(v:string)=>setLocal({...local, metaDescription: v})} rows={3}/>
                <TextArea label="Keywords" value={local.keywords} onChange={(v:string)=>setLocal({...local, keywords: v})} rows={2}/>
                <FileUpload label="Social Share Image (OG:Image)" value={local.ogImage} onChange={(v:string)=>setLocal({...local, ogImage: v})}/>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Advanced</h4>
                    <TextArea label="Structured Data (JSON-LD)" value={local.structuredDataJSON || ''} onChange={(v:string)=>setLocal({...local, structuredDataJSON: v})} rows={6}/>
                </div>
            </div>
        </EditorLayout>
    );
};

const EmployeeEditor = () => {
    const { content, addEmployee, updateEmployee, deleteEmployee } = useContent();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Employee>>({});

    const startEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setEditForm(emp);
    };

    const handleSave = () => {
        if (editingId && editForm.fullName) {
            updateEmployee(editingId, editForm);
            setEditingId(null);
        } else if (!editingId && editForm.fullName) {
            // Add new
            const newEmp = {
                ...editForm,
                id: `emp-${Date.now()}`,
                permissions: editForm.permissions || { isAdmin: false, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: false, canViewReports: false, canManageEmployees: false, canEditSiteContent: false },
                documents: [], doctorsNumbers: []
            } as Employee;
            addEmployee(newEmp);
            setEditForm({});
        }
    };

    return (
        <EditorLayout title="Employees" icon={Users} description="Manage team members and access." helpText="Set permissions carefully." onSave={()=>{}}>
            <div className="space-y-8">
                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.employees.map(emp => (
                        <div key={emp.id} className="bg-[#161817] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                                {emp.profileImage ? <img src={emp.profileImage} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2"/>}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{emp.fullName}</h4>
                                <p className="text-xs text-pestGreen">{emp.jobTitle}</p>
                            </div>
                            <button onClick={()=>startEdit(emp)} className="text-gray-400 hover:text-white p-2"><Edit size={16}/></button>
                            <button onClick={()=>{if(confirm('Delete?')) deleteEmployee(emp.id)}} className="text-red-500 p-2"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    <button onClick={()=>{setEditingId(''); setEditForm({})}} className="bg-pestGreen/20 text-pestGreen border border-pestGreen/50 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-pestGreen/30 transition-colors">
                        <Plus size={24}/>
                        <span className="text-xs font-bold mt-2">Add Employee</span>
                    </button>
                </div>

                {/* Edit Form */}
                {(editingId !== null || Object.keys(editForm).length > 0) && (
                    <div className="bg-[#161817] p-6 rounded-xl border border-white/10 space-y-4 animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                             <h3 className="font-bold text-white">{editingId ? 'Edit Employee' : 'New Employee'}</h3>
                             <button onClick={()=>{setEditingId(null); setEditForm({})}}><X size={20} className="text-gray-500"/></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Full Name" value={editForm.fullName || ''} onChange={(v:string)=>setEditForm({...editForm, fullName: v})}/>
                            <Input label="Job Title" value={editForm.jobTitle || ''} onChange={(v:string)=>setEditForm({...editForm, jobTitle: v})}/>
                            <Input label="Email" value={editForm.email || ''} onChange={(v:string)=>setEditForm({...editForm, email: v})}/>
                            <Input label="Phone" value={editForm.tel || ''} onChange={(v:string)=>setEditForm({...editForm, tel: v})}/>
                            <Input label="Login Name" value={editForm.loginName || ''} onChange={(v:string)=>setEditForm({...editForm, loginName: v})}/>
                            <Input label="PIN Code" value={editForm.pin || ''} onChange={(v:string)=>setEditForm({...editForm, pin: v})}/>
                            <FileUpload label="Profile Image" value={editForm.profileImage} onChange={(v:string)=>setEditForm({...editForm, profileImage: v})}/>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Permissions</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['isAdmin', 'canDoAssessment', 'canCreateQuotes', 'canExecuteJob', 'canInvoice', 'canManageEmployees', 'canEditSiteContent'].map(perm => (
                                    <label key={perm} className="flex items-center gap-2 text-sm text-gray-300">
                                        <input 
                                            type="checkbox" 
                                            checked={(editForm.permissions as any)?.[perm] || false} 
                                            onChange={(e) => setEditForm({
                                                ...editForm, 
                                                permissions: { ...(editForm.permissions || {} as any), [perm]: e.target.checked }
                                            })}
                                        />
                                        {perm.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleSave} className="w-full bg-pestGreen text-white py-3 rounded-xl font-bold">
                            {editingId ? 'Update Employee' : 'Create Employee'}
                        </button>
                    </div>
                )}
            </div>
        </EditorLayout>
    );
};

const CreatorDashboard = () => {
    const { content, updateContent, resetSystem, clearSystem, downloadBackup, restoreBackup, dbType } = useContent();
    const [local, setLocal] = useState(content.creatorWidget);

    return (
        <EditorLayout title="System & Widget" icon={Database} description="Backend tools and Creator Widget config." helpText="Advanced settings." onSave={()=>updateContent('creatorWidget', local)}>
            <div className="space-y-8">
                {/* System Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Database Engine</h4>
                        <p className="text-2xl font-black text-white">{dbType.toUpperCase()}</p>
                    </div>
                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Total Jobs</h4>
                        <p className="text-2xl font-black text-pestGreen">{content.jobCards.length}</p>
                    </div>
                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Total Employees</h4>
                        <p className="text-2xl font-black text-blue-400">{content.employees.length}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><HardDrive size={18}/> Data Management</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={downloadBackup} className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-3 rounded-lg font-bold transition-all border border-blue-500/30 flex items-center justify-center gap-2">
                                <Download size={16}/> Backup
                            </button>
                            <label className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-4 py-3 rounded-lg font-bold transition-all border border-green-500/30 flex items-center justify-center gap-2 cursor-pointer">
                                <Upload size={16}/> Restore
                                <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) restoreBackup(e.target.files[0]); }} />
                            </label>
                        </div>
                        <div className="pt-4 border-t border-white/10 space-y-2">
                             <button onClick={()=>{if(confirm('Reset to defaults?')) resetSystem()}} className="w-full bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white px-4 py-2 rounded-lg font-bold transition-all border border-yellow-500/30 flex items-center justify-center gap-2">
                                <RotateCcw size={16}/> Reset to Seed Data
                            </button>
                             <button onClick={()=>{if(confirm('NUKE ALL DATA?')) clearSystem()}} className="w-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition-all border border-red-500/30 flex items-center justify-center gap-2">
                                <AlertTriangle size={16}/> Nuke System (Clear All)
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#161817] p-6 rounded-xl border border-white/5 space-y-4">
                         <h3 className="text-white font-bold flex items-center gap-2"><Code2 size={18}/> Creator Widget</h3>
                         <Input label="Slogan" value={local.slogan} onChange={(v:string)=>setLocal({...local, slogan: v})}/>
                         <Input label="CTA Text" value={local.ctaText} onChange={(v:string)=>setLocal({...local, ctaText: v})}/>
                         <FileUpload label="Logo" value={local.logo} onChange={(v:string)=>setLocal({...local, logo: v})}/>
                         <FileUpload label="Background" value={local.background} onChange={(v:string)=>setLocal({...local, background: v})}/>
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
};

// --- BOOKINGS VIEWER ---

const BookingsViewer = () => {
    const { content, updateBooking, addJobCard, addBooking } = useContent();
    const bookings = content.bookings;
    
    const handleConvertToJob = (booking: Booking, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Create a Job Card from this booking?")) return;
        
        const newJob: JobCard = {
            id: `job-${Date.now()}`,
            refNumber: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            bookingId: booking.id,
            clientName: booking.clientName,
            clientAddressDetails: { street: booking.clientAddress, suburb: '', city: 'Nelspruit', province: 'MP', postalCode: '' },
            contactNumber: booking.clientPhone,
            contactNumberAlt: '',
            email: booking.clientEmail,
            propertyType: 'Residential',
            assessmentDate: new Date().toISOString(),
            technicianId: '',
            selectedServices: [booking.serviceId],
            checkpoints: [],
            isFirstTimeService: true,
            treatmentRecommendation: '',
            quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' },
            status: 'Assessment',
            history: [{ date: new Date().toISOString(), action: 'Created from Booking', user: 'System' }]
        };
        addJobCard(newJob);
        updateBooking(booking.id, { status: 'Converted' });
    };

    const archiveBooking = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm("Archive this booking?")) updateBooking(id, { status: 'Archived' });
    };

    const handleCreateManualBooking = () => {
        const name = prompt("Client Name:");
        if(!name) return;
        const phone = prompt("Client Phone:");
        if(!phone) return;
        
        const newBooking: Booking = {
             id: Date.now().toString(),
             serviceId: 'manual', serviceName: 'Manual Phone Booking',
             date: new Date().toISOString().split('T')[0], 
             time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
             clientName: name, clientPhone: phone || '', clientEmail: '', clientAddress: '',
             submittedAt: new Date().toISOString(), status: 'New'
        };
        addBooking(newBooking);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <SectionHeader 
                title="Bookings & Inquiries" 
                icon={Inbox} 
                description="Manage bookings submitted from the website home page or add manual entries." 
                action={
                    <button onClick={handleCreateManualBooking} className="bg-pestGreen text-white hover:bg-white hover:text-pestGreen px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all border border-white/5">
                        <PlusCircle size={16}/> Manual Booking
                    </button>
                }
             />
             
             <div className="grid grid-cols-1 gap-4">
                 {bookings.length === 0 && <p className="text-gray-500 text-center py-10">No bookings yet.</p>}
                 {bookings.map((b) => (
                     <div key={b.id} className={`bg-[#161817] p-6 rounded-2xl border ${b.status === 'New' ? 'border-pestGreen' : 'border-white/5'} flex flex-col md:flex-row justify-between gap-4 shadow-lg hover:border-pestGreen/50 transition-colors`}>
                         <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                 <h3 className="text-white font-bold text-lg">{b.serviceName}</h3>
                                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${b.status === 'New' ? 'bg-pestGreen text-white' : 'bg-white/10 text-gray-400'}`}>{b.status}</span>
                             </div>
                             <div className="text-gray-300 text-sm space-y-1">
                                 <p className="flex items-center gap-2"><User size={14} className="text-pestGreen"/> {b.clientName}</p>
                                 <p className="flex items-center gap-2"><Phone size={14} className="text-pestGreen"/> {b.clientPhone}</p>
                                 <p className="flex items-center gap-2"><Calendar size={14} className="text-pestGreen"/> {b.date} at {b.time}</p>
                             </div>
                         </div>
                         <div className="flex flex-col gap-3 justify-center min-w-[160px]">
                             {b.status !== 'Converted' && b.status !== 'Archived' && (
                                 <button type="button" onClick={(e) => handleConvertToJob(b, e)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 w-full justify-center shadow-md transition-transform hover:scale-105">
                                     <Briefcase size={16}/> Convert to Job
                                 </button>
                             )}
                             {b.status !== 'Archived' && (
                                 <button type="button" onClick={(e) => archiveBooking(b.id, e)} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-xl font-bold text-sm w-full justify-center border border-white/5 transition-colors">
                                     Archive
                                 </button>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
    const [activeMainTab, setActiveMainTab] = useState<AdminMainTab>('work');
    const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('jobs');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const { content, addJobCard } = useContent();

    // Render Job Manager if job selected
    if (selectedJobId) {
        return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
    }

    const handleCreateJob = () => {
        const newJob: JobCard = {
            id: `job-${Date.now()}`,
            refNumber: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            clientName: 'New Client',
            clientAddressDetails: { street: '', suburb: '', city: 'Nelspruit', province: 'MP', postalCode: '' },
            contactNumber: '',
            email: '',
            propertyType: 'Residential',
            assessmentDate: new Date().toISOString(),
            technicianId: '',
            selectedServices: [],
            checkpoints: [],
            isFirstTimeService: true,
            treatmentRecommendation: '',
            quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' },
            status: 'Assessment',
            history: [{ date: new Date().toISOString(), action: 'Job Created Manually', user: loggedInUser?.fullName || 'Admin' }]
        };
        addJobCard(newJob);
        setSelectedJobId(newJob.id);
    };

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
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('inquiries'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'inquiries' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Inbox size={16}/> Bookings</button>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('faqs'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'faqs' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><HelpCircle size={16}/> FAQs</button>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Content</div>
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('hero'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'hero' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Layout size={16}/> Hero</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('servicesList'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'servicesList' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Briefcase size={16}/> Services</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('serviceAreaMap'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'serviceAreaMap' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Map size={16}/> Service Area</button>
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('about'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'about' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Info size={16}/> About</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('process'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'process' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Workflow size={16}/> Process</button>
                    <button onClick={() => { setActiveMainTab('homeLayout'); setActiveSubTab('whyChooseUs'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'whyChooseUs' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><ThumbsUp size={16}/> Why Us</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('safety'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'safety' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Shield size={16}/> Safety</button>
                    <button onClick={() => { setActiveMainTab('servicesArea'); setActiveSubTab('contactPage'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'contactPage' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><PhoneCall size={16}/> Contact & CTA</button>
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Settings</div>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('companyDetails'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'companyDetails' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Building2 size={16}/> Company</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('locations'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'locations' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><MapPin size={16}/> Locations</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('employeeDirectory'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'employeeDirectory' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Users size={16}/> Employees</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('bookingSettings'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'bookingSettings' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><MousePointerClick size={16}/> Booking Flow</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('seo'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'seo' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Search size={16}/> SEO</button>
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
            case 'jobs': return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Clipboard/> Job Cards</h2>
                        <button 
                            onClick={handleCreateJob}
                            className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-pestGreen transition-colors shadow-lg"
                        >
                            <PlusCircle size={20}/> New Job
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.jobCards.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No jobs found. Create one to get started.</p>}
                        {content.jobCards.map(job => (
                            <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="bg-[#161817] p-5 rounded-xl border border-white/5 cursor-pointer hover:border-pestGreen transition-all hover:scale-[1.01] shadow-lg group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-white group-hover:text-pestGreen transition-colors">{job.refNumber}</div>
                                    <div className={`text-xs px-2 py-1 rounded text-white font-bold uppercase tracking-wider
                                        ${job.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                                          job.status === 'Assessment' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-300'}`}>
                                        {job.status.replace(/_/g, ' ')}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-300 font-medium mb-1">{job.clientName}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {job.clientAddressDetails.suburb || 'Unknown Location'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'inquiries': return <BookingsViewer />;
            case 'faqs': return <FaqEditor />;
            case 'hero': return <HeroEditor />;
            case 'about': return <AboutEditor />;
            case 'whyChooseUs': return <WhyChooseUsEditor />;
            case 'process': return <ProcessEditor />;
            case 'servicesList': return <ServicesEditor />;
            case 'safety': return <SafetyEditor />;
            case 'serviceAreaMap': return <ServiceAreaEditor />;
            case 'contactPage': return <ContactEditor />;
            case 'companyDetails': return <CompanyEditor />;
            case 'locations': return <LocationsEditor />;
            case 'bookingSettings': return <BookingModalEditor />;
            case 'seo': return <SeoEditor />;
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
