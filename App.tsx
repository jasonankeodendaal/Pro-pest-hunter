
import React, { useState, useEffect } from 'react';
import { ContentProvider } from './context/ContentContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessAndArea } from './components/ProcessAndArea';
import { Safety } from './components/Safety';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientPortal } from './components/ClientPortal'; 
import { ServicesPage } from './components/ServicesPage';
import { AboutPage } from './components/AboutPage';
import { ProcessPage } from './components/ProcessPage';
import { ContactPage } from './components/ContactPage';
import { CreatorWidget } from './components/CreatorWidget';
import { PublicJobViewer } from './components/PublicJobViewer'; 
import { Employee, ClientUser } from './types';

// AppContent represents the home page sections
const Home: React.FC<{ onBookClick: () => void; onAdminClick: () => void; navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void; }> = ({ onBookClick, onAdminClick, navigateTo }) => {
  return (
    <>
      <Navigation onBookClick={onBookClick} onAdminClick={onAdminClick} navigateTo={navigateTo} />
      <Hero navigateTo={navigateTo} />
      <About />
      <WhyChooseUs />
      <ProcessAndArea />
      <Safety />
      {/* Hide Contact section on mobile for Home page as requested */}
      <div className="hidden md:block">
        <Contact onBookNow={onBookClick} />
      </div>
      <Footer onAdminClick={onAdminClick} navigateTo={navigateTo} />
    </>
  );
};

// Define available pages
type Page = 'home' | 'services' | 'about' | 'process' | 'contact';

const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [publicJobId, setPublicJobId] = useState<string | null>(null);
  
  const [loggedInUser, setLoggedInUser] = useState<Employee | null>(null);
  const [loggedInClient, setLoggedInClient] = useState<ClientUser | null>(null);
  
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Check URL for Job Reference on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobRef = params.get('jobRef');
    if (jobRef) {
      setPublicJobId(jobRef);
    }
  }, []);

  // Function to navigate between pages
  const navigateToPage = (pageName: Page) => {
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: Employee | ClientUser | null, type: 'employee' | 'client') => {
      setIsLoginOpen(false);
      if (type === 'employee' && user) {
          setLoggedInUser(user as Employee);
          setIsAdminDashboardOpen(true);
      } else if (type === 'client' && user) {
          setLoggedInClient(user as ClientUser);
          setIsClientPortalOpen(true);
      }
  };

  const handleLogout = () => {
      setIsAdminDashboardOpen(false);
      setIsClientPortalOpen(false);
      setLoggedInUser(null);
      setLoggedInClient(null);
  };

  return (
    <ContentProvider>
      <main className="w-full min-h-screen bg-pestLight relative">
        
        {/* PUBLIC JOB VIEW (No Login Required) */}
        {publicJobId ? (
            <PublicJobViewer jobId={publicJobId} />
        ) : (
            <>
                {/* PUBLIC INTERFACE - Only render if NO dashboards are open */}
                {!isAdminDashboardOpen && !isClientPortalOpen && (
                <>
                    {/* Router Logic */}
                    {currentPage === 'home' && (
                        <Home
                            onBookClick={() => setIsBookingOpen(true)}
                            onAdminClick={() => setIsLoginOpen(true)}
                            navigateTo={navigateToPage}
                        />
                    )}
                    
                    {currentPage === 'services' && (
                        <ServicesPage
                            onBookClick={() => setIsBookingOpen(true)}
                            onAdminClick={() => setIsLoginOpen(true)}
                            navigateTo={navigateToPage}
                        />
                    )}

                    {currentPage === 'about' && (
                        <AboutPage
                            onBookClick={() => setIsBookingOpen(true)}
                            onAdminClick={() => setIsLoginOpen(true)}
                            navigateTo={navigateToPage}
                        />
                    )}

                    {currentPage === 'process' && (
                        <ProcessPage
                            onBookClick={() => setIsBookingOpen(true)}
                            onAdminClick={() => setIsLoginOpen(true)}
                            navigateTo={navigateToPage}
                        />
                    )}

                    {currentPage === 'contact' && (
                        <ContactPage
                            onBookClick={() => setIsBookingOpen(true)}
                            onAdminClick={() => setIsLoginOpen(true)}
                            navigateTo={navigateToPage}
                        />
                    )}
                
                    <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
                    
                    <CreatorWidget />
                </>
                )}

                {/* LOGIN MODAL */}
                {isLoginOpen && (
                <AdminLogin 
                    onLogin={handleLogin}
                    onCancel={() => setIsLoginOpen(false)}
                />
                )}

                {/* ADMIN DASHBOARD */}
                {isAdminDashboardOpen && (
                <AdminDashboard 
                    onLogout={handleLogout}
                    loggedInUser={loggedInUser}
                />
                )}

                {/* CLIENT PORTAL */}
                {isClientPortalOpen && loggedInClient && (
                    <ClientPortal 
                        client={loggedInClient}
                        onLogout={handleLogout}
                    />
                )}
            </>
        )}
      </main>
    </ContentProvider>
  );
};

export default App;