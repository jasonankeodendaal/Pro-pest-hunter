
import { LucideIcon } from 'lucide-react';

export interface AssessmentTemplateStep {
  id: string;
  areaName: string;
  defaultPest: string;
  defaultTask: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  details: string[];
  iconName: string;
  price?: string;
  image?: string | null;
  visible: boolean;
  featured: boolean;
  assessmentTemplate?: AssessmentTemplateStep[]; // New: Pre-defined steps for assessment
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

export interface AboutItem {
  id: string;
  title: string; 
  description: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface Document {
  id: string;
  type: 'CV' | 'Certificate' | 'Training' | 'Other';
  name: string;
  fileUrl: string;
  description?: string;
}

export interface DoctorContact {
  id: string;
  name: string;
  number: string;
}

export interface EmployeePermissions {
  isAdmin: boolean;
  canDoAssessment: boolean;
  canCreateQuotes: boolean;
  canExecuteJob: boolean;
  canInvoice: boolean;
  canViewReports: boolean;
  canManageEmployees: boolean;
  canEditSiteContent: boolean;
}

export interface Employee {
  id: string;
  profileImage: string | null;
  fullName: string;
  idNumber: string;
  email: string;
  tel: string;
  jobTitle: string;
  startDate: string;
  loginName: string;
  pin: string;
  allergies?: string;
  doctorsNumbers: DoctorContact[];
  medicalIssues?: string;
  documents: Document[];
  permissions: EmployeePermissions;
}

export interface ClientUser {
  id: string;
  email: string;
  pin: string;
  fullName: string;
  companyName?: string;
  phone: string;
  address: string;
  profileImage?: string | null;
  notes?: string;
  linkedEmails?: string[];
}

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
  termsText?: string;
  showPrices: boolean; // New
  showTimeSlots: boolean; // New
  maintenanceMode: boolean; // New
}

// --- INVENTORY SYSTEM ---

export interface InventoryItem {
    id: string;
    name: string;
    category: 'Chemical' | 'Equipment' | 'Consumable' | 'PPE';
    unit: 'ml' | 'L' | 'g' | 'kg' | 'unit' | 'box';
    costPerUnit: number; // Cost price per unit (e.g. 0.50 per ml)
    retailPricePerUnit: number; // Selling/Quoting price per unit
    stockLevel: number; // Current stock
    minStockLevel: number; // Alert level
    batchNumber?: string;
    expiryDate?: string;
    activeIngredient?: string; // For Chemicals
    registrationNumber?: string; // L-Number for chemicals
    description?: string;
}

export interface MaterialUsage {
    id: string;
    inventoryItemId: string;
    itemName: string;
    qtyUsed: number;
    unit: string;
    cost: number; // Captured at time of usage
    date: string;
    // Advanced Tracking
    batchNumber?: string;
    applicationMethod?: 'Spray' | 'Gel' | 'Dust' | 'Bait Station' | 'Gas' | 'Fogging';
    dilutionRate?: string; // e.g. "5ml/1L"
    targetPest?: string;
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

export interface CheckpointTask {
    id: string;
    description: string;
    completed: boolean;
    timestamp?: string;
}

export interface Checkpoint {
  id: string;
  code: string;
  area: string;
  notes: string;
  
  // Assessment Details
  rootCause?: string;
  accessNotes?: string;
  recommendation?: string;
  infestationLevel?: 'Trace' | 'Low' | 'Medium' | 'High' | 'Severe';
  actionPriority?: 'Routine' | 'Urgent' | 'Critical';

  // Execution Details
  treatmentNotes?: string;
  chemicalUsed?: string;
  pestType: string;
  severity: 'Low' | 'Medium' | 'High';
  photos: string[];
  servicePhotos?: string[];
  timestamp: string;
  
  // Monitoring Data (For Bait Stations/Traps)
  monitorData?: {
      activity: 'None' | 'Low' | 'Medium' | 'High';
      baitCondition: 'Intact' | 'Moldy' | 'Consumed' | 'Missing';
      stationStatus: 'Secure' | 'Damaged' | 'Blocked';
  };
  
  // Tasks Checklist (New Request)
  tasks: CheckpointTask[];

  // Verification Logic (Double Scan)
  scanStart?: string;
  scanEnd?: string;
  isTreated: boolean;
  verifiedCode?: string;
}

export interface QuoteLineItem {
  id: string;
  name: string;
  description?: string;
  qty: number;
  unitPrice: number;
  total: number;
  inventoryItemId?: string;
}

export interface JobQuote {
  lineItems: QuoteLineItem[];
  subtotal: number;
  vatRate: number;
  total: number;
  notes: string;
  
  // Quote Details
  depositType?: 'None' | 'Percentage' | 'Fixed';
  depositValue?: number;
  depositRequired?: number;
  warranty?: string;
  validUntil?: string;
  estimatedDuration?: string;
  
  generatedDate?: string;
}

export interface JobInvoice {
  invoiceNumber: string;
  generatedDate: string;
  dueDate: string;
  lineItems: { description: string; amount: number }[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid';
  notes: string;
}

export type JobStatus = 
  | 'Assessment'
  | 'Quote_Builder'
  | 'Quote_Sent'
  | 'Job_Scheduled'
  | 'Job_In_Progress'
  | 'Job_Review'
  | 'Invoiced'
  | 'Completed'
  | 'Cancelled';

export interface PaymentRecord {
    method: 'Cash' | 'Card' | 'EFT' | 'Other';
    amount: number;
    date: string;
    reference?: string;
    notes?: string;
}

export interface RiskAssessment {
    petsRemoved: boolean;
    foodCovered: boolean;
    electricalHazards: boolean;
    waterTanksCovered: boolean;
    ventilationChecked: boolean;
    ppeRequired: boolean;
    notes?: string;
}

export interface WeatherConditions {
    temperature: string; // e.g. "24"
    windSpeed: string; // e.g. "10km/h" - Critical for outdoor spraying
    condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Windy';
}

export interface JobCard {
  id: string;
  refNumber: string;
  bookingId?: string;
  
  clientName: string;
  clientAddressDetails: {
    street: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  };
  contactNumber: string;
  contactNumberAlt?: string;
  email: string;
  propertyType: 'Residential' | 'Business';
  clientCompanyName?: string;
  clientVatNumber?: string;
  clientRegNumber?: string;
  
  assessmentDate: string;
  serviceDate?: string;
  technicianId: string;
  
  selectedServices: string[];
  checkpoints: Checkpoint[];
  isFirstTimeService: boolean;
  siteAccessCodes?: string;
  billingNotes?: string;
  
  equipmentNeeded?: string[];
  
  // Advanced Compliance Fields
  weather?: WeatherConditions;
  riskAssessment?: RiskAssessment;
  safetyChecklist?: string[]; // PPE Checklist acknowledged by tech
  
  materialUsage?: MaterialUsage[];

  ppeUsed?: string[];
  chemicalBatchNumbers?: string;
  timeStarted?: string;
  timeFinished?: string;
  
  treatmentRecommendation: string;
  quote: JobQuote;
  invoice?: JobInvoice;
  paymentRecord?: PaymentRecord;
  depositPaid?: number;
  
  jobCertificates?: string[]; // New: Uploaded certificates

  clientSignature?: string;
  technicianSignature?: string;
  
  status: JobStatus;
  
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
    socials: SocialLink[];
    hours: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
  };
  bankDetails: BankDetails;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    canonicalUrl?: string;
    robotsDirective?: string;
    structuredDataJSON?: string;
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
    mapEmbedUrl?: string;
  };
  safety: {
    title: string;
    description: string;
    badge1: string;
    badge1IconName: string;
    badge2: string;
    badge2IconName: string;
    badge3: string;
    badge3IconName: string;
    certificates: string[];
  };
  bookCTA: {
    title: string;
    subtitle: string;
    buttonText: string;
    bgImage?: string;
  };
  bookingModal: BookingModalConfig;
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    mapEmbedUrl?: string;
  };
  creatorWidget: CreatorWidgetConfig;
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  employees: Employee[];
  clientUsers: ClientUser[];
  locations: Location[];
  bookings: Booking[];
  jobCards: JobCard[];
  inventory: InventoryItem[];
}

export type AdminMainTab = 'homeLayout' | 'servicesArea' | 'companyInfo' | 'work' | 'creator';
export type AdminSubTab = 
  'systemGuide' | 'hero' | 'about' | 'whyChooseUs' | 'process' | 'safety' | 'cta' |
  'servicesList' | 'serviceAreaMap' |
  'companyDetails' | 'locations' | 'contactPage' | 'faqs' | 'seo' | 'employeeDirectory' |
  'jobs' | 'inquiries' | 'bookingSettings' | 'clients' | 'inventory' |
  'creatorSettings' | 'deploymentGuide';

export interface AdminDashboardProps {
  onLogout: () => void;
  loggedInUser: Employee | null;
}
