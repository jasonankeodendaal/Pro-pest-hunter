
import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { JobCard } from '../types';
import { MessageCircle, FileText, CheckCircle, Download, Bug, Phone, MapPin, Calendar, Building2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicJobViewerProps {
    jobId: string;
}

export const PublicJobViewer: React.FC<PublicJobViewerProps> = ({ jobId }) => {
    const { content } = useContent();
    const job = content.jobCards.find(j => j.id === jobId);
    const [activeTab, setActiveTab] = useState<'options' | 'report'>('options');

    // If data hasn't loaded or job not found
    if (!content.jobCards.length) return <div className="min-h-screen bg-pestLight flex items-center justify-center"><div className="w-10 h-10 border-4 border-pestGreen border-t-transparent rounded-full animate-spin"></div></div>;
    
    if (!job) return (
        <div className="min-h-screen bg-pestLight flex flex-col items-center justify-center p-6 text-center">
            <Bug size={64} className="text-pestBrown/20 mb-4" />
            <h1 className="text-2xl font-black text-pestBrown mb-2">Job Not Found</h1>
            <p className="text-gray-500">The scanned QR code does not match an active job record.</p>
        </div>
    );

    const whatsappLink = `https://wa.me/${content.company.phone.replace(/[^0-9]/g, '')}?text=Hi, regarding Job Ref: ${job.refNumber}...`;

    return (
        <div className="min-h-screen bg-[#eef2ee] font-sans text-pestBrown flex flex-col">
            {/* Header */}
            <div className="bg-[#1a2e18] text-white p-8 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    {content.company.logo ? (
                        <img src={content.company.logo} alt="Logo" className="h-20 object-contain mb-4 drop-shadow-md" />
                    ) : (
                        <h1 className="text-2xl font-black">{content.company.name}</h1>
                    )}
                    <div className="bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-white/10 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-pestGreen">Job Report</span>
                    </div>
                    <h2 className="text-3xl font-black mb-1">{job.refNumber}</h2>
                    <p className="text-gray-400 text-sm">{new Date(job.assessmentDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex-1 p-6 -mt-6">
                <div className="max-w-md mx-auto space-y-6">
                    
                    {/* Main Actions */}
                    {activeTab === 'options' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-white p-6 rounded-3xl shadow-thick border border-white space-y-6">
                                <h3 className="text-center font-bold text-lg text-gray-500 uppercase tracking-widest text-xs">How can we help?</h3>
                                
                                <a 
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white p-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                                >
                                    <MessageCircle size={28} className="fill-white" />
                                    WhatsApp Us
                                </a>

                                <button 
                                    onClick={() => setActiveTab('report')}
                                    className="block w-full bg-pestBrown hover:bg-pestDarkGreen text-white p-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                                >
                                    <FileText size={28} />
                                    View Report & Certs
                                </button>
                            </div>

                            <div className="bg-white/50 p-6 rounded-3xl border border-white/50 text-center text-sm text-gray-500">
                                <p className="font-bold text-pestBrown mb-1">Service Location:</p>
                                <p>{job.clientAddressDetails.street}, {job.clientAddressDetails.suburb}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Reports & Certs */}
                    {activeTab === 'report' && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6 pb-12"
                        >
                            <button onClick={() => setActiveTab('options')} className="text-xs font-bold uppercase text-gray-400 hover:text-pestBrown mb-2">&larr; Back to Options</button>
                            
                            {/* Certificates Section */}
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-white">
                                <h3 className="font-black text-xl text-pestBrown mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-pestGreen" /> Certificates
                                </h3>
                                {job.jobCertificates && job.jobCertificates.length > 0 ? (
                                    <div className="space-y-3">
                                        {job.jobCertificates.map((url, i) => {
                                            const isPdf = url.toLowerCase().includes('.pdf');
                                            return (
                                                <a 
                                                    key={i} 
                                                    href={url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-4 bg-pestLight rounded-xl border border-pestGreen/20 hover:border-pestGreen transition-colors group"
                                                >
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-pestGreen shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">Certificate {i + 1}</p>
                                                        <p className="text-xs text-gray-500">{isPdf ? 'PDF Document' : 'Image File'}</p>
                                                    </div>
                                                    {isPdf ? <ExternalLink size={18} className="text-gray-400 group-hover:text-pestGreen"/> : <Download size={18} className="text-gray-400 group-hover:text-pestGreen" />}
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        No certificates uploaded yet.
                                    </p>
                                )}
                            </div>

                            {/* Service Report Summary */}
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-white">
                                <h3 className="font-black text-xl text-pestBrown mb-4 flex items-center gap-2">
                                    <Bug size={20} className="text-pestGreen" /> Service Report
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-pestLight rounded-xl border border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Treatment Recommendation</p>
                                        <p className="font-medium text-sm text-pestBrown">{job.treatmentRecommendation}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Locations Treated</p>
                                        <div className="space-y-3">
                                            {job.checkpoints.map(cp => (
                                                <div key={cp.id} className="flex flex-col gap-2 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${cp.isTreated ? 'bg-pestGreen' : 'bg-gray-300'}`}></div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm">{cp.area}</p>
                                                            <p className="text-xs text-gray-500">{cp.pestType} - {cp.isTreated ? 'Completed' : 'Pending'}</p>
                                                        </div>
                                                    </div>
                                                    {/* Show Task Breakdown if any */}
                                                    {cp.tasks && cp.tasks.length > 0 && (
                                                        <div className="ml-5 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                                            {cp.tasks.map(t => (
                                                                <div key={t.id} className="flex items-center gap-2">
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-pestGreen' : 'bg-gray-300'}`}></div>
                                                                    <span className={t.completed ? '' : 'italic'}>{t.description}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-xs text-gray-400 pt-4">
                                <p>{content.company.name}</p>
                                <p>{content.company.phone}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
