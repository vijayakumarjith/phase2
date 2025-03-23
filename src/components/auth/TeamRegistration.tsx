import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Phone,
  User,
  IndianRupee,
  Mail,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { doc, setDoc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Countdown from 'react-countdown';
import { generateUniqueId } from '../../lib/instamojo';

interface TeamRegistrationProps {
  userId: string;
  userName: string;
  onComplete?: () => void;
}

const REGISTRATION_DEADLINE = new Date('2025-03-17T23:59:59').getTime();
const COST_PER_MEMBER = 200;
const PAYMENT_PORTAL_URL = 'http://82.29.167.185:3000/';

interface TeamMember {
  name: string;
  phone: string;
  email: string;
}

const TeamRegistration: React.FC<TeamRegistrationProps> = ({
  userId,
  userName,
  onComplete,
}) => {
  const [teamData, setTeamData] = useState({
    teamName: '',
    teamSize: 2,
    members: Array(5).fill({ name: '', phone: '', email: '' } as TeamMember),
  });
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [teamDoc, setTeamDoc] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'initiated' | 'paid'
  >('pending');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setInitialLoading(true);
        const teamDocRef = doc(db, 'teams', userId);
        const teamDocSnap = await getDoc(teamDocRef);

        if (teamDocSnap.exists()) {
          const data = teamDocSnap.data();
          setTeamDoc(data);

          setTeamData({
            teamName: data.teamName || '',
            teamSize: data.teamSize || 2,
            members:
              data.members || Array(5).fill({ name: '', phone: '', email: '' }),
          });

          if (data.registrationId) {
            setRegistrationId(data.registrationId);
          }

          // Check for payment status - now checking for "paid" (lowercase)
          if (data.paymentStatus === 'paid') {
            setIsSuccess(true);
            setPaymentStatus('paid');
          } else if (data.paymentStatus === 'initiated') {
            setPaymentStatus('initiated');
            setPaymentStep(2);
            
            // Check if payment is already marked as paid in payments collection
            await checkPaymentInPaymentsCollection(data.members);
          }
        } else {
          // Pre-fill first team member with current user data
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const updatedMembers = [...teamData.members];
            updatedMembers[0] = {
              name: userData.name || '',
              phone: userData.phone || '',
              email: userData.email || '',
            };

            setTeamData((prev) => ({
              ...prev,
              members: updatedMembers,
            }));
          }
        }
      } catch (err) {
        console.error('Error loading team data:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadTeamData();
  }, [userId]);

  // Function to check if payment exists in payments collection by email
  const checkPaymentInPaymentsCollection = async (members: TeamMember[]) => {
    try {
      // Get all team member emails
      const emails = members.filter(member => member.email).map(member => member.email);
      
      if (emails.length === 0) return;
      
      // Check payments collection for any document with matching email and paid status
      for (const email of emails) {
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('email', '==', email),
          where('status', '==', 'paid')
        );
        
        const querySnapshot = await getDocs(paymentsQuery);
        
        if (!querySnapshot.empty) {
          // Found a paid payment for this team member's email
          // Update the team's payment status
          const teamDocRef = doc(db, 'teams', userId);
          await updateDoc(teamDocRef, {
            paymentStatus: 'paid',
            paymentCompletedAt: new Date().toISOString(),
          });
          
          setIsSuccess(true);
          setPaymentStatus('paid');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking payments collection:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTimeUp) {
      setError('Registration deadline has passed');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate team data
      if (!teamData.teamName.trim()) {
        throw new Error('Team name is required');
      }

      const requiredMembers = teamData.members.slice(0, teamData.teamSize);
      const isValidTeam = requiredMembers.every(
        (member) =>
          member.name.trim() && member.phone.trim() && member.email.trim()
      );

      if (!isValidTeam) {
        throw new Error('Please fill in all team member details');
      }

      // Generate unique registration ID if not already exists
      const uniqueId = registrationId || generateUniqueId();
      setRegistrationId(uniqueId);

      // Save team data
      const teamDocRef = doc(db, 'teams', userId);
      await setDoc(teamDocRef, {
        teamName: teamData.teamName,
        teamSize: teamData.teamSize,
        members: teamData.members.slice(0, teamData.teamSize),
        createdAt: new Date().toISOString(),
        userId,
        registrationId: uniqueId,
        paymentStatus: 'pending',
      });

      // Move to payment step
      setPaymentStep(2);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async () => {
    setIsLoading(true);
    try {
      // Update payment status to initiated
      const teamDocRef = doc(db, 'teams', userId);
      await updateDoc(teamDocRef, {
        paymentStatus: 'initiated',
        paymentInitiatedAt: new Date().toISOString(),
      });

      setPaymentStatus('initiated');

      // Open payment portal in new tab
      window.open(PAYMENT_PORTAL_URL, '_blank');
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    setIsLoading(true);
    try {
      // Check payment status directly in the teams collection
      const teamDocRef = doc(db, 'teams', userId);
      const teamDocSnap = await getDoc(teamDocRef);

      if (teamDocSnap.exists()) {
        const data = teamDocSnap.data();
        
        // Check for "paid" status (lowercase)
        if (data.paymentStatus === 'paid') {
          setIsSuccess(true);
          setPaymentStatus('paid');
          
          // Redirect to Phase 1 form by reloading the page
          window.location.reload();
          return;
        }
        
        // If not paid in teams collection, check if any team member's email 
        // has a paid status in the payments collection
        if (data.members && data.members.length > 0) {
          const emails = data.members.filter((m: any) => m.email).map((m: any) => m.email);
          
          for (const email of emails) {
            const paymentsQuery = query(
              collection(db, 'payments'),
              where('email', '==', email),
              where('status', '==', 'paid')
            );
            
            const querySnapshot = await getDocs(paymentsQuery);
            
            if (!querySnapshot.empty) {
              // Found a paid payment for this team member's email
              // Update the team's payment status
              await updateDoc(teamDocRef, {
                paymentStatus: 'paid',
                paymentCompletedAt: new Date().toISOString(),
              });
              
              setIsSuccess(true);
              setPaymentStatus('paid');
              
              // Redirect to Phase 1 form by reloading the page
              window.location.reload();
              return;
            }
          }
        }
      }
      
      // Also check the payments collection as a fallback using userId
      const paymentDocRef = doc(db, 'payments', userId);
      const paymentDocSnap = await getDoc(paymentDocRef);

      if (paymentDocSnap.exists()) {
        const paymentData = paymentDocSnap.data();
        
        if (paymentData.status === 'paid') {
          // If payment is confirmed in payments collection but not in teams collection,
          // update the teams collection
          await updateDoc(teamDocRef, {
            paymentStatus: 'paid',
            paymentCompletedAt: new Date().toISOString(),
          });
          
          setIsSuccess(true);
          setPaymentStatus('paid');
          
          // Redirect to Phase 1 form by reloading the page
          window.location.reload();
          return;
        }
      }
      
      // If we get here, payment is not confirmed
      setError(
        'Your payment has not been confirmed yet. Please try again later or contact support if you have already made the payment.'
      );
    } catch (err) {
      console.error('Error checking payment status:', err);
      setError('Failed to verify payment status. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const countdownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: any) => {
    if (completed) {
      return (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-red-500 font-bold text-xl"
        >
          Registration Closed
        </motion.div>
      );
    }

    return (
      <div className="text-white">
        <span className="text-xl font-bold">Time Remaining: </span>
        <span className="text-purple-400">
          {days}d {hours}h {minutes}m {seconds}s
        </span>
      </div>
    );
  };

  const handleCountdownComplete = () => {
    setIsTimeUp(true);
  };

  const handleInputChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...teamData.members];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value
    };
    setTeamData({ ...teamData, members: newMembers });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-purple-500/20 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
            Registration Complete!
          </h2>
          <p className="text-gray-300 mb-6 text-sm sm:text-base">
            Thank you for registering your team for the Startup Spark Grand
            Challenge 2025. Your payment has been confirmed.
          </p>
          <div className="bg-purple-900/30 p-3 sm:p-4 rounded-lg inline-block mb-6">
            <p className="text-white text-lg sm:text-xl font-mono">{registrationId}</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Your Unique Registration ID
            </p>
          </div>
          <div className="space-y-2 mb-8 text-sm sm:text-base">
            <p className="text-purple-400">
              Team Name: <span className="text-white">{teamData.teamName}</span>
            </p>
            <p className="text-purple-400">
              Team Size:{' '}
              <span className="text-white">{teamData.teamSize} members</span>
            </p>
            <p className="text-purple-400">
              Amount Paid:{' '}
              <span className="text-white">
                ₹{teamData.teamSize * COST_PER_MEMBER}
              </span>
            </p>
          </div>

          <motion.div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 sm:p-6 rounded-lg mb-8 text-sm sm:text-base">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Next Steps</h3>
            <p className="text-gray-300 mb-4">
              You're now ready to proceed to Phase 1 of the competition. You'll
              need to submit your project details and presentation.
            </p>
            <ul className="text-left space-y-2 text-gray-300 mb-6">
              <li className="flex items-start">
                <span className="bg-purple-500/20 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-purple-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span>Prepare your project presentation (max 7 slides)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-500/20 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-purple-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span>Create a 5-minute video demonstration</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-500/20 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-purple-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span>Submit your materials before the Phase 1 deadline</span>
              </li>
            </ul>
          </motion.div>

          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold"
          >
            Continue to Phase 1
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-purple-500/20"
      >
        <AnimatePresence mode="wait">
          {paymentStep === 1 ? (
            <motion.div
              key="registration-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
                  Welcome, {userName}!
                </h2>
                <p className="text-gray-300 mt-2 text-sm sm:text-base">
                  Register your team for the challenge
                </p>
                <div className="mt-4">
                  <Countdown
                    date={REGISTRATION_DEADLINE}
                    renderer={countdownRenderer}
                    onComplete={handleCountdownComplete}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">Team Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={teamData.teamName}
                      onChange={(e) =>
                        setTeamData({ ...teamData, teamName: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm sm:text-base"
                      required
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm sm:text-base">Team Size</label>
                  <div className="relative">
                    <select
                      value={teamData.teamSize}
                      onChange={(e) =>
                        setTeamData({
                          ...teamData,
                          teamSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm sm:text-base appearance-none"
                      required
                    >
                      {[2, 3, 4, 5].map((size) => (
                        <option key={size} value={size}>
                          {size} Members
                        </option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-400 mt-2 flex items-center text-sm sm:text-base">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    Total Cost: ₹{teamData.teamSize * COST_PER_MEMBER}
                  </p>
                </div>

                {Array.from({ length: teamData.teamSize }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-white font-semibold flex items-center text-sm sm:text-base">
                      <div className="bg-purple-500/20 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-purple-400 mr-2 sm:mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      {index === 0 ? 'Team Lead' : `Team Member ${index + 1}`}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={teamData.members[index]?.name || ''}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm sm:text-base"
                            required
                            readOnly={index === 0}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={teamData.members[index]?.phone || ''}
                            onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm sm:text-base"
                            required
                            readOnly={index === 0}
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={teamData.members[index]?.email || ''}
                            onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm sm:text-base"
                            required
                            readOnly={index === 0}
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center p-4 bg-red-500/10 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isTimeUp || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold flex items-center justify-center group text-sm sm:text-base ${
                    isTimeUp || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      Continue to Payment
                      <IndianRupee className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="payment-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6">
                Payment Details
              </h2>

              <div className="bg-purple-900/30 p-4 sm:p-6 rounded-lg mb-8">
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                  <span className="text-gray-300">Team Name:</span>
                  <span className="text-white font-semibold">
                    {teamData.teamName}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                  <span className="text-gray-300">Team Size:</span>
                  <span className="text-white font-semibold">
                    {teamData.teamSize} members
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                  <span className="text-gray-300">Registration ID:</span>
                  <span className="text-white font-mono text-xs sm:text-sm break-all">
                    {registrationId}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                  <span className="text-gray-300">Cost per Member:</span>
                  <span className="text-white font-semibold">
                    ₹{COST_PER_MEMBER}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-purple-500/30 text-sm sm:text-base">
                  <span className="text-gray-300 text-base sm:text-lg">Total Amount:</span>
                  <span className="text-white font-bold text-lg sm:text-xl">
                    ₹{teamData.teamSize * COST_PER_MEMBER}
                  </span>
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 sm:p-6 rounded-lg mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                  Payment Status
                </h3>
                <div className="flex items-center justify-center mb-6">
                  {paymentStatus === 'pending' ? (
                    <div className="flex items-center text-yellow-400">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      <span className="text-base sm:text-lg">Payment Pending</span>
                    </div>
                  ) : paymentStatus === 'initiated' ? (
                    <div className="flex items-center text-blue-400">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-400 border-t-transparent rounded-full mr-2"
                      />
                      <span className="text-base sm:text-lg">Payment Initiated</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      <span className="text-base sm:text-lg">Payment Completed</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-sm sm:text-base">
                  {paymentStatus === 'pending' && (
                    <p className="text-gray-300">
                      Click the "Pay Now" button below to proceed to our payment
                      portal. You'll need to enter your Registration ID during
                      payment.
                    </p>
                  )}

                  {paymentStatus === 'initiated' && (
                    <p className="text-gray-300">
                      Your payment has been initiated. If you haven't completed
                      the payment yet, please continue on the payment portal.
                      Once done, click "Check Payment Status".
                    </p>
                  )}

                  <div className="bg-yellow-500/10 p-4 rounded-lg text-yellow-300 text-xs sm:text-sm">
                    <p>
                      Important: Make sure to use your Registration ID during
                      payment to ensure payment to ensure your payment is properly tracked.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center p-4 bg-red-500/10 rounded-lg mb-6"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => setPaymentStep(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 rounded-lg text-white font-semibold flex items-center justify-center text-sm sm:text-base"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </motion.button>

                {paymentStatus === 'pending' ? (
                  <motion.button
                    onClick={initiatePayment}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold flex items-center justify-center text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        Pay Now <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <>
                    <motion.a
                      href={PAYMENT_PORTAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold flex items-center justify-center text-sm sm:text-base"
                    >
                      Continue Payment <ExternalLink className="w-4 h-4 ml-2" />
                    </motion.a>

                    <motion.button
                      onClick={checkPaymentStatus}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 rounded-lg text-white font-semibold flex items-center justify-center text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Checking...
                        </span>
                      ) : (
                        'Check Payment Status'
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TeamRegistration;
