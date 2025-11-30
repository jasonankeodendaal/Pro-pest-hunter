
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContentState, ServiceItem, WhyChooseUsItem, ProcessStep, AboutItem, Employee, Location, FAQItem, Booking, JobCard, TestimonialItem, BankDetails } from '../types';

// Helper to get the current API URL (Local override > Env Var > Localhost)
const getApiUrl = () => {
    return localStorage.getItem('custom_api_url') || (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
};

const defaultState: ContentState = {
  company: {
    name: "Pro Pest Hunters",
    regNumber: "2015/123456/07",
    vatNumber: "4010123456",
    phone: "+27 13 752 4899",
    email: "info@propesthunters.co.za",
    address: "Unit 4, Rapid Falls Industrial Park, Riverside, Nelspruit, 1200",
    logo: "https://i.ibb.co/zHBzVwRV/image.png",
    yearsExperience: 18,
    socials: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
    hours: { weekdays: "07:30 - 17:00", saturday: "08:00 - 13:00", sunday: "Closed" }
  },
  bankDetails: { 
      bankName: "FNB", 
      accountName: "Pro Pest Hunters Pty Ltd", 
      accountNumber: "6289 4512 300", 
      branchCode: "250 655" 
  },
  seo: { 
      metaTitle: "Pro Pest Hunters | Best Pest Control in Nelspruit & Lowveld", 
      metaDescription: "Professional pest control services in Nelspruit, White River & Barberton. Safe for pets & families. Termites, Ants, Roaches. Get a free quote today!", 
      keywords: "pest control nelspruit, pest control white river, termite treatment, cockroach removal, exterminator lowveld, pro pest hunters", 
      ogImage: "https://images.unsplash.com/photo-1588615419996-53d937a0a09d?auto=format&fit=crop&q=80&w=1200",
      ogTitle: "Pro Pest Hunters - Expert Pest Control",
      ogDescription: "Guaranteed results against termites, ants, and roaches. Serving the Lowveld since 2006.",
      canonicalUrl: "https://www.propesthunters.co.za",
      robotsDirective: "index, follow",
      structuredDataJSON: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Pro Pest Hunters",
          "image": "https://i.ibb.co/zHBzVwRV/image.png",
          "telephone": "+27137524899",
          "address": {
              "@type": "PostalAddress",
              "streetAddress": "Unit 4, Rapid Falls Industrial Park",
              "addressLocality": "Nelspruit",
              "addressRegion": "Mpumalanga",
              "postalCode": "1200",
              "addressCountry": "ZA"
          },
          "priceRange": "$$"
      }, null, 2)
  },
  hero: { 
      headline: "The Lowveld’s #1 Defense Against Pests.", 
      subheadline: "Safe for Families. Lethal for Pests.", 
      buttonText: "Get Quote", 
      bgImage: null, 
      overlayOpacity: 60, 
      mediaType: 'video', 
      mediaImages: [], 
      mediaVideo: "https://cdn.pixabay.com/video/2020/05/25/40133-424930159_large.mp4", 
      carouselInterval: 3000 
  },
  about: { 
      title: "Protecting Lowveld Homes Since 2006", 
      text: "Born in the heart of Mpumalanga, Pro Pest Hunters began with a single bakkie and a mission to provide ethical, environmentally responsible pest control. Today, we are the region's most trusted partner for residential, commercial, and agricultural pest management.", 
      missionTitle: "Our Mission", 
      missionText: "To safeguard health and property through advanced Integrated Pest Management (IPM) techniques.", 
      ownerImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800", 
      items: [{ text: "Owner Managed", iconName: "Users" }, { text: "Eco Friendly", iconName: "Leaf" }, { text: "SABS Approved", iconName: "CheckCircle2" }] 
  },
  services: [
        { 
            id: 'srv-01', 
            title: 'Termite Defense', 
            description: 'Complete eradication of subterranean and harvester termites.', 
            fullDescription: 'Termites cause billions in damage annually. Our localized drill-and-inject treatment creates a chemical barrier around your foundation, preventing entry for up to 5 years. We also treat lawns for harvester termites that destroy gardens.',
            details: ['5 Year Written Guarantee', 'Foundation Drilling', 'Lawn Treatment', 'Pre-Construction Soil Poisoning'], 
            iconName: 'Bug', 
            visible: true, 
            featured: true,
            price: 'From R1,800',
            image: "https://images.unsplash.com/photo-1627931818298-251f0b093375?auto=format&fit=crop&q=80&w=800"
        },
        { 
            id: 'srv-02', 
            title: 'Cockroach Flush', 
            description: 'Eliminate German and American roaches from kitchens and drains.', 
            fullDescription: 'We use a 3-stage attack: A flushing agent to drive them out, a residual spray for long-term killing, and pheromone gels to target the nests. Safe for food preparation areas when protocols are followed.',
            details: ['Odorless Gel Options', 'Drain Fogging', 'Pet Safe', '3-Month Warranty'], 
            iconName: 'Zap', 
            visible: true, 
            featured: true,
            price: 'From R950',
            image: "https://images.unsplash.com/photo-1627373809657-37b58580252e?auto=format&fit=crop&q=80&w=800"
        },
        { 
            id: 'srv-03', 
            title: 'Rodent Control', 
            description: 'Rat and mouse baiting stations for homes and warehouses.', 
            fullDescription: 'Rodents carry disease and destroy wiring. We deploy tamper-proof bait stations containing single-feed wax blocks. These are secured so pets cannot access them. We also offer advice on rodent-proofing your building.',
            details: ['Tamper-Proof Boxes', 'External Perimeter', 'Roof Void Treatment', 'Monitoring Service'], 
            iconName: 'Rat', 
            visible: true, 
            featured: false,
            price: 'From R1,200',
            image: "https://plus.unsplash.com/premium_photo-1664303387813-91e84db95c64?auto=format&fit=crop&q=80&w=800"
        },
        { 
            id: 'srv-04', 
            title: 'Ant Management', 
            description: 'Stop sugar ants and garden ants from invading your home.', 
            fullDescription: 'Ants are persistent. Our perimeter spray creates a "no-go" zone around your house. For internal nests, we use undetectable bait granules that workers carry back to the queen, destroying the colony from within.',
            details: ['Internal & External', 'Lawn Spraying', 'Queen Elimination', 'Seasonal Treatment'], 
            iconName: 'Flower2', 
            visible: true, 
            featured: false,
            price: 'From R850',
            image: "https://images.unsplash.com/photo-1596566678604-585805400569?auto=format&fit=crop&q=80&w=800"
        },
        { 
            id: 'srv-05', 
            title: 'Bed Bug Heat Treatment', 
            description: 'The only sure way to kill bed bugs and their eggs.', 
            fullDescription: 'Chemicals often fail against modern bed bugs. We wash linens and treat mattresses and base sets with specialized chemical applications and steam heat where applicable to ensure 100% eradication.',
            details: ['Mattress Treatment', 'Base Set Injection', 'Egg Destruction', 'Discreet Service'], 
            iconName: 'BedDouble', 
            visible: true, 
            featured: false,
            price: 'Quote on Inspection',
            image: "https://images.unsplash.com/photo-1505693416388-b0346efee535?auto=format&fit=crop&q=80&w=800"
        },
        { 
            id: 'srv-06', 
            title: 'Commercial Hygiene', 
            description: 'HACCP compliant pest control for restaurants and hotels.', 
            fullDescription: 'We provide the files, bait stations, fly units, and documentation required for health inspections. Monthly servicing ensures you never have a pest breakout that affects your reputation.',
            details: ['Health Inspector Files', 'Monthly Contracts', 'Fly Control Units', 'Audit Ready'], 
            iconName: 'Building', 
            visible: true, 
            featured: false,
            price: 'Contract Based',
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800"
        },
            { 
            id: 'srv-07', 
            title: 'Mosquito Fogging', 
            description: 'Reduce mosquito populations for outdoor events or wet seasons.', 
            fullDescription: 'Ideal for weddings, lodges, or homes near water. We use thermal fogging to knock down adult mosquitoes and larvicides in standing water to prevent breeding.',
            details: ['Thermal Fogging', 'Larvicide Treatment', 'Event Preparation', 'Malaria Prevention'], 
            iconName: 'CloudRain', 
            visible: true, 
            featured: false,
            price: 'From R1,500',
            image: "https://images.unsplash.com/photo-1563384358-15c0d2979262?auto=format&fit=crop&q=80&w=800"
        },
        { 
            id: 'srv-08', 
            title: 'Wood Borer Beetle', 
            description: 'Treatment for furniture and structural timber.', 
            fullDescription: 'Beetles can destroy roof trusses and antique furniture. We offer injection treatments and surface spraying to penetrate wood and kill larvae.',
            details: ['Certificate of Clearance', 'Roof Truss Treatment', 'Furniture Injection', 'Long Term Protection'], 
            iconName: 'Trees', 
            visible: true, 
            featured: false,
            price: 'Quote on Inspection',
            image: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?auto=format&fit=crop&q=80&w=800"
        }
  ],
  whyChooseUs: { 
      title: "Why Choose Us", 
      subtitle: "The Pro Pest Difference", 
      items: [
          { title: "Registered Pros", text: "All staff are registered with the Dept of Agriculture (P-Registration).", iconName: "Award" },
          { title: "Rapid Response", text: "Same-day service for emergencies in Nelspruit & White River.", iconName: "Clock" },
          { title: "Guarantee", text: "If the pests come back within the warranty period, so do we.", iconName: "Shield" },
          { title: "Pet Safe", text: "Advanced gels safe for loved ones.", iconName: "HeartHandshake" },
          { title: "Competitive Pricing", text: "Top-tier service without the corporate price tag.", iconName: "DollarSign" },
          { title: "Local Knowledge", text: "We know the Lowveld bugs better than anyone.", iconName: "MapPin" }
      ] 
  },
  process: { 
      title: "Our Process", 
      subtitle: "Simple & Effective", 
      steps: [
          { step: 1, title: "Inspection", description: "Identify the pest and root cause.", iconName: "Search" },
          { step: 2, title: "Custom Plan", description: "Select the safest effective treatment.", iconName: "FileText" },
          { step: 3, title: "Treatment", description: "Surgical application of solutions.", iconName: "Zap" },
          { step: 4, title: "Prevention", description: "Seal entry points and monitor.", iconName: "Shield" }
      ] 
  },
  serviceArea: { 
      title: "Areas We Serve", 
      description: "Proudly covering the entire Lowveld and Escarpment region.", 
      towns: ["Nelspruit", "White River", "Barberton", "Hazyview", "Malelane", "Komatipoort", "Sabie", "Lydenburg"], 
      mapImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mpumalanga_Municipalities_2016_Ehlanzeni.svg/800px-Mpumalanga_Municipalities_2016_Ehlanzeni.svg.png" 
  },
  safety: { 
      title: "Safety Compliance", 
      description: "We adhere to the strictest safety standards. All chemicals are SABS approved and applied according to Act 36 of 1947.", 
      badge1: "Pet Safe", 
      badge2: "Eco Friendly", 
      badge3: "Registered", 
      certificates: [
          "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/SABS_logo.svg/1200px-SABS_logo.svg.png",
          "https://sapca.org.za/wp-content/uploads/2020/02/sapca-logo.png"
      ] 
  },
  bookCTA: { title: "Ready to be Pest Free?", subtitle: "Book today.", buttonText: "Book Now", bgImage: undefined },
  bookingModal: { headerTitle: "Book a Service", headerSubtitle: "Select a service.", stepServiceTitle: "Service", stepDateTitle: "Date", stepDetailsTitle: "Details", successTitle: "Done", successMessage: "Confirmed.", termsText: "T&Cs apply." },
  contact: { title: "Contact Us", subtitle: "Get in touch", formTitle: "Message Us", mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.6789!2d30.9694!3d-25.4753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI4JzMxLjEiUyAzMMKwNTgnMTAuMCJF!5e0!3m2!1sen!2sza!4v1600000000000!5m2!1sen!2sza" },
  creatorWidget: {
    logo: "https://i.ibb.co/TDC9Xn1N/JSTYP-me-Logo.png",
    whatsappIcon: "https://i.ibb.co/Z1YHvjgT/image-removebg-preview-1.png",
    emailIcon: "https://i.ibb.co/r2HkbjLj/image-removebg-preview-2.png",
    background: "https://i.ibb.co/dsh2c2hp/unnamed.jpg",
    slogan: "Jason's Solution To Your Problems, Yes me!",
    ctaText: "Need a Website, Mobile App or custom tool? Get in touch."
  },
  faqs: [
       { id: 'faq-1', question: "Is the treatment safe for my pets?", answer: "Yes. For most treatments (gel, bait stations), pets can remain inside. For spray treatments, we recommend keeping pets outside for 2 hours." },
       { id: 'faq-2', question: "Do I need to empty my kitchen cupboards?", answer: "Generally, no. We use precision gel baits that are applied to hinges and corners." },
       { id: 'faq-3', question: "How long does a termite treatment last?", answer: "Our drill-and-inject termite treatments come with a 5-year guarantee." },
       { id: 'faq-4', question: "Do you offer warranties?", answer: "Yes. General pest control usually carries a 3-month warranty." },
       { id: 'faq-5', question: "Are you registered?", answer: "Absolutely. All our technicians are registered with the Department of Agriculture." }
  ],
  testimonials: [
       { id: 'test-1', name: "Sarah Jenkins", location: "White River", text: "Absolutely fantastic service. Had a terrible ant problem in the kitchen. Gone within 2 days.", rating: 5 },
       { id: 'test-2', name: "Mike Van Der Merwe", location: "Nelspruit", text: "Called them for a termite inspection. Thorough and honest.", rating: 5 },
       { id: 'test-3', name: "The Olive Garden B&B", location: "Barberton", text: "We use Pro Pest Hunters for our monthly hospitality contract.", rating: 5 }
  ],
  employees: [
        {
            id: 'emp-001',
            fullName: 'Ruaan Van Wyk',
            email: 'ruaan@propesthunters.co.za', 
            pin: '2024',            
            loginName: 'ruaan',
            jobTitle: 'Owner / Master Technician',
            permissions: { isAdmin: true, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true },
            idNumber: '8501015000080',
            tel: '082 555 1234',
            startDate: '2006-05-01',
            doctorsNumbers: [], documents: [], profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 'emp-002',
            fullName: 'Sarah Johnson',
            email: 'admin@propesthunters.co.za', 
            pin: '1234',            
            loginName: 'sarah',
            jobTitle: 'Office Manager',
            permissions: { isAdmin: true, canDoAssessment: false, canCreateQuotes: true, canExecuteJob: false, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true },
            idNumber: '9002020000080',
            tel: '013 752 4899',
            startDate: '2015-03-15',
            doctorsNumbers: [], documents: [], profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
        }
  ],
  locations: [
      { id: 'loc-1', name: "Nelspruit HQ", address: "Unit 4, Rapid Falls Industrial Park", phone: "013 752 4899", email: "nelspruit@propesthunters.co.za", isHeadOffice: true, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
      { id: 'loc-2', name: "White River Branch", address: "Shop 12, Casterbridge Lifestyle Centre", phone: "013 750 1234", email: "whiteriver@propesthunters.co.za", isHeadOffice: false, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800" }
  ],
  bookings: [],
  jobCards: [
        { 
            id: 'job-001', refNumber: 'JOB-24010', clientName: 'Mr. J. Smith', 
            clientAddressDetails: { street: '12 Impala Street', suburb: 'West Acres', city: 'Nelspruit', province: 'MP', postalCode: '1200' },
            contactNumber: '082 111 2222', email: 'john@gmail.com', propertyType: 'Residential', assessmentDate: new Date().toISOString(), technicianId: 'emp-001', selectedServices: ['srv-02'], checkpoints: [], isFirstTimeService: true, treatmentRecommendation: 'Cockroach flush needed in kitchen.', quote: { lineItems: [], subtotal: 950, vatRate: 0.15, total: 1092.50, notes: '' }, status: 'Job_Scheduled', history: [] 
        }
  ]
};

interface ContentContextType {
  content: ContentState;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  updateContent: (section: keyof ContentState, data: any) => void;
  updateService: (services: ServiceItem[]) => void;
  updateWhyChooseUsItems: (items: WhyChooseUsItem[]) => void;
  updateProcessSteps: (steps: ProcessStep[]) => void;
  updateAboutItems: (items: AboutItem[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employeeId: string, employeeData: Partial<Employee>) => void;
  deleteEmployee: (employeeId: string) => void;
  updateLocations: (locations: Location[]) => void;
  updateFaqs: (faqs: FAQItem[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  addJobCard: (job: JobCard) => void;
  updateJobCard: (id: string, data: Partial<JobCard>) => void;
  deleteJobCard: (id: string) => void;
  resetSystem: () => Promise<void>;
  clearSystem: () => Promise<void>;
  downloadBackup: () => void;
  restoreBackup: (file: File) => Promise<boolean>;
  dbType: 'sqlite' | 'postgres' | 'unknown';
  connectionError: string | null;
  isConnecting: boolean;
  retryConnection: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Define API helper using a dynamic getter for URL
const getApiHelper = () => ({
    post: (endpoint: string, data: any) => fetch(`${getApiUrl()}${endpoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).catch(err => console.error(`API POST Error (${endpoint}):`, err)),
    
    delete: (endpoint: string) => fetch(`${getApiUrl()}${endpoint}`, {
        method: 'DELETE'
    }).catch(err => console.error(`API DELETE Error (${endpoint}):`, err))
});

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentState>(defaultState);
  const [apiUrl, setApiUrlState] = useState(getApiUrl());
  const [dbType, setDbType] = useState<'sqlite' | 'postgres' | 'unknown'>('unknown');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const api = getApiHelper(); // Helper for current render cycle

  // 1. LOAD DATA FROM SERVER ON MOUNT
  const loadData = () => {
      const url = getApiUrl();
      setIsConnecting(true);
      setConnectionError(null);
      console.log(`Connecting to: ${url}`);
      
      fetch(`${url}/api/init`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Server returned ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .then(serverData => {
            if(serverData) {
                // UPDATE DB TYPE STATUS
                if (serverData.meta) {
                    setDbType(serverData.meta.databaseType);
                }
                setContent(prev => ({
                    ...prev,
                    ...serverData
                }));
                setIsConnecting(false);
            }
        })
        .catch(e => {
            console.error("FAILED TO CONNECT TO SERVER:", e);
            setConnectionError(e.message || "Failed to fetch");
            setIsConnecting(false);
        });
  };

  useEffect(() => {
    loadData();
  }, [apiUrl]);

  const retryConnection = () => {
      loadData();
  };

  const setApiUrl = (newUrl: string) => {
      let clean = newUrl.replace(/\/$/, "").trim();
      // Auto-prefix if missing
      if (!clean.startsWith('http')) {
          clean = `https://${clean}`;
      }
      // If localhost but marked as https, fix it to http (optional safe-guard, though some use https locally)
      // We will assume https for everything else
      if (clean.includes('localhost') && clean.startsWith('https://')) {
          // Allow https for localhost if user typed it, but if they just typed 'localhost:3000' we should prob default to http
          // But strict replacing might be annoying. Let's just ensure protocol exists.
      } else if (clean.includes('localhost') && !clean.startsWith('http')) {
          clean = `http://${clean}`;
      }

      localStorage.setItem('custom_api_url', clean);
      setApiUrlState(clean);
      window.location.reload(); // Force reload to ensure all components and hooks use new URL
  };

  // --- GENERIC SETTINGS UPDATER ---
  const updateContent = (section: keyof ContentState, partialData: any) => {
    setContent(prev => {
        const updatedSection = { ...prev[section], ...partialData };
        api.post(`/api/settings/${section}`, updatedSection);
        return {
            ...prev,
            [section]: updatedSection
        };
    });
  };

  // --- SPECIALIZED UPDATERS ---

  const updateService = (services: ServiceItem[]) => {
      setContent(prev => ({ ...prev, services }));
      api.post('/api/settings/services', services);
  };

  const updateWhyChooseUsItems = (items: WhyChooseUsItem[]) => {
      const newData = { ...content.whyChooseUs, items };
      setContent(prev => ({ ...prev, whyChooseUs: newData }));
      api.post('/api/settings/whyChooseUs', newData);
  };

  const updateProcessSteps = (steps: ProcessStep[]) => {
      const newData = { ...content.process, steps };
      setContent(prev => ({ ...prev, process: newData }));
      api.post('/api/settings/process', newData);
  };

  const updateAboutItems = (items: AboutItem[]) => {
      const newData = { ...content.about, items };
      setContent(prev => ({ ...prev, about: newData }));
      api.post('/api/settings/about', newData);
  };

  const updateFaqs = (faqs: FAQItem[]) => {
      setContent(prev => ({ ...prev, faqs }));
      api.post('/api/settings/faqs', faqs);
  };

  const updateLocations = (locations: Location[]) => {
      setContent(prev => ({ ...prev, locations }));
      api.post('/api/locations', locations);
  };

  // --- EMPLOYEE MANAGEMENT ---

  const addEmployee = (employee: Employee) => {
    setContent(prev => ({ ...prev, employees: [...prev.employees, employee] }));
    api.post('/api/employees', employee);
  };

  const updateEmployee = (employeeId: string, employeeData: Partial<Employee>) => {
    setContent(prev => {
        const updatedList = prev.employees.map(emp => 
            emp.id === employeeId ? { ...emp, ...employeeData } : emp
        );
        const updatedEmployee = updatedList.find(e => e.id === employeeId);
        if (updatedEmployee) api.post('/api/employees', updatedEmployee);
        return { ...prev, employees: updatedList };
    });
  };

  const deleteEmployee = (employeeId: string) => {
    setContent(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== employeeId)
    }));
    api.delete(`/api/employees/${employeeId}`);
  };

  // --- BOOKINGS ---

  const addBooking = (booking: Booking) => {
    setContent(prev => ({ ...prev, bookings: [booking, ...prev.bookings] }));
    api.post('/api/bookings', booking);
  };

  const updateBooking = (id: string, data: Partial<Booking>) => {
    setContent(prev => {
        const updatedList = prev.bookings.map(b => b.id === id ? { ...b, ...data } : b);
        const updatedBooking = updatedList.find(b => b.id === id);
        if(updatedBooking) api.post('/api/bookings', updatedBooking);
        return { ...prev, bookings: updatedList };
    });
  };

  // --- JOB CARDS ---

  const addJobCard = (job: JobCard) => {
    setContent(prev => ({ ...prev, jobCards: [job, ...prev.jobCards] }));
    api.post('/api/jobs', job);
  };

  const updateJobCard = (id: string, data: Partial<JobCard>) => {
    setContent(prev => {
        const updatedList = prev.jobCards.map(j => j.id === id ? { ...j, ...data } : j);
        const updatedJob = updatedList.find(j => j.id === id);
        if(updatedJob) api.post('/api/jobs', updatedJob);
        return { ...prev, jobCards: updatedList };
    });
  };

  const deleteJobCard = (id: string) => {
    setContent(prev => ({ ...prev, jobCards: prev.jobCards.filter(j => j.id !== id) }));
    api.delete(`/api/jobs/${id}`);
  };

  // --- SYSTEM TOOLS ---

  const resetSystem = async () => {
    await api.post('/api/admin/seed', {});
    loadData();
  };

  const clearSystem = async () => {
    await api.post('/api/admin/nuke', {});
    setContent({ ...defaultState, employees: [], jobCards: [], bookings: [], locations: [], services: [], testimonials: [], faqs: [] });
    loadData(); 
  };

  const downloadBackup = () => {
     window.open(`${getApiUrl()}/api/admin/backup`, '_blank');
  };

  const restoreBackup = async (file: File) => {
      const formData = new FormData();
      formData.append('backupFile', file);
      
      try {
          const res = await fetch(`${getApiUrl()}/api/admin/restore`, {
              method: 'POST',
              body: formData
          });
          if (res.ok) {
              loadData();
              return true;
          }
      } catch (e) {
          console.error(e);
      }
      return false;
  };

  return (
    <ContentContext.Provider value={{
      content, apiUrl, setApiUrl, updateContent, updateService, updateWhyChooseUsItems,
      updateProcessSteps, updateAboutItems, addEmployee, updateEmployee,
      deleteEmployee, updateLocations, updateFaqs,
      addBooking, updateBooking, addJobCard, updateJobCard, deleteJobCard,
      resetSystem, clearSystem, downloadBackup, restoreBackup, dbType,
      connectionError, isConnecting, retryConnection
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
