

import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string; // Shorter summary for card
  fullDescription: string; // Longer, more detailed description for the panel
  details: string[]; // Bullet points for the detail panel
  iconName: string;
  price?: string;
  image?: string | null; // Image for the service detail panel
  visible: boolean;
  featured: boolean;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export interface WhyChooseUsItem {
  title: string;
  text: string;
  iconName: string;
}

// About Item Interface for highlights
export interface AboutItem {
  text: string;
  iconName: string;
}

// FAQ Interface
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Testimonial Interface
export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

// Document interface for employee files
export interface Document {
  id: string;
  type: 'CV' | 'Certificate' | 'Training' | 'Other';
  name: string; // User-friendly name for the document
  fileUrl: string; // URL to the uploaded file
  description?: string;
}

// Doctor contact interface for employee medical info
export interface DoctorContact {
  id: string;
  name: string;
  number: string;
}

export interface EmployeePermissions {
  isAdmin: boolean; // Full access to everything
  canDoAssessment: boolean; // Can fill out on-site forms
  canCreateQuotes: boolean; // Can build quotes
  canExecuteJob: boolean; // Can see job execution tab
  canInvoice: boolean; // Can generate invoices
  canViewReports: boolean; // Can access reports tab
  canManageEmployees: boolean; // Can add/edit other employees
  canEditSiteContent: boolean; // Can change website text/images
}

// Employee interface
export interface Employee {
  id: string;
  profileImage: string | null;
  fullName: string;
  idNumber: string;
  email: string;
  tel: string;
  jobTitle: string;
  startDate: string; // ISO date string
  loginName: string;
  pin: string; // Hashed in a real app, here plain for simplicity
  allergies?: string;
  doctorsNumbers: DoctorContact[];
  medicalIssues?: string;
  documents: Document[];
  permissions: EmployeePermissions; // Granular permissions
}

// Location/Shop interface
export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isHeadOffice: boolean;
  image: string | null;
}

export interface BookingModalConfig {
  headerTitle: string;
  headerSubtitle: string;
  stepServiceTitle: string;
  stepDateTitle: string;
  stepDetailsTitle: string;
  successTitle: string;
  successMessage: string;
  termsText?: string; // Footer terms text
}

// --- JOB CARD SYSTEM TYPES ---

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Archived';
}

export interface Checkpoint {
  id: string;
  code: string; // Auto-generated: CHK-YYYYMMDD-XXX
  area: string;
  notes: string; // Assessment notes
  treatmentNotes?: string; // Notes added during execution
  pestType: string;
  severity: 'Low' | 'Medium' | 'High';
  photos: string[]; // Assessment photos
  servicePhotos?: string[]; // Proof of treatment photos
  timestamp: string; // When the checkpoint was recorded
  isTreated: boolean; // True when technician finishes
  verifiedCode?: string; // The code entered by technician to verify location
}

// Quote Line Item
export interface QuoteLineItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number; // Calculated: qty * unitPrice
}

export interface JobQuote {
  lineItems: QuoteLineItem[];
  subtotal: number;
  vatRate: number; // e.g., 0.15 for 15%
  total: number; // subtotal + (subtotal * vatRate)
  notes: string; // General quote notes
  generatedDate?: string;
}

export interface JobInvoice {
  invoiceNumber: string;
  generatedDate: string;
  dueDate: string;
  lineItems: { description: string; amount: number }[]; // Can use QuoteLineItem fields if needed
  subtotal: number;
  vat: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid';
  notes: string;
}

export type JobStatus = 
  | 'Assessment'       // Initial site visit, gathering checkpoints
  | 'Quote_Builder'    // Assessment done, creating price
  | 'Quote_Sent'       // Waiting for client
  | 'Job_Scheduled'    // Quote Accepted, ready for tech
  | 'Job_In_Progress'  // Tech is on site treating
  | 'Job_Review'       // Tech done, Admin reviewing
  | 'Invoiced'         // Bill sent
  | 'Completed';       // Paid and closed

export interface JobCard {
  id: string;
  refNumber: string; // Auto-generated
  bookingId?: string; // Linked booking if applicable
  
  // Client Details
  clientName: string;
  // Structured address
  clientAddressDetails: {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  };
  contactNumber: string;
  contactNumberAlt?: string; // Second contact number
  email: string;
  propertyType: 'Residential' | 'Business'; // Updated to match request
  clientCompanyName?: string; // Optional client company name
  clientVatNumber?: string; // Optional client VAT number
  clientRegNumber?: string; // Optional client registration number
  
  // Dates & Techs
  assessmentDate: string;
  serviceDate?: string;
  technicianId: string; // Link to Employee
  
  // Data
  selectedServices: string[]; // IDs of services
  checkpoints: Checkpoint[];
  isFirstTimeService: boolean; // Toggle to show codes for sticker setup
  siteAccessCodes?: string; // For gate codes etc
  billingNotes?: string; // Internal billing notes
  
  // Stages Data
  treatmentRecommendation: string;
  quote: JobQuote;
  invoice?: JobInvoice;
  
  // Signatures
  clientSignature?: string; // URL or base64
  technicianSignature?: string;
  
  status: JobStatus;
  
  // History log for reports
  history: { date: string; action: string; user: string }[];
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode?: string;
}

export interface CreatorWidgetConfig {
  logo: string;
  whatsappIcon: string;
  emailIcon: string;
  background: string;
  slogan: string;
  ctaText: string;
}

// Social Link Interface
export interface SocialLink {
    id: string;
    name: string;
    icon: string;
    url: string;
}

export interface ContentState {
  company: {
    name: string;
    regNumber?: string;
    vatNumber?: string;
    phone: string;
    email: string;
    address: string;
    logo: string | null;
    yearsExperience: number;
    socials: SocialLink[]; // Updated to dynamic array
    hours: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
  };
  bankDetails: BankDetails; // Company bank details
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string; // Social share image
    ogTitle?: string; // 
    ogDescription?: string; // 
    canonicalUrl?: string; // 
    robotsDirective?: string; // e.g. "index, follow"
    structuredDataJSON?: string; // JSON-LD schema
  };
  hero: {
    headline: string;
    subheadline: string;
    buttonText: string;
    bgImage: string | null;
    overlayOpacity: number;
    mediaType: 'static' | 'imageCarousel' | 'video';
    mediaImages: string[];
    mediaVideo: string | null;
    carouselInterval: number;
  };
  about: {
    title: string;
    text: string;
    missionTitle: string;
    missionText: string;
    ownerImage: string | null;
    items: AboutItem[];
  };
  services: ServiceItem[];
  whyChooseUs: {
    title: string;
    subtitle: string;
    items: WhyChooseUsItem[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  serviceArea: {
    title: string;
    description: string;
    towns: string[];
    mapImage: string | null;
    mapEmbedUrl?: string; // For iframe maps
  };
  safety: {
    title: string;
    description: string;
    badge1: string;
    badge1IconName: string; // Icon for badge 1
    badge2: string;
    badge2IconName: string; // Icon for badge 2
    badge3: string;
    badge3IconName: string; // Icon for badge 3
    certificates: string[]; // Updated to string array
  };
  bookCTA: {
    title: string;
    subtitle: string;
    buttonText: string;
    bgImage?: string; // Background image for CTA
  };
  bookingModal: BookingModalConfig; // Editable booking modal text
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    mapEmbedUrl?: string; // Google Maps Embed URL
  };
  creatorWidget: CreatorWidgetConfig; // Config for creator widget
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  employees: Employee[];
  locations: Location[];
  bookings: Booking[]; // Incoming quotes
  jobCards: JobCard[]; // Job cards
}

export type AdminMainTab = 'homeLayout' | 'servicesArea' | 'companyInfo' | 'work' | 'creator';
export type AdminSubTab = 
  'systemGuide' | 'hero' | 'about' | 'whyChooseUs' | 'process' | 'safety' | 'cta' |
  'servicesList' | 'serviceAreaMap' |
  'companyDetails' | 'contactPage' | 'faqs' | 'seo' | 'employeeDirectory' |
  'jobs' | 'inquiries' | 
  'creatorSettings' | 'deploymentGuide';

// AdminDashboardProps interface
export interface AdminDashboardProps {
  onLogout: () => void;
  loggedInUser: Employee | null;
}