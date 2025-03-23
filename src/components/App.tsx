import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Domains from './components/Domains';
import Timeline from './components/Timeline';
import RegistrationInstructions from './components/registration/RegistrationInstructions';
import Instructions from './components/Instructions';
import Prizes from './components/Prizes';
import Eligibility from './components/Eligibility';
import FAQ from './components/FAQ';
import Sponsors from './components/Sponsors';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ClickRipple from './components/animations/ClickRipple';
import Background from './components/Background';
import AuthPage from './components/auth/AuthPage';
import TeamRegistration from './components/auth/TeamRegistration';
import PhaseOneForm from './components/auth/PhaseOneForm';
import AdminDashboard from './components/admin/AdminDashboard';

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@edcrec.com'
};

const ADMIN_2_CREDENTIALS = {
  email: 'finance@edcrec.com'
};

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFinanceAdmin, setIsFinanceAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // Check if admin
        if (user.email === ADMIN_CREDENTIALS.email) {
          setIsAdmin(true);
          setIsFinanceAdmin(false);
          setIsAuthenticated(true);
          setCurrentUser(null); // Ensure currentUser is null for admin
          setLoading(false);
          return;
        }

        // Check if finance admin
        if (user.email === ADMIN_2_CREDENTIALS.email) {
          setIsAdmin(false);
          setIsFinanceAdmin(true);
          setIsAuthenticated(true);
          setCurrentUser(null); // Ensure currentUser is null for finance admin
          setLoading(false);
          return;
        }

        // Regular user
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ id: user.uid, ...userDoc.data() });
          } else {
            // If user document doesn't exist, create a minimal user object
            setCurrentUser({ id: user.uid, name: user.displayName || 'User' });
          }
          
          // Check payment status in teams collection
          const teamDoc = await getDoc(doc(db, 'teams', user.uid));
          if (teamDoc.exists()) {
            const teamData = teamDoc.data();
            // Check for "paid" status (lowercase)
            if (teamData.paymentStatus === 'paid') {
              setPaymentStatus('paid');
            } else {
              // If not paid in teams collection, check payments collection by email
              const userEmail = userDoc.exists() ? userDoc.data().email : user.email;
              
              if (userEmail) {
                const paymentsQuery = query(
                  collection(db, 'payments'),
                  where('email', '==', userEmail),
                  where('status', '==', 'paid')
                );
                
                const querySnapshot = await getDocs(paymentsQuery);
                
                if (!querySnapshot.empty) {
                  // Found a paid payment for this user's email
                  // Update the team's payment status
                  setPaymentStatus('paid');
                  
                  // We don't update the teams collection here as that will be handled
                  // in the TeamRegistration component when it loads
                } else {
                  setPaymentStatus('pending');
                }
              }
            }
          }
          
          setIsAuthenticated(true);
          setIsAdmin(false);
          setIsFinanceAdmin(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Set minimal user data in case of error
          setCurrentUser({ id: user.uid, name: user.displayName || 'User' });
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsFinanceAdmin(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderAuthenticatedContent = () => {
    if (isAdmin) {
      return <AdminDashboard isFinanceAdmin={false} />;
    }
    
    if (isFinanceAdmin) {
      return <AdminDashboard isFinanceAdmin={true} />;
    }
    
    // Ensure currentUser exists before accessing its properties
    if (!currentUser) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }
    
    if (paymentStatus === 'paid') {
      return <PhaseOneForm userId={currentUser.id} userName={currentUser.name} />;
    }
    
    return <TeamRegistration userId={currentUser.id} userName={currentUser.name} />;
  };

  return (
    <div className="bg-transparent min-h-screen">
      <Background />
      <ClickRipple />
      <Navbar 
        onAuthClick={() => setShowAuth(true)} 
        isAuthenticated={isAuthenticated}
        userName={currentUser?.name}
      />
      
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {showAuth && !isAuthenticated ? (
            <AuthPage onClose={() => setShowAuth(false)} />
          ) : isAuthenticated ? (
            renderAuthenticatedContent()
          ) : (
            <>
              <Hero />
              <About />
              <Domains />
              <Timeline />
              <RegistrationInstructions />
              <Instructions />
              <Prizes />
              <Eligibility />
              <Sponsors />
              <FAQ />
              <Contact />
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;