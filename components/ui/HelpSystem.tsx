
import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, CheckCircle, Info, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Help Content Dictionary
export const HELP_CONTENT: Record<string, { title: string; subtitle: string; steps: string[] }> = {
    // --- ADMIN / WORKFLOW ---
    'job-overview': {
        title: "Job Overview & Setup",
        subtitle: "The foundation of a successful job card.",
        steps: [
            "**1. Client Verification**\nDouble-check the email and phone number. The system uses the email address to link this job to the client's portal account automatically. If the email is wrong, they won't see this job.",
            "**2. Address Accuracy**\nEnsure the street address is precise. If there are gate codes or specific access instructions (e.g., 'Use side entrance', 'Beware of dog'), enter them in the 'Gate Code / Access' field so the technician sees them immediately.",
            "**3. Scheduling Logic**\n- **Assessment Date**: This is for the initial inspection visit.\n- **Service Date**: This is for the actual treatment execution. It might be the same day, but often follows the quote approval.",
            "**4. Status Management**\nUse the status buttons to move the job forward. \n- 'Assessment': Initial phase.\n- 'Quote Builder': Creating the price.\n- 'Job Scheduled': Work is approved and booked.\n- 'In Progress': Technician is on site.",
            "**5. Saving Data**\nChanges made in the inputs are held in local state until you click the green **Save Details** button at the bottom. Always save before switching tabs."
        ]
    },
    'assessment': {
        title: "Assessment & Compliance",
        subtitle: "Risk analysis, weather checks, and site mapping.",
        steps: [
            "**1. Risk Assessment (Legal Requirement)**\nBefore starting, you MUST complete the Site Risk Assessment. Verify pets are removed, food is covered, and water tanks are safe. This protects you from liability.",
            "**2. Environmental Conditions**\nAct 36 of 1947 requires recording weather conditions during application. Enter the Temperature and Wind Speed. High wind speeds may legally prevent outdoor spraying.",
            "**3. Checkpoints & Monitoring**\nCreate checkpoints for specific areas (e.g., 'Kitchen Sink', 'Garage Bait Station'). For Bait Stations, use the 'Monitoring' fields to track activity (Low/High) and bait condition (Intact/Eaten).",
            "**4. QR Code System**\nOnce checkpoints are added, print the QR codes. Place them at the physical location. Technicians scan these to prove presence and access the checklist.",
            "**5. Photos**\nTake photos of infestation evidence or risks. These attach to the final report."
        ]
    },
    'quote-builder': {
        title: "Quote Builder & Approval",
        subtitle: "Converting assessment findings into a contract.",
        steps: [
            "**1. Line Items & Inventory**\nYou can type items manually or load them directly from your **Inventory**. Loading from inventory ensures you use the correct pricing and descriptions.",
            "**2. Deposit Rules**\n- **Percentage**: Calculates a % of the total (e.g., 50%).\n- **Fixed**: A set amount (e.g., R500).\n- **None**: No deposit required to schedule.\n*Note: If a deposit is set, the system will prompt you to confirm payment before moving the job to 'Scheduled'.*",
            "**3. Special Notes**\nAdd banking details, warranty terms (e.g., '6 Month Guarantee'), or preparation instructions (e.g., 'Please empty kitchen cupboards') here.",
            "**4. The Approval Process**\n1. **Save (Pending)**: Stores the quote as a draft.\n2. **Print/Email**: Send the PDF to the client.\n3. **Approve & Convert**: Click this ONLY when the client has accepted. This locks the quote and unlocks the **Execution** tab."
        ]
    },
    'execution': {
        title: "Technician Execution Protocol",
        subtitle: "Strict workflow for treatment and safety.",
        steps: [
            "**1. Pre-Work Safety (PPE)**\nThe system locks the execution tab until the technician confirms they are wearing the required PPE (Gloves, Mask, etc.). This is a mandatory safety step.",
            "**2. The Double-Scan Protocol**\n- **Scan 1 (Start)**: Technician scans the wall QR code to start the timer.\n- **Work**: Complete the checklist and monitoring data (Bait condition, Activity).\n- **Scan 2 (Finish)**: Scan again to close the checkpoint.",
            "**3. Advanced Chemical Tracking**\nWhen recording usage, you must now specify:\n- **Batch Number**: For traceability.\n- **Application Method**: (Spray, Gel, Gas).\n- **Dilution Rate**: (e.g., 5ml/1L).\nThis data is critical for compliance with Department of Agriculture audits.",
            "**4. Completion**\nEnsure all checkpoints are green (Completed) before finishing the job."
        ]
    },
    'invoice-close': {
        title: "Invoicing & Job Closure",
        subtitle: "Getting paid and finalizing documentation.",
        steps: [
            "**1. Certificate Uploads**\nIf the job requires a COC, Clearance Certificate, or specialized report, upload the PDF/Image here. These files become available to the client immediately via their unique QR Card.",
            "**2. Client QR Card**\nClick **Print Client QR Card**. This generates a professional card to leave with the client. When they scan it, it opens a portal to view their Reports, Invoices, and Certificates instantly.",
            "**3. Recording Payment**\n- Select Method (EFT, Cash, etc.).\n- Enter Amount.\n- This marks the invoice as PAID in the system.",
            "**4. Follow-Up Strategy**\nUse the **Book Follow-Up** button to instantly clone the client's details into a NEW job card for 3/6 months later. This is crucial for recurring revenue.",
            "**5. Closing**\nClick **Close Job** to lock the record and archive it."
        ]
    },
    
    // --- DASHBOARD SECTIONS ---
    'inventory': {
        title: "Inventory Control System",
        subtitle: "Managing stock, costs, and chemical usage.",
        steps: [
            "**1. Adding Items**\n- **Category**: Classify as Chemical, Equipment, PPE, etc.\n- **Unit**: Be consistent (e.g., always use 'ml' for liquids to match usage records).\n- **Cost Price**: Your purchase price per unit.\n- **Retail Price**: The price you charge/quote per unit.",
            "**2. L-Numbers & Actives**\nFor chemicals, you MUST enter the Active Ingredient and Registration Number (L-Number). This is required for legal compliance and appears on safety reports.",
            "**3. Stock Management**\n- **Current Stock**: The physical amount you have.\n- **Min Level**: The 'Low Stock' warning trigger.\n- Stock is **automatically deducted** when a technician records 'Material Usage' inside a Job Card.",
            "**4. Manual Adjustments**\nUse the +/- buttons in the list to correct stock levels after a stock take or new purchase."
        ]
    },
    'clients': {
        title: "Client Database & Portal",
        subtitle: "Managing relationships and access.",
        steps: [
            "**1. Automatic Grouping**\nThe system groups jobs by **Email Address**. If you create 5 jobs with 'john@test.com', they will all appear under John's profile here.",
            "**2. Client Portal Access**\n- Click **Create Portal Account** to generate a login for a client.\n- Give them the **Email** and **PIN**.\n- They can log in to view their entire job history, download past invoices, and book new services.",
            "**3. Editing Details**\nUpdating a client's phone number or address here will update the contact details on ALL their active (non-completed) jobs.",
            "**4. Total Spend**\nThis metric tracks the total value of 'Completed' or 'Invoiced' jobs for this client. Use this to identify VIP customers."
        ]
    },
    'bookings': {
        title: "Online Booking Management",
        subtitle: "Handling web inquiries and walk-ins.",
        steps: [
            "**1. Incoming Stream**\nWhen a customer uses the 'Book Now' form on your website, it appears here instantly as 'New'.",
            "**2. Manual Bookings**\nUse the **Manual Booking** button for phone calls or walk-ins. This creates a record immediately without needing the full website flow.",
            "**3. Conversion Process**\n- **Mark Contacted**: Use this if you have called them but haven't finalized the date.\n- **Convert to Job**: This is the key step. It takes the booking data and creates a full, editable **Job Card**, moving the status to 'Assessment'.",
            "**4. Archiving**\nUse 'Archive' for spam or cancelled inquiries to keep your list clean."
        ]
    },
    'editors': {
        title: "Content Management System (CMS)",
        subtitle: "Control your public website without code.",
        steps: [
            "**1. Real-Time Updates**\nChanges made here (text, prices, descriptions) reflect immediately on the live site.",
            "**2. Icon Library**\nUse the search bar in the Icon Picker to find symbols (e.g., 'Rat', 'Shield', 'Home'). We use the Lucide icon set.",
            "**3. Image Handling**\nUpload high-quality images but try to keep file sizes reasonable (under 2MB) for fast loading speeds.",
            "**4. Service Configuration**\nIn the 'Services' editor, you can also define **Assessment Templates**. These are pre-set checklists that load automatically when you start a job for that service type."
        ]
    }
};

interface HelpButtonProps {
    topic: string; // Key from HELP_CONTENT
    className?: string;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ topic, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const content = HELP_CONTENT[topic];

    if (!content) return (
        <button className="text-gray-500 cursor-not-allowed opacity-50 text-xs flex items-center gap-1" title="No guide available">
            <HelpCircle size={14}/> Help
        </button>
    );

    return (
        <>
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                className={`flex items-center gap-2 text-pestGreen hover:text-white bg-pestGreen/10 hover:bg-pestGreen px-3 py-1.5 rounded-lg transition-all font-bold text-xs uppercase tracking-wide border border-pestGreen/20 ${className}`}
                title="Open Guide"
            >
                <HelpCircle size={16} /> Guide
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#1a1a1a] w-full max-w-3xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-pestGreen to-pestDarkGreen p-8 flex justify-between items-start relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-pestBrown bg-white/90 backdrop-blur px-3 py-1 rounded-full w-fit mb-4 shadow-lg">
                                        <BookOpen size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">System Guide</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{content.title}</h2>
                                    <p className="text-white/90 font-medium text-lg border-l-4 border-white/30 pl-4">{content.subtitle}</p>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors relative z-10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#161817]">
                                <div className="space-y-8">
                                    {content.steps.map((step, idx) => {
                                        // Simple markdown parsing
                                        const parts = step.split('\n');
                                        const title = parts[0].replace(/\*\*/g, ''); // First line is title
                                        const body = parts.slice(1).join('\n');

                                        return (
                                            <div key={idx} className="flex gap-6 group">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-pestGreen/10 group-hover:bg-pestGreen flex items-center justify-center text-pestGreen group-hover:text-white font-black text-lg border border-pestGreen/20 transition-colors shadow-lg">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
                                                    <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line">
                                                        {body}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-[#121212] flex justify-between items-center">
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <Info size={14}/> Need more help? Contact Admin Support.
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="bg-pestGreen text-white hover:bg-white hover:text-pestGreen px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
                                >
                                    Understood <CheckCircle size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
