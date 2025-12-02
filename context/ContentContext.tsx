
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContentState, ServiceItem, WhyChooseUsItem, ProcessStep, AboutItem, Employee, Location, FAQItem, Booking, JobCard, TestimonialItem, BankDetails, SocialLink, ClientUser, InventoryItem } from '../types';

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
    socials: [
        { id: 'soc-1', name: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png', url: 'https://facebook.com' },
        { id: 'soc-2', name: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', url: 'https://instagram.com' }
    ],
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
      mediaVideo: "https://cdn.pixabay.com/video/2022/10/19/135658-761953702_large.mp4", 
      carouselInterval: 3000 
  },
  about: { 
      title: "Protecting Lowveld Homes Since 2006", 
      text: "Born in the heart of Mpumalanga, Pro Pest Hunters began with a single bakkie and a mission to provide ethical, environmentally responsible pest control. Today, we are the region's most trusted partner for residential, commercial, and agricultural pest management.", 
      missionTitle: "Our Mission", 
      missionText: "To safeguard health and property through advanced Integrated Pest Management (IPM) techniques.", 
      ownerImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800", 
      items: [
          { id: 'ab-1', title: "Owner Managed", description: "Direct oversight by our founder on major projects ensures the highest standards are maintained at all times.", iconName: "Users" }, 
          { id: 'ab-2', title: "Eco Friendly", description: "We prioritize biodegradable, pet-safe formulations that are tough on pests but gentle on the environment.", iconName: "Leaf" }, 
          { id: 'ab-3', title: "SABS Approved", description: "All our products meet strict SABS standards and comply fully with the Department of Agriculture regulations.", iconName: "CheckCircle2" }
      ] 
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
            image: "https://images.unsplash.com/photo-1627931818298-251f0b093375?auto=format&fit=crop&q=80&w=800",
            assessmentTemplate: [
                { id: 'ast-1', areaName: 'Perimeter Foundation', defaultPest: 'Subterranean Termite', defaultTask: 'Inspect for mud tunnels' },
                { id: 'ast-2', areaName: 'Roof Void', defaultPest: 'Termite / Borer', defaultTask: 'Check trusses for damage' },
                { id: 'ast-3', areaName: 'Garden / Soil', defaultPest: 'Harvester Termite', defaultTask: 'Locate nests' }
            ]
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
            image: "https://images.unsplash.com/photo-1627373809657-37b58580252e?auto=format&fit=crop&q=80&w=800",
            assessmentTemplate: [
                { id: 'ast-4', areaName: 'Kitchen Cupboards', defaultPest: 'German Cockroach', defaultTask: 'Check hinges for feces' },
                { id: 'ast-5', areaName: 'Fridge Motor', defaultPest: 'German Cockroach', defaultTask: 'Inspect warmth source' },
                { id: 'ast-6', areaName: 'Drains / Gully', defaultPest: 'American Cockroach', defaultTask: 'Fog drain system' }
            ]
        },
        // ... (Other services kept same, assessmentTemplate optional)
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
      badge1IconName: "Heart", 
      badge2: "Eco Friendly", 
      badge2IconName: "Leaf",    
      badge3: "Registered", 
      badge3IconName: "Award",   
      certificates: [
          "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/SABS_logo.svg/1200px-SABS_logo.svg.png",
          "https://sapca.org.za/wp-content/uploads/2020/02/sapca-logo.png"
      ] 
  },
  bookCTA: { title: "Ready to be Pest Free?", subtitle: "Book today.", buttonText: "Book Now", bgImage: undefined },
  bookingModal: { 
      headerTitle: "Book a Service", 
      headerSubtitle: "Select a service.", 
      stepServiceTitle: "Service", 
      stepDateTitle: "Date", 
      stepDetailsTitle: "Details", 
      successTitle: "Done", 
      successMessage: "Confirmed.", 
      termsText: "T&Cs apply.",
      showPrices: true,
      showTimeSlots: true,
      maintenanceMode: false
  },
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
            fullName: 'Ruaan de Lange',
            email: 'propesthunters@gmail.com', 
            pin: '2025',            
            loginName: 'ruaan',
            jobTitle: 'Company Owner',
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
  clientUsers: [],
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
  ],
  inventory: [
      { id: 'inv-1', name: 'Termidor SC', category: 'Chemical', unit: 'L', costPerUnit: 1200, retailPricePerUnit: 2400, stockLevel: 5, minStockLevel: 2, activeIngredient: 'Fipronil', registrationNumber: 'L-12345' },
      { id: 'inv-2', name: 'MaxForce Gel', category: 'Chemical', unit: 'g', costPerUnit: 150, retailPricePerUnit: 350, stockLevel: 20, minStockLevel: 5, activeIngredient: 'Imidacloprid', registrationNumber: 'L-54321' },
      { id: 'inv-3', name: 'Rodent Wax Blocks', category: 'Chemical', unit: 'kg', costPerUnit: 400, retailPricePerUnit: 800, stockLevel: 10, minStockLevel: 2, activeIngredient: 'Brodifacoum' },
      { id: 'inv-4', name: 'Bait Station (Tamper Proof)', category: 'Equipment', unit: 'unit', costPerUnit: 45, retailPricePerUnit: 95, stockLevel: 50, minStockLevel: 10 },
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
  
  // Client Management
  addClientUser: (client: ClientUser) => void;
  updateClientUser: (clientId: string, data: Partial<ClientUser>) => void;
  deleteClientUser: (clientId: string) => void;

  updateLocations: (locations: Location[]) => void;
  updateFaqs: (faqs: FAQItem[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  addJobCard: (job: JobCard) => void;
  updateJobCard: (id: string, data: Partial<JobCard>) => void;
  deleteJobCard: (id: string) => void;
  
  // Inventory Management
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

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
                
                // CRITICAL FIX: Sanitize 'socials' if it comes as object (Legacy Data)
                if (serverData.company && serverData.company.socials && !Array.isArray(serverData.company.socials)) {
                    const oldSocials = serverData.company.socials;
                    const newSocials = [];
                    if (oldSocials.facebook) newSocials.push({ id: 'fb', name: 'Facebook', url: oldSocials.facebook, icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' });
                    if (oldSocials.instagram) newSocials.push({ id: 'ig', name: 'Instagram', url: oldSocials.instagram, icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' });
                    if (oldSocials.linkedin) newSocials.push({ id: 'li', name: 'LinkedIn', url: oldSocials.linkedin, icon: 'https://cdn-icons-png.flaticon.com/512/3536/3536505.png' });
                    serverData.company.socials = newSocials;
                }
                
                // Fallback for missing arrays
                if (serverData.company && !serverData.company.socials) serverData.company.socials = [];
                if (!serverData.inventory) serverData.inventory = defaultState.inventory; // Default inventory if missing

                // Booking Modal Defaults
                if (serverData.bookingModal) {
                    if (serverData.bookingModal.showPrices === undefined) serverData.bookingModal.showPrices = true;
                    if (serverData.bookingModal.showTimeSlots === undefined) serverData.bookingModal.showTimeSlots = true;
                    if (serverData.bookingModal.maintenanceMode === undefined) serverData.bookingModal.maintenanceMode = false;
                }

                // Service Template Defaults
                if (serverData.services) {
                    serverData.services = serverData.services.map((s: ServiceItem) => ({
                        ...s,
                        assessmentTemplate: s.assessmentTemplate || []
                    }));
                }

                // MIGRATION FOR ABOUT ITEMS: Ensure ID exists
                if (serverData.about && serverData.about.items) {
                     serverData.about.items = serverData.about.items.map((item: any, i: number) => ({
                         ...item,
                         id: item.id || `ab-${Date.now()}-${i}`,
                         title: item.title || item.text, // Migrate text to title
                         description: item.description || '' // Ensure desc exists
                     }));
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
      if (!clean.startsWith('http')) clean = `https://${clean}`;
      if (clean.includes('localhost') && clean.startsWith('https://')) {
          // Keep https for local if user specified
      } else if (clean.includes('localhost') && !clean.startsWith('http')) {
          clean = `http://${clean}`;
      }
      localStorage.setItem('custom_api_url', clean);
      setApiUrlState(clean);
      window.location.reload(); 
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

  // --- CLIENT USER MANAGEMENT ---

  const addClientUser = (client: ClientUser) => {
    setContent(prev => ({ ...prev, clientUsers: [...prev.clientUsers, client] }));
    api.post('/api/clients', client);
  };

  const updateClientUser = (clientId: string, data: Partial<ClientUser>) => {
    setContent(prev => {
        const updatedList = prev.clientUsers.map(c => 
            c.id === clientId ? { ...c, ...data } : c
        );
        const updatedClient = updatedList.find(c => c.id === clientId);
        if (updatedClient) api.post('/api/clients', updatedClient);
        return { ...prev, clientUsers: updatedList };
    });
  };

  const deleteClientUser = (clientId: string) => {
    setContent(prev => ({
        ...prev,
        clientUsers: prev.clientUsers.filter(c => c.id !== clientId)
    }));
    api.delete(`/api/clients/${clientId}`);
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

  // --- INVENTORY MANAGEMENT ---

  const addInventoryItem = (item: InventoryItem) => {
      setContent(prev => {
          const newInventory = [...prev.inventory, item];
          api.post('/api/settings/inventory', newInventory);
          return { ...prev, inventory: newInventory };
      });
  };

  const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => {
      setContent(prev => {
          const newInventory = prev.inventory.map(i => i.id === id ? { ...i, ...data } : i);
          api.post('/api/settings/inventory', newInventory);
          return { ...prev, inventory: newInventory };
      });
  };

  const deleteInventoryItem = (id: string) => {
      setContent(prev => {
          const newInventory = prev.inventory.filter(i => i.id !== id);
          api.post('/api/settings/inventory', newInventory);
          return { ...prev, inventory: newInventory };
      });
  };

  // --- SYSTEM TOOLS ---

  const resetSystem = async () => {
    await api.post('/api/admin/seed', {});
    loadData();
  };

  const clearSystem = async () => {
    await api.post('/api/admin/nuke', {});
    setContent({ ...defaultState, employees: [], jobCards: [], bookings: [], locations: [], services: [], testimonials: [], faqs: [], clientUsers: [] });
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
      deleteEmployee, addClientUser, updateClientUser, deleteClientUser, 
      updateLocations, updateFaqs,
      addBooking, updateBooking, addJobCard, updateJobCard, deleteJobCard,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
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