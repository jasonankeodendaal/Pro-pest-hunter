
import React, { useState } from 'react';
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
import { ServicesPage } from './components/ServicesPage';
import { AboutPage } from './components/AboutPage';
import { ProcessPage } from './components/ProcessPage';
import { ContactPage } from './components/ContactPage';
import { CreatorWidget } from './components/CreatorWidget'; // NEW IMPORT
import { Employee } from './types';

// AppContent represents the home page sections
const Home: React.FC<{ onBookClick: () => void; onAdminClick: () => void; navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void; }> = ({ onBookClick, onAdminClick, navigateTo }) => {
  return (
    <>
      <Navigation onBookClick={onBookClick} navigateTo={navigateTo} />
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
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<Employee | null>(null); // null for admin, Employee object for employee
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Function to navigate between pages
  const navigateToPage = (pageName: Page) => {
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ContentProvider>
      <main className="w-full min-h-screen bg-pestLight relative">
        
        {/* PUBLIC INTERFACE - Only render if Admin Dashboard is CLOSED */}
        {!isAdminDashboardOpen && (
          <>
            {/* Router Logic */}
            {currentPage === 'home' && (
                <Home
                    onBookClick={() => setIsBookingOpen(true)}
                    onAdminClick={() => setIsAdminLoginOpen(true)}
                    navigateTo={navigateToPage}
                />
            )}
            
            {currentPage === 'services' && (
                <ServicesPage
                    onBookClick={() => setIsBookingOpen(true)}
                    onAdminClick={() => setIsAdminLoginOpen(true)}
                    navigateTo={navigateToPage}
                />
            )}

            {currentPage === 'about' && (
                <AboutPage
                    onBookClick={() => setIsBookingOpen(true)}
                    onAdminClick={() => setIsAdminLoginOpen(true)}
                    navigateTo={navigateToPage}
                />
            )}

            {currentPage === 'process' && (
                <ProcessPage
                    onBookClick={() => setIsBookingOpen(true)}
                    onAdminClick={() => setIsAdminLoginOpen(true)}
                    navigateTo={navigateToPage}
                />
            )}

            {currentPage === 'contact' && (
                <ContactPage
                    onBookClick={() => setIsBookingOpen(true)}
                    onAdminClick={() => setIsAdminLoginOpen(true)}
                    navigateTo={navigateToPage}
                />
            )}
          
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
            
            <CreatorWidget />
          </>
        )}

        {/* ADMIN INTERFACE */}
        {isAdminLoginOpen && (
          <AdminLogin 
            onLogin={(employee) => {
              setIsAdminLoginOpen(false);
              setIsAdminDashboardOpen(true);
              setLoggedInUser(employee);
            }}
            onCancel={() => setIsAdminLoginOpen(false)}
          />
        )}

        {isAdminDashboardOpen && (
          <AdminDashboard 
            onLogout={() => {
              setIsAdminDashboardOpen(false);
              setLoggedInUser(null);
            }}
            loggedInUser={loggedInUser}
          />
        )}
      </main>
    </ContentProvider>
  );
};

export default App;
