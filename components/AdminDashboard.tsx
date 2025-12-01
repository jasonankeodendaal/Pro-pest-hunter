
import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { 
    Save, Image as ImageIcon, X, Plus, Trash2, LogOut, CheckCircle, 
    Layout, Info, Briefcase, Star, List, MapPin, Shield, Megaphone, 
    Phone, Settings, Globe, Clock, Eye, EyeOff, MoveUp, MoveDown,
    BarChart3, Users, Calendar, AlertCircle, Search, ChevronRight, Video, Youtube, Image,
    User, HardHat, Mail, PhoneCall, Cake, Lock, FileText, Stethoscope, Heart, Clipboard, PlusCircle, Building2,
    MessageSquare, HelpCircle, MousePointerClick, FilePlus, PenTool, DollarSign, Download, Camera, ScanLine, Hash,
    Printer, CheckSquare, FileCheck, ArrowRightCircle, Send, ToggleLeft, ToggleRight,
    CreditCard, Bug, QrCode, FileStack, Edit, BookOpen, Workflow, Server, Cloud, Link, Circle, Code2, Terminal, Copy, Palette, Upload, Zap, Database, RotateCcw, Wifi, GitBranch, Globe2, Inbox, Activity, AlertTriangle, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Employee, AdminMainTab, AdminSubTab, JobCard, ServiceItem, ProcessStep, FAQItem, TestimonialItem } from '../types';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';
import { JobCardManager } from './JobCardManager';

// --- HELPER COMPONENTS ---

const InfoBlock = ({ title, text }: { title: string; text: string }) => (
  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm">
      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0 mt-0.5">
        <Info size={20} />
      </div>
      <div>
        <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
            {title}
        </h4>
        <p className="text-blue-100/80 text-xs leading-relaxed font-medium tracking-wide">
            {text}
        </p>
      </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon, action }: { title: string; icon: any; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-pestGreen/10 rounded-lg text-pestGreen">
                <Icon size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
        </div>
        {action}
    </div>
);

// --- EDITORS ---

const CompanyEditor = () => {
    const { content, updateContent } = useContent();
    const c = content.company;
    const update = (data: any) => updateContent('company', data);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Company Information" icon={Building2} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Core Details</h3>
                    <Input label="Company Name" value={c.name} onChange={(v: string) => update({ name: v })} />
                    <Input label="Registration Number" value={c.regNumber} onChange={(v: string) => update({ regNumber: v })} />
                    <Input label="VAT Number" value={c.vatNumber} onChange={(v: string) => update({ vatNumber: v })} />
                    <Input label="Experience (Years)" type="number" value={c.yearsExperience} onChange={(v: string) => update({ yearsExperience: parseInt(v) })} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Contact Info</h3>
                    <Input label="Phone Number" value={c.phone} onChange={(v: string) => update({ phone: v })} />
                    <Input label="Email Address" value={c.email} onChange={(v: string) => update({ email: v })} />
                    <TextArea label="Physical Address" value={c.address} onChange={(v: string) => update({ address: v })} rows={3} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Operating Hours</h3>
                    <Input label="Weekdays" value={c.hours.weekdays} onChange={(v: string) => update({ hours: { ...c.hours, weekdays: v } })} />
                    <Input label="Saturday" value={c.hours.saturday} onChange={(v: string) => update({ hours: { ...c.hours, saturday: v } })} />
                    <Input label="Sunday" value={c.hours.sunday} onChange={(v: string) => update({ hours: { ...c.hours, sunday: v } })} />
                </div>

                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Social Media & Branding</h3>
                    <Input label="Facebook URL" value={c.socials.facebook} onChange={(v: string) => update({ socials: { ...c.socials, facebook: v } })} />
                    <Input label="Instagram URL" value={c.socials.instagram} onChange={(v: string) => update({ socials: { ...c.socials, instagram: v } })} />
                    <Input label="LinkedIn URL" value={c.socials.linkedin} onChange={(v: string) => update({ socials: { ...c.socials, linkedin: v } })} />
                    <div className="mt-4">
                        <FileUpload label="Company Logo" value={c.logo} onChange={(v: string) => update({ logo: v })} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const HeroEditor = () => {
    const { content, updateContent } = useContent();
    const h = content.hero;
    const update = (data: any) => updateContent('hero', data);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Hero Section" icon={Layout} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Main Text</h3>
                    <TextArea label="Headline" value={h.headline} onChange={(v: string) => update({ headline: v })} rows={2} />
                    <TextArea label="Subheadline" value={h.subheadline} onChange={(v: string) => update({ subheadline: v })} rows={2} />
                    <Input label="Button Text" value={h.buttonText} onChange={(v: string) => update({ buttonText: v })} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Visual Media</h3>
                    <div className="space-y-4">
                        <FileUpload label="Background Image" value={h.bgImage} onChange={(v: string) => update({ bgImage: v })} />
                        <Input label="Video URL (MP4)" value={h.mediaVideo} onChange={(v: string) => update({ mediaVideo: v })} placeholder="https://..." />
                        <Input label="Overlay Opacity (%)" type="number" value={h.overlayOpacity} onChange={(v: string) => update({ overlayOpacity: parseInt(v) })} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AboutEditor = () => {
    const { content, updateContent } = useContent();
    const a = content.about;
    const update = (data: any) => updateContent('about', data);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="About Us Section" icon={Info} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Main Story</h3>
                    <Input label="Title" value={a.title} onChange={(v: string) => update({ title: v })} />
                    <TextArea label="Main Text" value={a.text} onChange={(v: string) => update({ text: v })} rows={6} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Mission & Visuals</h3>
                    <Input label="Mission Title" value={a.missionTitle} onChange={(v: string) => update({ missionTitle: v })} />
                    <TextArea label="Mission Text" value={a.missionText} onChange={(v: string) => update({ missionText: v })} rows={3} />
                    <div className="mt-4">
                        <FileUpload label="Owner / Team Image" value={a.ownerImage} onChange={(v: string) => update({ ownerImage: v })} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesEditor = () => {
    const { content, updateService } = useContent();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempService, setTempService] = useState<ServiceItem | null>(null);

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

    const handleSave = () => {
        if (!tempService) return;
        const exists = content.services.find(s => s.id === tempService.id);
        let updatedList;
        if (exists) {
            updatedList = content.services.map(s => s.id === tempService.id ? tempService : s);
        } else {
            updatedList = [...content.services, tempService];
        }
        updateService(updatedList);
        setEditingId(null);
        setTempService(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            updateService(content.services.filter(s => s.id !== id));
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

    if (editingId && tempService) {
        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Edit Service</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white/10 text-white rounded-lg">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-pestGreen text-white rounded-lg font-bold flex items-center gap-2"><Save size={16}/> Save Changes</button>
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
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader 
                title="Manage Services" 
                icon={Zap} 
                action={<button onClick={handleNew} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Service</button>}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.services.map(service => (
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
        </div>
    );
};

const ProcessEditor = () => {
    const { content, updateProcessSteps, updateContent } = useContent();
    const p = content.process;

    const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
        const newSteps = [...p.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        updateProcessSteps(newSteps);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Process Section" icon={Workflow} />
            
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 mb-8">
                <h3 className="text-white font-bold mb-4">Section Headings</h3>
                <Input label="Title" value={p.title} onChange={(v: string) => updateContent('process', { ...p, title: v })} />
                <TextArea label="Subtitle" value={p.subtitle} onChange={(v: string) => updateContent('process', { ...p, subtitle: v })} rows={2} />
            </div>

            <div className="space-y-4">
                <h3 className="text-white font-bold px-1">Steps</h3>
                {p.steps.map((step, idx) => (
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
        </div>
    );
};

const ServiceAreaEditor = () => {
    const { content, updateContent } = useContent();
    const sa = content.serviceArea;
    const update = (data: any) => updateContent('serviceArea', data);

    const handleTownsChange = (v: string) => {
        const towns = v.split(',').map(t => t.trim()).filter(t => t);
        update({ towns });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Service Area" icon={MapPin} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <Input label="Title" value={sa.title} onChange={(v: string) => update({ title: v })} />
                    <TextArea label="Description" value={sa.description} onChange={(v: string) => update({ description: v })} rows={4} />
                    <TextArea label="Towns (Comma Separated)" value={sa.towns.join(', ')} onChange={handleTownsChange} rows={3} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Map Visual</h3>
                    <FileUpload label="Area Map Image" value={sa.mapImage} onChange={(v: string) => update({ mapImage: v })} />
                </div>
            </div>
        </div>
    );
};

const SafetyEditor = () => {
    const { content, updateContent } = useContent();
    const s = content.safety;
    const update = (data: any) => updateContent('safety', data);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Safety & Certification" icon={Shield} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Safety Promise</h3>
                    <Input label="Title" value={s.title} onChange={(v: string) => update({ title: v })} />
                    <TextArea label="Description" value={s.description} onChange={(v: string) => update({ description: v })} rows={4} />
                </div>
                
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Badges & Certs</h3>
                    <Input label="Badge 1 Text" value={s.badge1} onChange={(v: string) => update({ badge1: v })} />
                    <Input label="Badge 2 Text" value={s.badge2} onChange={(v: string) => update({ badge2: v })} />
                    <Input label="Badge 3 Text" value={s.badge3} onChange={(v: string) => update({ badge3: v })} />
                    <div className="mt-4">
                        <FileUpload label="Certificates (Images)" value={s.certificates} onChange={(v: string[]) => update({ certificates: v })} multiple={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FaqEditor = () => {
    const { content, updateFaqs } = useContent();
    const faqs = content.faqs;

    const handleUpdate = (index: number, field: keyof FAQItem, value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        updateFaqs(newFaqs);
    };

    const handleAdd = () => {
        const newFaq: FAQItem = { id: `faq-${Date.now()}`, question: 'New Question?', answer: 'Answer here.' };
        updateFaqs([...faqs, newFaq]);
    };

    const handleDelete = (index: number) => {
        updateFaqs(faqs.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader 
                title="Frequently Asked Questions" 
                icon={HelpCircle} 
                action={<button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add FAQ</button>}
            />
            
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={faq.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative group">
                        <button onClick={() => handleDelete(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        <Input label="Question" value={faq.question} onChange={(v: string) => handleUpdate(idx, 'question', v)} className="mb-4 font-bold" />
                        <TextArea label="Answer" value={faq.answer} onChange={(v: string) => handleUpdate(idx, 'answer', v)} rows={2} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const TestimonialsEditor = () => {
    const { content, updateContent } = useContent();
    const tests = content.testimonials;

    const handleUpdate = (index: number, field: keyof TestimonialItem, value: any) => {
        const newTests = [...tests];
        newTests[index] = { ...newTests[index], [field]: value };
        updateContent('testimonials', newTests);
    };

    const handleAdd = () => {
        const newTest: TestimonialItem = { id: `test-${Date.now()}`, name: 'New Client', location: 'City', text: 'Great service!', rating: 5 };
        updateContent('testimonials', [...tests, newTest]);
    };

    const handleDelete = (index: number) => {
        updateContent('testimonials', tests.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <SectionHeader 
                title="Client Testimonials" 
                icon={Star} 
                action={<button onClick={handleAdd} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={16}/> Add Review</button>}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map((t, idx) => (
                    <div key={t.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 relative group">
                        <button onClick={() => handleDelete(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        <div className="flex gap-4 mb-4">
                            <Input label="Name" value={t.name} onChange={(v: string) => handleUpdate(idx, 'name', v)} />
                            <Input label="Location" value={t.location} onChange={(v: string) => handleUpdate(idx, 'location', v)} />
                        </div>
                        <TextArea label="Review Text" value={t.text} onChange={(v: string) => handleUpdate(idx, 'text', v)} rows={3} />
                        <div className="mt-4">
                            <label className="text-xs font-bold text-gray-500 uppercase">Rating (1-5)</label>
                            <input type="number" min="1" max="5" value={t.rating} onChange={(e) => handleUpdate(idx, 'rating', parseInt(e.target.value))} className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-white mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SeoEditor = () => {
    const { content, updateContent } = useContent();
    const seo = content.seo;
    const update = (data: any) => updateContent('seo', data);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="SEO Settings" icon={Search} />
            
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                <Input label="Meta Title" value={seo.metaTitle} onChange={(v: string) => update({ metaTitle: v })} />
                <TextArea label="Meta Description" value={seo.metaDescription} onChange={(v: string) => update({ metaDescription: v })} rows={3} />
                <TextArea label="Keywords" value={seo.keywords} onChange={(v: string) => update({ keywords: v })} rows={2} />
                <div className="pt-4 border-t border-white/5">
                    <FileUpload label="Social Share Image (OG Image)" value={seo.ogImage} onChange={(v: string) => update({ ogImage: v })} />
                </div>
                <Input label="Structured Data (JSON-LD)" value={seo.structuredDataJSON} onChange={(v: string) => update({ structuredDataJSON: v })} />
            </div>
        </div>
    );
};

const CreatorWidgetEditor = () => {
    const { content, updateContent } = useContent();
    const w = content.creatorWidget;
    const update = (data: any) => updateContent('creatorWidget', data);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Creator Widget Settings" icon={Code2} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Text Content</h3>
                    <Input label="Slogan" value={w.slogan} onChange={(v: string) => update({ slogan: v })} />
                    <TextArea label="CTA Text" value={w.ctaText} onChange={(v: string) => update({ ctaText: v })} rows={3} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Images</h3>
                    <FileUpload label="Logo" value={w.logo} onChange={(v: string) => update({ logo: v })} />
                    <FileUpload label="Background" value={w.background} onChange={(v: string) => update({ background: v })} />
                </div>
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 md:col-span-2">
                    <h3 className="text-white font-bold mb-4">Contact Icons</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FileUpload label="WhatsApp Icon" value={w.whatsappIcon} onChange={(v: string) => update({ whatsappIcon: v })} />
                        <FileUpload label="Email Icon" value={w.emailIcon} onChange={(v: string) => update({ emailIcon: v })} />
                    </div>
                </div>
            </div>
        </div>
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
            <div className="space-y-6 animate-in fade-in">
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
        <div className="space-y-6 animate-in fade-in">
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

const InquiriesViewer = () => {
    const { content } = useContent();
    const bookings = content.bookings;

    return (
        <div className="space-y-6 animate-in fade-in">
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
                        {bookings.length > 0 ? bookings.map((b) => (
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
    );
};

// --- SYSTEM GUIDES (DEPLOYMENT & STATUS) ---

const DeploymentGuide = () => {
    const { apiUrl, setApiUrl } = useContent();
    const [tempUrl, setTempUrl] = useState(apiUrl);

    return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
         <div className="bg-[#161817] border border-pestGreen/30 rounded-2xl p-8 relative overflow-hidden">
             {/* Header */}
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-pestGreen/10 rounded-full blur-3xl"></div>
             <div className="flex items-center gap-4 mb-8 relative z-10">
                 <div className="w-20 h-20 bg-pestGreen rounded-2xl flex items-center justify-center shadow-neon shrink-0">
                     <Code2 size={40} className="text-white" />
                 </div>
                 <div>
                     <h2 className="text-4xl font-black text-white leading-tight">Zero-to-Hero Masterclass</h2>
                     <p className="text-gray-400 text-lg">The 100% Free, Full Stack Deployment Guide (GitHub + Supabase + Render + Vercel).</p>
                 </div>
             </div>
             
             {/* LIVE CONNECTION TOOL */}
             <div className="bg-gray-900 border border-pestGreen p-6 rounded-2xl mb-12 relative z-20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pestGreen/20 rounded-lg text-pestGreen animate-pulse">
                        <Wifi size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Live API Connection</h3>
                        <p className="text-gray-400 text-xs">Enter your deployed server URL (Phase 3) here to connect the dashboard.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <input 
                            type="text" 
                            value={tempUrl} 
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pestGreen outline-none font-mono text-sm"
                            placeholder="https://pest-backend.onrender.com" 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${apiUrl.includes('localhost') ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                             <span className="text-[10px] uppercase font-bold text-gray-500">{apiUrl.includes('localhost') ? 'Localhost' : 'Live Remote'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setApiUrl(tempUrl)} 
                        className="w-full md:w-auto bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Server size={18} /> Connect & Reload
                    </button>
                </div>
             </div>
             
             {/* Phases Content - Simplified for brevity in this update, keeping layout */}
             <div className="space-y-12 relative z-10">
                <InfoBlock title="Phase 1: GitHub" text="Create a repo named 'pest-control-app' and upload all project files. This is your source of truth." />
                <InfoBlock title="Phase 2: Supabase" text="Create a free PostgreSQL database. Get the connection string from Settings -> Database. Use connection pooling (Transaction mode)." />
                <InfoBlock title="Phase 3: Render" text="Create a Web Service connected to your GitHub repo. Set Environment Variables: DATABASE_URL (from Supabase)." />
                <InfoBlock title="Phase 4: Vercel" text="Import project from GitHub. Set VITE_API_URL to your Render backend URL (no trailing slash)." />
             </div>
         </div>
    </div>
    );
};

const SystemGuide = () => {
    const { apiUrl, resetSystem, clearSystem, downloadBackup, restoreBackup, dbType, connectionError, isConnecting, retryConnection } = useContent();
    const [confirmClear, setConfirmClear] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (window.confirm("WARNING: This will overwrite ALL current data with the backup file. Are you sure?")) {
                const success = await restoreBackup(e.target.files[0]);
                if (success) alert("System restored successfully.");
                else alert("Restore failed. Check file format.");
            }
        }
    };

    const isRenderWithSqlite = dbType === 'sqlite' && !apiUrl.includes('localhost');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
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
                                         Render deletes local files every time the server restarts (sleeps). Any content you upload will be DELETED automatically. 
                                         You MUST connect Supabase (PostgreSQL) to save data permanently.
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
  const { content } = useContent();
  const [activeMainTab, setActiveMainTab] = useState<AdminMainTab>('siteContent');
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('systemGuide');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // If a job is selected, show the JobManager overlay instead of dashboard
  if (selectedJobId) {
      return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
  }

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
                        <h2 className="text-white font-black text-lg leading-none">Admin</h2>
                        <span className="text-pestGreen text-xs font-bold uppercase tracking-wider">Dashboard</span>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex p-2 gap-1 border-b border-white/5">
                <button onClick={() => { setActiveMainTab('siteContent'); setActiveSubTab('systemGuide'); }} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'siteContent' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Globe size={18} /> Site
                </button>
                <button onClick={() => { setActiveMainTab('bookings'); setActiveSubTab('jobs'); }} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'bookings' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Briefcase size={18} /> Work
                </button>
                <button onClick={() => { setActiveMainTab('employees'); setActiveSubTab('employeeDirectory'); }} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'employees' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Users size={18} /> Team
                </button>
            </div>

            {/* Sub Tabs Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 mt-2 px-2">Menu</div>
                
                {/* Site Content Subtabs */}
                <SidebarItem id="systemGuide" label="System Status" icon={Activity} mainTab="siteContent" />
                <SidebarItem id="deploymentGuide" label="Deployment Guide" icon={Cloud} mainTab="siteContent" />
                <div className="my-2 border-t border-white/5"></div>
                <SidebarItem id="company" label="Company Info" icon={Building2} mainTab="siteContent" />
                <SidebarItem id="hero" label="Hero Section" icon={Layout} mainTab="siteContent" />
                <SidebarItem id="about" label="About Us" icon={Info} mainTab="siteContent" />
                <SidebarItem id="services" label="Services" icon={Zap} mainTab="siteContent" />
                <SidebarItem id="process" label="Process" icon={Workflow} mainTab="siteContent" />
                <SidebarItem id="serviceArea" label="Service Area" icon={MapPin} mainTab="siteContent" />
                <SidebarItem id="safety" label="Safety & badges" icon={Shield} mainTab="siteContent" />
                <SidebarItem id="faq" label="FAQs" icon={HelpCircle} mainTab="siteContent" />
                <SidebarItem id="testimonials" label="Testimonials" icon={Star} mainTab="siteContent" />
                <SidebarItem id="seo" label="SEO Settings" icon={Search} mainTab="siteContent" />
                <SidebarItem id="creatorSettings" label="Creator Widget" icon={Code2} mainTab="siteContent" />

                {/* Work Subtabs */}
                <SidebarItem id="jobs" label="Job Cards" icon={Clipboard} mainTab="bookings" />
                <SidebarItem id="inquiries" label="Inquiries" icon={Inbox} mainTab="bookings" />

                {/* Team Subtabs */}
                <SidebarItem id="employeeDirectory" label="Staff Directory" icon={Users} mainTab="employees" />
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0f1110]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pestGreen/20 flex items-center justify-center border border-pestGreen/50 text-pestGreen font-bold">
                        {loggedInUser?.fullName.charAt(0) || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-white font-bold text-sm truncate">{loggedInUser?.fullName || 'Admin'}</h4>
                        <p className="text-gray-500 text-xs truncate">{loggedInUser?.email || 'System Owner'}</p>
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
                {/* Dynamic Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeSubTab === 'systemGuide' && <SystemGuide />}
                    {activeSubTab === 'deploymentGuide' && <DeploymentGuide />}
                    
                    {activeSubTab === 'company' && <CompanyEditor />}
                    {activeSubTab === 'hero' && <HeroEditor />}
                    {activeSubTab === 'about' && <AboutEditor />}
                    {activeSubTab === 'services' && <ServicesEditor />}
                    {activeSubTab === 'process' && <ProcessEditor />}
                    {activeSubTab === 'serviceArea' && <ServiceAreaEditor />}
                    {activeSubTab === 'safety' && <SafetyEditor />}
                    {activeSubTab === 'faq' && <FaqEditor />}
                    {activeSubTab === 'testimonials' && <TestimonialsEditor />}
                    {activeSubTab === 'seo' && <SeoEditor />}
                    {activeSubTab === 'creatorSettings' && <CreatorWidgetEditor />}
                    
                    {activeSubTab === 'employeeDirectory' && <EmployeeEditor />}
                    {activeSubTab === 'inquiries' && <InquiriesViewer />}
                    
                    {/* Job Management */}
                    {activeSubTab === 'jobs' && (
                        <div className="space-y-6">
                            <SectionHeader title="Active Job Cards" icon={Clipboard} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.jobCards.map(job => (
                                    <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="bg-[#161817] border border-white/5 hover:border-pestGreen/50 p-6 rounded-2xl cursor-pointer group transition-all">
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
                                <button 
                                    onClick={() => {
                                        alert("To create a new job, please use the Booking system or this feature will be fully implemented in the next update.");
                                    }} 
                                    className="bg-white/5 border border-dashed border-white/10 hover:border-pestGreen hover:bg-pestGreen/5 rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[200px] transition-all"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                                        <Plus size={24} />
                                    </div>
                                    <span className="font-bold text-white">Create New Job Card</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};
