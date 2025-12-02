
import React, { useState, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { JobCardManager } from './JobCardManager';
import { Input, TextArea, Select, FileUpload, IconPicker } from './ui/AdminShared';
import { HelpButton } from './ui/HelpSystem';
import { Employee, ClientUser, JobCard, Booking, AdminMainTab, AdminSubTab, AdminDashboardProps, FAQItem, AboutItem, ServiceItem, WhyChooseUsItem, ProcessStep, Location, InventoryItem } from '../types';
import { 
  Clipboard, Inbox, Users, HelpCircle, Layout, Briefcase, Map, Info, Workflow, ThumbsUp, Shield, PhoneCall, Building2, MapPin, MousePointerClick, Search, Database, LogOut, PlusCircle, 
  ChevronRight, Mail, Phone, Edit, Lock, Plus, CheckCircle, Video, Camera, Save, X, Trash2, ArrowRight, Download, Upload, Zap, User, FileText, Globe, Key, AlertTriangle, Monitor, RotateCcw,
  Calendar, Package
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const SectionHeader = ({ title, description, icon: Icon, helpTopic }: any) => (
  <div className="mb-8 border-b border-white/10 pb-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-pestGreen rounded-lg text-white">
        {Icon && <Icon size={24} />}
      </div>
      <h2 className="text-3xl font-black text-white">{title}</h2>
      {helpTopic && <HelpButton topic={helpTopic} className="ml-4" />}
    </div>
    <p className="text-gray-400 max-w-2xl">{description}</p>
  </div>
);

// --- EDITORS ---

const HeroEditor = () => {
    const { content, updateContent } = useContent();
    const { hero } = content;
    const handleChange = (key: string, val: any) => updateContent('hero', { [key]: val });

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Hero Section" description="The first thing visitors see. Make it count." icon={Layout} helpTopic="editors" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Headline" value={hero.headline} onChange={(v: string) => handleChange('headline', v)} />
                <Input label="Subheadline" value={hero.subheadline} onChange={(v: string) => handleChange('subheadline', v)} />
                <Input label="CTA Button Text" value={hero.buttonText} onChange={(v: string) => handleChange('buttonText', v)} />
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Background Video (URL)</label>
                   <FileUpload label="Upload MP4 Video" value={hero.mediaVideo} onChange={(v: string) => handleChange('mediaVideo', v)} accept="video/mp4,video/webm,video/ogg" />
                </div>
            </div>
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5">
                <FileUpload label="Background Image (Fallback)" value={hero.bgImage} onChange={(v: string) => handleChange('bgImage', v)} />
            </div>
        </div>
    );
};

const AboutEditor = () => {
    const { content, updateContent, updateAboutItems } = useContent();
    const { about } = content;
    const update = (k: string, v: any) => updateContent('about', { [k]: v });

    return (
        <div className="space-y-6 animate-in fade-in">
             <SectionHeader title="About Us" description="Tell your company story and mission." icon={Info} helpTopic="editors" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Title" value={about.title} onChange={(v: string) => update('title', v)} />
                 <TextArea label="Main Text" value={about.text} onChange={(v: string) => update('text', v)} rows={5} />
                 <div className="col-span-full bg-[#161817] p-6 rounded-2xl border border-white/5">
                     <h3 className="text-white font-bold mb-4">Mission Statement</h3>
                     <Input label="Mission Title" value={about.missionTitle} onChange={(v: string) => update('missionTitle', v)} />
                     <TextArea label="Mission Text" value={about.missionText} onChange={(v: string) => update('missionText', v)} rows={2} className="mt-2" />
                 </div>
                 <div className="col-span-full">
                     <FileUpload label="Owner / Team Image" value={about.ownerImage} onChange={(v: string) => update('ownerImage', v)} />
                 </div>
             </div>

             <div className="mt-8">
                 <h3 className="text-xl font-bold text-white mb-4">Highlights</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {about.items.map((item, idx) => (
                         <div key={idx} className="bg-[#161817] p-4 rounded-xl border border-white/5 space-y-3">
                             <Input label="Title" value={item.title} onChange={(v: string) => { const n = [...about.items]; n[idx].title = v; updateAboutItems(n); }} />
                             <TextArea label="Description" value={item.description} onChange={(v: string) => { const n = [...about.items]; n[idx].description = v; updateAboutItems(n); }} rows={2} />
                             <IconPicker label="Icon" value={item.iconName} onChange={(v: string) => { const n = [...about.items]; n[idx].iconName = v; updateAboutItems(n); }} />
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    );
};

const ServicesEditor = () => {
    const { content, updateService } = useContent();
    const { services } = content;

    const toggleVisibility = (id: string) => {
        const updated = services.map(s => s.id === id ? { ...s, visible: !s.visible } : s);
        updateService(updated);
    };

    const toggleFeatured = (id: string) => {
        const updated = services.map(s => s.id === id ? { ...s, featured: !s.featured } : s);
        updateService(updated);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <SectionHeader title="Services" description="Manage your service offerings." icon={Briefcase} helpTopic="editors" />
             <div className="grid grid-cols-1 gap-6">
                 {services.map((service, idx) => (
                     <div key={service.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6">
                         <div className="flex-1 space-y-4">
                             <div className="flex justify-between items-center">
                                 <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                 <div className="flex gap-2">
                                     <button onClick={() => toggleFeatured(service.id)} className={`px-3 py-1 rounded text-xs font-bold ${service.featured ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-500'}`}>Featured</button>
                                     <button onClick={() => toggleVisibility(service.id)} className={`px-3 py-1 rounded text-xs font-bold ${service.visible ? 'bg-pestGreen text-white' : 'bg-red-500/20 text-red-500'}`}>{service.visible ? 'Visible' : 'Hidden'}</button>
                                 </div>
                             </div>
                             <Input label="Service Title" value={service.title} onChange={(v: string) => { const n = [...services]; n[idx].title = v; updateService(n); }} />
                             <TextArea label="Short Description" value={service.description} onChange={(v: string) => { const n = [...services]; n[idx].description = v; updateService(n); }} rows={2} />
                             <TextArea label="Full Details" value={service.fullDescription} onChange={(v: string) => { const n = [...services]; n[idx].fullDescription = v; updateService(n); }} rows={4} />
                             <Input label="Price Range" value={service.price || ''} onChange={(v: string) => { const n = [...services]; n[idx].price = v; updateService(n); }} />
                         </div>
                         <div className="w-full md:w-64 space-y-4 flex-shrink-0">
                             <IconPicker label="Icon" value={service.iconName} onChange={(v: string) => { const n = [...services]; n[idx].iconName = v; updateService(n); }} />
                             <FileUpload label="Service Image" value={service.image} onChange={(v: string) => { const n = [...services]; n[idx].image = v; updateService(n); }} />
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const FaqEditor = () => {
    const { content, updateFaqs } = useContent();
    
    const addFaq = () => {
        updateFaqs([...content.faqs, { id: Date.now().toString(), question: 'New Question?', answer: 'Answer here.' }]);
    };
    
    const removeFaq = (id: string) => {
        updateFaqs(content.faqs.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="FAQ Management" description="Answer common customer questions." icon={HelpCircle} helpTopic="editors" />
            <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                    <div key={faq.id} className="bg-[#161817] p-4 rounded-xl border border-white/5 relative">
                        <button onClick={() => removeFaq(faq.id)} className="absolute top-2 right-2 text-red-500 hover:text-white"><X size={16}/></button>
                        <Input label="Question" value={faq.question} onChange={(v: string) => { const n = [...content.faqs]; n[idx].question = v; updateFaqs(n); }} className="mb-2" />
                        <TextArea label="Answer" value={faq.answer} onChange={(v: string) => { const n = [...content.faqs]; n[idx].answer = v; updateFaqs(n); }} rows={2} />
                    </div>
                ))}
                <button onClick={addFaq} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-pestGreen hover:text-white transition-colors flex items-center justify-center gap-2 font-bold"><Plus size={16}/> Add FAQ</button>
            </div>
        </div>
    );
};

const ProcessEditor = () => {
    const { content, updateProcessSteps, updateContent } = useContent();
    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Our Process" description="Explain how you work." icon={Workflow} helpTopic="editors" />
            <div className="space-y-4 mb-8">
                 <Input label="Section Title" value={content.process.title} onChange={(v: string) => updateContent('process', { title: v })} />
                 <TextArea label="Subtitle" value={content.process.subtitle} onChange={(v: string) => updateContent('process', { subtitle: v })} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.process.steps.map((step, idx) => (
                    <div key={step.step} className="bg-[#161817] p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between font-bold text-white mb-2">Step {step.step}</div>
                        <Input label="Step Title" value={step.title} onChange={(v: string) => { const n = [...content.process.steps]; n[idx].title = v; updateProcessSteps(n); }} />
                        <TextArea label="Description" value={step.description} onChange={(v: string) => { const n = [...content.process.steps]; n[idx].description = v; updateProcessSteps(n); }} rows={2} />
                        <IconPicker label="Icon" value={step.iconName} onChange={(v: string) => { const n = [...content.process.steps]; n[idx].iconName = v; updateProcessSteps(n); }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const WhyChooseUsEditor = () => {
    const { content, updateWhyChooseUsItems, updateContent } = useContent();
    return (
         <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Why Choose Us" description="Your competitive advantage." icon={ThumbsUp} helpTopic="editors" />
            <div className="space-y-4 mb-8">
                 <Input label="Section Title" value={content.whyChooseUs.title} onChange={(v: string) => updateContent('whyChooseUs', { title: v })} />
                 <TextArea label="Subtitle" value={content.whyChooseUs.subtitle} onChange={(v: string) => updateContent('whyChooseUs', { subtitle: v })} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.whyChooseUs.items.map((item, idx) => (
                    <div key={idx} className="bg-[#161817] p-4 rounded-xl border border-white/5 space-y-3">
                        <Input label="Title" value={item.title} onChange={(v: string) => { const n = [...content.whyChooseUs.items]; n[idx].title = v; updateWhyChooseUsItems(n); }} />
                        <TextArea label="Text" value={item.text} onChange={(v: string) => { const n = [...content.whyChooseUs.items]; n[idx].text = v; updateWhyChooseUsItems(n); }} rows={2} />
                        <IconPicker label="Icon" value={item.iconName} onChange={(v: string) => { const n = [...content.whyChooseUs.items]; n[idx].iconName = v; updateWhyChooseUsItems(n); }} />
                    </div>
                ))}
            </div>
         </div>
    );
};

const SafetyEditor = () => {
    const { content, updateContent } = useContent();
    const update = (k: string, v: any) => updateContent('safety', { [k]: v });
    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Safety Standards" description="Compliance and safety messaging." icon={Shield} helpTopic="editors" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Title" value={content.safety.title} onChange={(v: string) => update('title', v)} />
                <TextArea label="Description" value={content.safety.description} onChange={(v: string) => update('description', v)} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[1, 2, 3].map(num => (
                    <div key={num} className="bg-[#161817] p-4 rounded-xl border border-white/5 space-y-2">
                        <Input label={`Badge ${num} Text`} value={(content.safety as any)[`badge${num}`]} onChange={(v: string) => update(`badge${num}`, v)} />
                        <IconPicker label="Icon" value={(content.safety as any)[`badge${num}IconName`]} onChange={(v: string) => update(`badge${num}IconName`, v)} />
                    </div>
                ))}
            </div>
             <div className="mt-6">
                <FileUpload label="Certificates / Logos" value={content.safety.certificates} onChange={(v: string[]) => update('certificates', v)} multiple={true} />
            </div>
        </div>
    );
};

const ServiceAreaEditor = () => {
    const { content, updateContent } = useContent();
    const update = (k: string, v: any) => updateContent('serviceArea', { [k]: v });
    return (
         <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Service Area" description="Where do you operate?" icon={Map} helpTopic="editors" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Title" value={content.serviceArea.title} onChange={(v: string) => update('title', v)} />
                <TextArea label="Description" value={content.serviceArea.description} onChange={(v: string) => update('description', v)} rows={3} />
                <div className="col-span-full">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Towns / Suburbs (Comma Separated)</label>
                     <TextArea value={content.serviceArea.towns.join(', ')} onChange={(v: string) => update('towns', v.split(',').map(s => s.trim()))} rows={2} />
                </div>
                <div className="col-span-full">
                     <Input label="Google Maps Embed URL (Iframe src)" value={content.serviceArea.mapEmbedUrl || ''} onChange={(v: string) => update('mapEmbedUrl', v)} placeholder="https://www.google.com/maps/embed?..." />
                     <p className="text-xs text-gray-500 mt-1">Paste the 'src' from Google Maps Share -> Embed a Map.</p>
                </div>
                <div className="col-span-full">
                     <FileUpload label="Static Map Image (Fallback)" value={content.serviceArea.mapImage} onChange={(v: string) => update('mapImage', v)} />
                </div>
            </div>
         </div>
    );
};

const ContactEditor = () => {
    const { content, updateContent } = useContent();
    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Contact Page" description="Contact info and Call-To-Action banner." icon={PhoneCall} helpTopic="editors" />
            
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 mb-6">
                <h3 className="text-white font-bold">Contact Info & Map</h3>
                <Input label="Page Title" value={content.contact.title} onChange={(v: string) => updateContent('contact', { title: v })} />
                <Input label="Subtitle" value={content.contact.subtitle} onChange={(v: string) => updateContent('contact', { subtitle: v })} />
                <Input label="Map Embed URL" value={content.contact.mapEmbedUrl || ''} onChange={(v: string) => updateContent('contact', { mapEmbedUrl: v })} />
            </div>

            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-white font-bold">Booking CTA Banner</h3>
                <Input label="CTA Title" value={content.bookCTA.title} onChange={(v: string) => updateContent('bookCTA', { title: v })} />
                <Input label="CTA Subtitle" value={content.bookCTA.subtitle} onChange={(v: string) => updateContent('bookCTA', { subtitle: v })} />
                <Input label="Button Text" value={content.bookCTA.buttonText} onChange={(v: string) => updateContent('bookCTA', { buttonText: v })} />
            </div>
        </div>
    );
};

const CompanyEditor = () => {
    const { content, updateContent } = useContent();
    const updateCo = (k: string, v: any) => updateContent('company', { [k]: v });
    const updateBank = (k: string, v: any) => updateContent('bankDetails', { [k]: v });
    
    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Company Details" description="Core business information." icon={Building2} helpTopic="editors" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Company Name" value={content.company.name} onChange={(v: string) => updateCo('name', v)} />
                <Input label="Phone" value={content.company.phone} onChange={(v: string) => updateCo('phone', v)} />
                <Input label="Email" value={content.company.email} onChange={(v: string) => updateCo('email', v)} />
                <Input label="VAT Number" value={content.company.vatNumber} onChange={(v: string) => updateCo('vatNumber', v)} />
                <Input label="Reg Number" value={content.company.regNumber} onChange={(v: string) => updateCo('regNumber', v)} />
                <Input label="Years Experience" type="number" value={content.company.yearsExperience} onChange={(v: string) => updateCo('yearsExperience', parseInt(v))} />
                <div className="col-span-full">
                    <Input label="Physical Address" value={content.company.address} onChange={(v: string) => updateCo('address', v)} />
                </div>
                <div className="col-span-full">
                     <FileUpload label="Company Logo" value={content.company.logo} onChange={(v: string) => updateCo('logo', v)} />
                </div>
            </div>

            <div className="mt-8 bg-[#161817] p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Briefcase size={18}/> Banking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input label="Bank Name" value={content.bankDetails.bankName} onChange={(v: string) => updateBank('bankName', v)} />
                     <Input label="Account Name" value={content.bankDetails.accountName} onChange={(v: string) => updateBank('accountName', v)} />
                     <Input label="Account Number" value={content.bankDetails.accountNumber} onChange={(v: string) => updateBank('accountNumber', v)} />
                     <Input label="Branch Code" value={content.bankDetails.branchCode} onChange={(v: string) => updateBank('branchCode', v)} />
                </div>
            </div>
        </div>
    );
};

const LocationsEditor = () => {
    const { content, updateLocations } = useContent();
    
    const updateLoc = (idx: number, k: string, v: any) => {
        const n = [...content.locations];
        n[idx] = { ...n[idx], [k]: v };
        updateLocations(n);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <SectionHeader title="Locations" description="Manage branches and offices." icon={MapPin} helpTopic="editors" />
             <div className="grid grid-cols-1 gap-6">
                 {content.locations.map((loc, idx) => (
                     <div key={loc.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 relative">
                         <div className="flex-1 space-y-3">
                             <Input label="Name" value={loc.name} onChange={(v: string) => updateLoc(idx, 'name', v)} />
                             <Input label="Address" value={loc.address} onChange={(v: string) => updateLoc(idx, 'address', v)} />
                             <div className="grid grid-cols-2 gap-3">
                                <Input label="Phone" value={loc.phone} onChange={(v: string) => updateLoc(idx, 'phone', v)} />
                                <Input label="Email" value={loc.email} onChange={(v: string) => updateLoc(idx, 'email', v)} />
                             </div>
                         </div>
                         <div className="w-full md:w-48 space-y-2">
                             <FileUpload label="Image" value={loc.image} onChange={(v: string) => updateLoc(idx, 'image', v)} />
                             <div className="flex items-center gap-2">
                                 <input type="checkbox" checked={loc.isHeadOffice} onChange={(e) => updateLoc(idx, 'isHeadOffice', e.target.checked)} />
                                 <span className="text-sm text-gray-400">Head Office</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const BookingModalEditor = () => {
    const { content, updateContent } = useContent();
    const update = (k: string, v: any) => updateContent('bookingModal', { [k]: v });
    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Booking Flow" description="Customize the booking popup text." icon={MousePointerClick} helpTopic="editors" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Header Title" value={content.bookingModal.headerTitle} onChange={(v: string) => update('headerTitle', v)} />
                <Input label="Header Subtitle" value={content.bookingModal.headerSubtitle} onChange={(v: string) => update('headerSubtitle', v)} />
                <Input label="Step 1 Title" value={content.bookingModal.stepServiceTitle} onChange={(v: string) => update('stepServiceTitle', v)} />
                <Input label="Step 2 Title" value={content.bookingModal.stepDateTitle} onChange={(v: string) => update('stepDateTitle', v)} />
                <Input label="Step 3 Title" value={content.bookingModal.stepDetailsTitle} onChange={(v: string) => update('stepDetailsTitle', v)} />
                <Input label="Success Title" value={content.bookingModal.successTitle} onChange={(v: string) => update('successTitle', v)} />
                <Input label="Success Message" value={content.bookingModal.successMessage} onChange={(v: string) => update('successMessage', v)} />
                <TextArea label="Terms Text (Footer)" value={content.bookingModal.termsText || ''} onChange={(v: string) => update('termsText', v)} rows={2} />
            </div>
        </div>
    );
};

const SeoEditor = () => {
    const { content, updateContent } = useContent();
    const update = (k: string, v: any) => updateContent('seo', { [k]: v });
    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="SEO Settings" description="Optimize for search engines." icon={Search} helpTopic="editors" />
            <div className="space-y-4">
                <Input label="Meta Title" value={content.seo.metaTitle} onChange={(v: string) => update('metaTitle', v)} />
                <TextArea label="Meta Description" value={content.seo.metaDescription} onChange={(v: string) => update('metaDescription', v)} rows={3} />
                <Input label="Keywords" value={content.seo.keywords} onChange={(v: string) => update('keywords', v)} />
                <Input label="Canonical URL" value={content.seo.canonicalUrl || ''} onChange={(v: string) => update('canonicalUrl', v)} />
                <FileUpload label="OG Image (Social Share)" value={content.seo.ogImage} onChange={(v: string) => update('ogImage', v)} />
                <div className="bg-[#161817] p-4 rounded-xl border border-white/5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Structured Data (JSON-LD)</label>
                    <TextArea value={content.seo.structuredDataJSON || ''} onChange={(v: string) => update('structuredDataJSON', v)} rows={6} className="font-mono text-xs" />
                </div>
            </div>
        </div>
    );
};

const CreatorDashboard = ({ loggedInUser }: { loggedInUser: Employee | null }) => {
    const { content, updateContent, resetSystem, clearSystem, downloadBackup, restoreBackup } = useContent();
    
    // Only JSTYPME (Creator) can access specific dangerous/config sections
    const isCreator = loggedInUser?.loginName === 'jstypme';

    if (!isCreator) return <div className="text-red-500">Access Denied</div>;

    return (
        <div className="space-y-8 animate-in fade-in">
            <SectionHeader title="System & Creator Tools" description="Configuration and backup management." icon={Database} helpTopic="editors" />
            
            {/* Widget Config */}
            {isCreator && (
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-white font-bold mb-4">Creator Widget Config</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Slogan" value={content.creatorWidget.slogan} onChange={(v: string) => updateContent('creatorWidget', { slogan: v })} />
                        <Input label="CTA Text" value={content.creatorWidget.ctaText} onChange={(v: string) => updateContent('creatorWidget', { ctaText: v })} />
                        <FileUpload label="Logo" value={content.creatorWidget.logo} onChange={(v: string) => updateContent('creatorWidget', { logo: v })} />
                        <FileUpload label="Background" value={content.creatorWidget.background} onChange={(v: string) => updateContent('creatorWidget', { background: v })} />
                    </div>
                </div>
            )}

            {/* Backups */}
            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2"><Save size={18}/> Backup & Restore</h3>
                <div className="flex gap-4">
                    <button onClick={downloadBackup} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
                        <Download size={18}/> Download Backup
                    </button>
                    <label className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all border border-white/10">
                        <Upload size={18}/> Restore Backup
                        <input type="file" accept=".json" className="hidden" onChange={(e) => {
                            if(e.target.files?.[0]) {
                                if(confirm("Restore backup? Current data will be overwritten.")) {
                                    restoreBackup(e.target.files[0]).then(ok => ok && alert("System Restored!"));
                                }
                            }
                        }} />
                    </label>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/30 space-y-4">
                <h3 className="text-red-500 font-bold flex items-center gap-2"><AlertTriangle size={18}/> Danger Zone</h3>
                <div className="flex gap-4">
                    <button onClick={() => { if(confirm("RESET database to defaults?")) resetSystem(); }} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
                        <RotateCcw size={18}/> Reset to Defaults
                    </button>
                    {isCreator && (
                        <button onClick={() => { if(confirm("NUKE DATABASE? This deletes EVERYTHING except your admin access.")) clearSystem(); }} className="bg-black text-red-500 border border-red-500 hover:bg-red-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                            <Trash2 size={18}/> Nuke System
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- INVENTORY MANAGER ---
const InventoryManager = () => {
    const { content, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useContent();
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ name: '', category: 'Chemical', unit: 'L', costPerUnit: 0, retailPricePerUnit: 0, stockLevel: 0, minStockLevel: 0 });

    const handleAdd = () => {
        if(!newItem.name) return;
        addInventoryItem({
            id: `inv-${Date.now()}`,
            name: newItem.name,
            category: newItem.category as any || 'Chemical',
            unit: newItem.unit as any || 'L',
            costPerUnit: newItem.costPerUnit || 0,
            retailPricePerUnit: newItem.retailPricePerUnit || 0,
            stockLevel: newItem.stockLevel || 0,
            minStockLevel: newItem.minStockLevel || 0,
            activeIngredient: newItem.activeIngredient || '',
            registrationNumber: newItem.registrationNumber || ''
        });
        setNewItem({ name: '', category: 'Chemical', unit: 'L', costPerUnit: 0, retailPricePerUnit: 0, stockLevel: 0, minStockLevel: 0 });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <SectionHeader title="Inventory Management" description="Track chemicals, equipment, and stock levels." icon={Package} helpTopic="editors" />
             
             {/* Add Item Form */}
             <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 space-y-4 mb-6">
                 <h3 className="text-white font-bold">Add New Item</h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div className="col-span-2"><Input label="Item Name" value={newItem.name} onChange={(v: string) => setNewItem(prev => ({ ...prev, name: v }))} /></div>
                     <div className="col-span-1"><Select label="Category" value={newItem.category} options={[{label:'Chemical',value:'Chemical'},{label:'Equipment',value:'Equipment'},{label:'Consumable',value:'Consumable'},{label:'PPE',value:'PPE'}]} onChange={(v: string) => setNewItem(prev => ({ ...prev, category: v as any }))} /></div>
                     <div className="col-span-1"><Select label="Unit" value={newItem.unit} options={[{label:'Litre (L)',value:'L'},{label:'Millilitre (ml)',value:'ml'},{label:'Kilogram (kg)',value:'kg'},{label:'Gram (g)',value:'g'},{label:'Unit',value:'unit'},{label:'Box',value:'box'}]} onChange={(v: string) => setNewItem(prev => ({ ...prev, unit: v as any }))} /></div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <Input label="Cost Price" type="number" value={newItem.costPerUnit} onChange={(v: string) => setNewItem(prev => ({ ...prev, costPerUnit: parseFloat(v) }))} />
                     <Input label="Retail/Quote Price" type="number" value={newItem.retailPricePerUnit} onChange={(v: string) => setNewItem(prev => ({ ...prev, retailPricePerUnit: parseFloat(v) }))} />
                     <Input label="Current Stock" type="number" value={newItem.stockLevel} onChange={(v: string) => setNewItem(prev => ({ ...prev, stockLevel: parseFloat(v) }))} />
                     <Input label="Min Stock Level" type="number" value={newItem.minStockLevel} onChange={(v: string) => setNewItem(prev => ({ ...prev, minStockLevel: parseFloat(v) }))} />
                 </div>
                 {newItem.category === 'Chemical' && (
                     <div className="grid grid-cols-2 gap-4">
                         <Input label="Active Ingredient" value={newItem.activeIngredient || ''} onChange={(v: string) => setNewItem(prev => ({ ...prev, activeIngredient: v }))} />
                         <Input label="L-Number (Reg)" value={newItem.registrationNumber || ''} onChange={(v: string) => setNewItem(prev => ({ ...prev, registrationNumber: v }))} />
                     </div>
                 )}
                 <button onClick={handleAdd} className="bg-pestGreen text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"><PlusCircle size={18}/> Add Item</button>
             </div>

             {/* Inventory List */}
             <div className="grid grid-cols-1 gap-4">
                 {content.inventory.map(item => (
                     <div key={item.id} className="bg-[#161817] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="flex-1">
                             <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold text-lg">{item.name}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.stockLevel <= item.minStockLevel ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    {item.stockLevel <= item.minStockLevel ? 'Low Stock' : item.category}
                                </span>
                             </div>
                             <div className="text-sm text-gray-500 mt-1 flex gap-4">
                                 <span>Stock: <strong className={item.stockLevel <= item.minStockLevel ? 'text-red-500' : 'text-pestGreen'}>{item.stockLevel} {item.unit}</strong></span>
                                 <span>Cost: R{item.costPerUnit}</span>
                                 <span>Retail: R{item.retailPricePerUnit}</span>
                             </div>
                             {item.activeIngredient && <div className="text-xs text-gray-600 mt-1">Active: {item.activeIngredient} (Reg: {item.registrationNumber})</div>}
                         </div>
                         
                         <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                  <label className="text-[10px] text-gray-500 uppercase font-bold">Adjust Stock</label>
                                  <div className="flex items-center gap-1">
                                      <button onClick={() => updateInventoryItem(item.id, { stockLevel: Math.max(0, item.stockLevel - 1) })} className="bg-white/10 hover:bg-red-500/20 text-white p-1 rounded">-</button>
                                      <span className="w-12 text-center text-white font-bold bg-black/20 rounded py-1">{item.stockLevel}</span>
                                      <button onClick={() => updateInventoryItem(item.id, { stockLevel: item.stockLevel + 1 })} className="bg-white/10 hover:bg-green-500/20 text-white p-1 rounded">+</button>
                                  </div>
                              </div>
                              <button onClick={() => { if(confirm("Delete item?")) deleteInventoryItem(item.id); }} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

// --- BOOKINGS VIEWER ---

const BookingsViewer = () => {
    const { content, updateBooking, addJobCard } = useContent();
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [manualForm, setManualForm] = useState({ name: '', phone: '', email: '', service: '', address: '', date: '', time: '' });
    
    const sortedBookings = useMemo(() => [...content.bookings].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()), [content.bookings]);

    const handleManualSubmit = () => {
        if(!manualForm.name || !manualForm.phone) return alert("Name and Phone required");
        
        const newJob: JobCard = {
            id: `job-${Date.now()}`,
            refNumber: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            clientName: manualForm.name,
            clientAddressDetails: { street: manualForm.address, suburb: '', city: 'Nelspruit', province: 'MP', postalCode: '' },
            contactNumber: manualForm.phone,
            email: manualForm.email,
            propertyType: 'Residential',
            assessmentDate: new Date().toISOString(),
            technicianId: '',
            selectedServices: [],
            checkpoints: [],
            isFirstTimeService: true,
            treatmentRecommendation: `Manual Booking: ${manualForm.service}`,
            quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' },
            status: 'Assessment',
            history: [{ date: new Date().toISOString(), action: 'Manual Booking Created', user: 'Admin' }]
        };
        addJobCard(newJob);
        setIsManualOpen(false);
        setManualForm({ name: '', phone: '', email: '', service: '', address: '', date: '', time: '' });
        alert("Booking created and converted to Job Card immediately.");
    };

    const handleConvert = (booking: Booking) => {
        const newJob: JobCard = {
            id: `job-${Date.now()}`,
            refNumber: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            bookingId: booking.id,
            clientName: booking.clientName,
            clientAddressDetails: { street: booking.clientAddress, suburb: '', city: 'Nelspruit', province: 'MP', postalCode: '' },
            contactNumber: booking.clientPhone,
            email: booking.clientEmail,
            propertyType: 'Residential',
            assessmentDate: new Date().toISOString(),
            technicianId: '',
            selectedServices: [booking.serviceId],
            checkpoints: [],
            isFirstTimeService: true,
            treatmentRecommendation: `Service requested: ${booking.serviceName}`,
            quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' },
            status: 'Assessment',
            history: [{ date: new Date().toISOString(), action: `Converted from Booking`, user: 'System' }]
        };
        addJobCard(newJob);
        updateBooking(booking.id, { status: 'Converted' });
        alert(`Booking converted to Job ${newJob.refNumber}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-start">
                <SectionHeader title="Online Inquiries" description="Requests from the website booking form." icon={Inbox} helpTopic="bookings" />
                <button onClick={() => setIsManualOpen(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border border-white/10 transition-colors">
                    <Plus size={16}/> Manual Booking
                </button>
            </div>

            {isManualOpen && (
                <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 mb-6 animate-in slide-in-from-top-4">
                    <h3 className="text-white font-bold mb-4">New Manual Booking (Phone/Walk-in)</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Input label="Client Name" value={manualForm.name} onChange={(v:string)=>setManualForm({...manualForm, name: v})}/>
                        <Input label="Phone" value={manualForm.phone} onChange={(v:string)=>setManualForm({...manualForm, phone: v})}/>
                        <Input label="Email" value={manualForm.email} onChange={(v:string)=>setManualForm({...manualForm, email: v})}/>
                        <Input label="Service Interest" value={manualForm.service} onChange={(v:string)=>setManualForm({...manualForm, service: v})}/>
                    </div>
                    <Input label="Address" value={manualForm.address} onChange={(v:string)=>setManualForm({...manualForm, address: v})} className="mb-4"/>
                    <div className="flex gap-4">
                        <button onClick={handleManualSubmit} className="bg-pestGreen text-white px-6 py-2 rounded-lg font-bold">Create Job</button>
                        <button onClick={() => setIsManualOpen(false)} className="text-gray-400 px-4 py-2">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {sortedBookings.length === 0 && <p className="text-gray-500 text-center py-10">No inquiries yet.</p>}
                {sortedBookings.map(b => (
                    <div key={b.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 relative group">
                        <div className={`absolute top-0 left-0 bottom-0 w-2 rounded-l-2xl ${b.status === 'New' ? 'bg-pestGreen' : b.status === 'Converted' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${b.status === 'New' ? 'bg-pestGreen text-white' : 'bg-white/10 text-gray-500'}`}>{b.status}</span>
                                <span className="text-gray-500 text-xs">{new Date(b.submittedAt).toLocaleString()}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{b.serviceName}</h3>
                            <div className="text-gray-400 text-sm space-y-1">
                                <p className="flex items-center gap-2"><User size={14}/> {b.clientName}</p>
                                <p className="flex items-center gap-2"><Phone size={14}/> {b.clientPhone}</p>
                                <p className="flex items-center gap-2"><Mail size={14}/> {b.clientEmail}</p>
                                <p className="flex items-center gap-2"><Calendar size={14}/> Requested: {new Date(b.date).toLocaleDateString()} at {b.time}</p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-2">
                            {b.status === 'New' && (
                                <button onClick={() => updateBooking(b.id, { status: 'Contacted' })} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-colors border border-white/10">Mark Contacted</button>
                            )}
                            {b.status !== 'Converted' && (
                                <button onClick={() => handleConvert(b)} className="px-4 py-2 bg-pestGreen hover:bg-white hover:text-pestGreen text-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Clipboard size={16}/> Convert to Job
                                </button>
                            )}
                            <button onClick={() => updateBooking(b.id, { status: 'Archived' })} className="px-4 py-2 text-gray-500 hover:text-red-500 text-xs transition-colors">Archive</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- CLIENT MANAGER ---

const ClientManager = () => {
    const { content, updateJobCard, addClientUser } = useContent();
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingClient, setEditingClient] = useState<{name: string, email: string, phone: string, address: string} | null>(null);
    
    const [portalForm, setPortalForm] = useState<Partial<ClientUser> | null>(null);

    const clients = useMemo(() => {
        const clientMap = new Map();
        
        // Safety check for jobCards being defined
        if (!content.jobCards) return [];

        content.jobCards.forEach(job => {
            // Safety check for clientName
            if (!job.clientName) return;

            const key = job.clientName.trim();
            if (!clientMap.has(key)) {
                clientMap.set(key, { 
                    name: key, 
                    email: job.email || '', 
                    phone: job.contactNumber || '', 
                    address: job.clientAddressDetails?.street || '',
                    jobs: [], 
                    bookings: [], 
                    totalSpend: 0, 
                    portalAccess: null 
                });
            }
            const client = clientMap.get(key);
            if(client) {
                client.jobs.push(job);
                if (job.status === 'Completed' || job.status === 'Invoiced') {
                    client.totalSpend += (job.quote?.total || 0);
                }
                // Update contact info if newer job has it
                if (job.email) client.email = job.email;
                if (job.contactNumber) client.phone = job.contactNumber;
                if (job.clientAddressDetails?.street) client.address = `${job.clientAddressDetails.street}, ${job.clientAddressDetails.suburb}`;
            }
        });

        // Map Portal Users
        if(content.clientUsers) {
            content.clientUsers.forEach(cu => {
                // Try find by email first
                let matched = false;
                for(let [key, val] of clientMap) {
                    if (val.email && cu.email && val.email.toLowerCase() === cu.email.toLowerCase()) {
                        val.portalAccess = cu;
                        matched = true;
                        break;
                    }
                }
                // If not matched by email, maybe add as standalone? 
                // For now, only job-linked clients show up to prevent clutter, unless we want standalone clients.
                // If the user manually added a client that has NO jobs, they won't appear above.
                // Let's add them:
                if (!matched) {
                    // Only add if not exist by name
                     if (!clientMap.has(cu.fullName)) {
                        clientMap.set(cu.fullName, {
                            name: cu.fullName,
                            email: cu.email,
                            phone: cu.phone,
                            address: cu.address,
                            jobs: [],
                            bookings: [],
                            totalSpend: 0,
                            portalAccess: cu
                        });
                     }
                }
            });
        }

        return Array.from(clientMap.values());
    }, [content.jobCards, content.clientUsers]);

    const filteredClients = clients.filter(c => c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const activeClientData = selectedClient ? clients.find(c => c.name === selectedClient) : null;

    const handleCreatePortalAccess = () => {
        if (!activeClientData || !portalForm) return;
        
        const newClientUser: ClientUser = {
            id: `client-${Date.now()}`,
            fullName: activeClientData.name,
            email: portalForm.email || activeClientData.email,
            pin: portalForm.pin || '1234',
            phone: portalForm.phone || activeClientData.phone,
            address: portalForm.address || activeClientData.address,
            companyName: portalForm.companyName || '',
            profileImage: portalForm.profileImage || null,
            linkedEmails: [activeClientData.email],
            notes: ''
        };
        addClientUser(newClientUser);
        setPortalForm(null);
        alert(`Portal access granted for ${newClientUser.fullName}. Password: ${newClientUser.pin}`);
    };

    const handleEditSave = () => {
        if (!editingClient || !activeClientData) return;
        const activeJobs = activeClientData.jobs.filter((j: JobCard) => ['Assessment', 'Quote_Builder', 'Quote_Sent', 'Job_Scheduled', 'Job_In_Progress'].includes(j.status));
        
        if (activeJobs.length > 0) {
            activeJobs.forEach((job: JobCard) => {
                updateJobCard(job.id, {
                    email: editingClient.email,
                    contactNumber: editingClient.phone,
                    clientAddressDetails: {
                        ...job.clientAddressDetails,
                        street: editingClient.address.split(',')[0] || job.clientAddressDetails.street
                    }
                });
            });
            alert(`Updated contact details for ${activeJobs.length} active jobs.`);
        } else {
            alert("Client details updated for future reference.");
        }
        setEditingClient(null);
        setSelectedClient(null); 
        setTimeout(() => setSelectedClient(activeClientData.name), 100);
    };

    if (selectedClient && activeClientData) {
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <button onClick={() => { setSelectedClient(null); setPortalForm(null); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><ChevronRight className="rotate-180" size={20}/></button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-white">{activeClientData.name}</h2>
                            {activeClientData.portalAccess && <span className="bg-pestGreen text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Portal Active</span>}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                             <span className="flex items-center gap-1"><Mail size={12}/> {activeClientData.email || 'No Email'}</span>
                             <span className="flex items-center gap-1"><Phone size={12}/> {activeClientData.phone || 'No Phone'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setEditingClient({
                            name: activeClientData.name, 
                            email: activeClientData.email, 
                            phone: activeClientData.phone, 
                            address: activeClientData.address || ''
                        })}
                        className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors border border-blue-500/30"
                    >
                        <Edit size={14}/> Edit Contact
                    </button>
                </div>

                {editingClient && (
                    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                        <div className="bg-[#1e201f] w-full max-w-md p-6 rounded-2xl border border-white/10 space-y-4">
                            <h3 className="text-white font-bold text-xl">Edit Client Details</h3>
                            <Input label="Email" value={editingClient.email} onChange={(v: string) => setEditingClient({...editingClient, email: v})} />
                            <Input label="Phone" value={editingClient.phone} onChange={(v: string) => setEditingClient({...editingClient, phone: v})} />
                            <Input label="Address" value={editingClient.address} onChange={(v: string) => setEditingClient({...editingClient, address: v})} />
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setEditingClient(null)} className="flex-1 py-3 rounded-xl font-bold bg-white/5 text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={handleEditSave} className="flex-1 py-3 rounded-xl font-bold bg-pestGreen text-white">Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-[#161817] p-6 rounded-xl border border-white/10 shadow-lg">
                    <h3 className="text-white font-bold flex items-center gap-2 mb-4"><Lock size={18} className="text-pestGreen"/> Client Portal Access</h3>
                    {activeClientData.portalAccess ? (
                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
                            <div>
                                <p className="text-green-400 font-bold text-sm">Access Granted</p>
                                <p className="text-gray-400 text-xs">Login: {activeClientData.portalAccess.email}</p>
                            </div>
                        </div>
                    ) : (
                        !portalForm ? (
                            <button onClick={() => setPortalForm({ email: activeClientData.email, pin: '1234' })} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                                <Plus size={16}/> Create Portal Account
                            </button>
                        ) : (
                            <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5 animate-in fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Login Email" value={portalForm.email} onChange={(v:string)=>setPortalForm({...portalForm, email: v})}/>
                                    <Input label="Set Password/PIN" value={portalForm.pin} onChange={(v:string)=>setPortalForm({...portalForm, pin: v})}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Company Name (Optional)" value={portalForm.companyName || ''} onChange={(v:string)=>setPortalForm({...portalForm, companyName: v})}/>
                                    <FileUpload label="Identity Icon / Logo" value={portalForm.profileImage} onChange={(v:string)=>setPortalForm({...portalForm, profileImage: v})}/>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleCreatePortalAccess} className="bg-pestGreen text-white px-4 py-2 rounded-lg font-bold text-sm">Confirm & Create</button>
                                    <button onClick={() => setPortalForm(null)} className="text-gray-400 px-4 py-2 text-sm hover:text-white">Cancel</button>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><Briefcase size={18} className="text-pestGreen"/> Job History & Invoices</h3>
                        {activeClientData.jobs.length === 0 && <p className="text-gray-500 italic">No job cards found.</p>}
                        {activeClientData.jobs.map((job: JobCard) => (
                            <div key={job.id} className="bg-[#161817] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="font-bold text-white">{job.refNumber}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                                        job.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                                        job.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-300'
                                    }`}>{job.status.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="text-sm text-gray-400">{job.selectedServices.join(', ') || 'General Pest Control'}</div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-1">
                                    <span className="text-xs text-gray-500">{new Date(job.assessmentDate).toLocaleDateString()}</span>
                                    <span className="font-bold text-pestGreen">R {job.quote?.total.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionHeader title="Client Management" icon={Users} description="View client history, total spend, and manage portal access." helpTopic="clients" />
            
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Search clients by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 p-4 bg-[#161817] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client, idx) => (
                    <div key={idx} onClick={() => setSelectedClient(client.name)} className="bg-[#161817] p-5 rounded-xl border border-white/5 hover:border-pestGreen transition-all cursor-pointer group shadow-lg relative overflow-hidden">
                        {client.portalAccess && <div className="absolute top-0 right-0 w-3 h-3 bg-pestGreen rounded-bl-lg shadow-neon"></div>}
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-white group-hover:text-pestGreen truncate">{client.name}</h3>
                            <ChevronRight size={18} className="text-gray-600 group-hover:text-white" />
                        </div>
                        <div className="space-y-1 text-sm text-gray-400 mb-4">
                             <p className="flex items-center gap-2"><Mail size={12}/> {client.email || 'N/A'}</p>
                             <p className="flex items-center gap-2"><Phone size={12}/> {client.phone || 'N/A'}</p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">{client.jobs.length} Jobs</span>
                            <span className="font-bold text-white">R {client.totalSpend.toFixed(0)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
    const [activeMainTab, setActiveMainTab] = useState<AdminMainTab>('work');
    const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('jobs');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const { content, addJobCard } = useContent();

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
        <div className="w-64 bg-[#161817] flex flex-col h-full border-r border-white/5 flex-shrink-0">
            <div className="p-6 border-b border-white/5">
                <h1 className="text-white font-black text-xl uppercase tracking-wider">Admin Panel</h1>
                <p className="text-xs text-gray-500 mt-1">Logged in as {loggedInUser?.fullName || 'Admin'}</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Work</div>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('jobs'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'jobs' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Clipboard size={16}/> Jobs</button>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('inquiries'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'inquiries' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Inbox size={16}/> Bookings</button>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('clients'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'clients' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Users size={16}/> Clients</button>
                    <button onClick={() => { setActiveMainTab('work'); setActiveSubTab('inventory'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'inventory' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Package size={16}/> Inventory</button>
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
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('bookingSettings'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'bookingSettings' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><MousePointerClick size={16}/> Booking Flow</button>
                    <button onClick={() => { setActiveMainTab('companyInfo'); setActiveSubTab('seo'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'seo' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Search size={16}/> SEO</button>
                    {loggedInUser?.loginName === 'jstypme' && (
                        <button onClick={() => { setActiveMainTab('creator'); setActiveSubTab('creatorSettings'); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSubTab === 'creatorSettings' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:text-white'}`}><Database size={16}/> System</button>
                    )}
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
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Clipboard/> Job Cards</h2>
                            <HelpButton topic="job-overview" />
                        </div>
                        <button 
                            onClick={handleCreateJob}
                            className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-pestGreen transition-colors shadow-lg"
                        >
                            <PlusCircle size={20}/> New Job
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {content.jobCards.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No jobs found. Create one to get started.</p>}
                        {content.jobCards.map(job => (
                            <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="bg-[#161817] p-5 rounded-xl border border-white/5 cursor-pointer hover:border-pestGreen transition-all hover:scale-[1.01] shadow-lg group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-white group-hover:text-pestGreen transition-colors">{job.refNumber}</div>
                                    <div className={`text-xs px-2 py-1 rounded text-white font-bold uppercase tracking-wider
                                        ${job.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                                          job.status === 'Assessment' ? 'bg-blue-500/20 text-blue-400' : 
                                          job.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-300'}`}>
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
            case 'clients': return <ClientManager />;
            case 'inventory': return <InventoryManager />;
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
            case 'creatorSettings': return <CreatorDashboard loggedInUser={loggedInUser} />;
            
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
