import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  KeyRound,
  User,
  Phone,
  GraduationCap,
  Building2,
  X,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthPageProps {
  onClose: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    year: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        // Sign in the user
        const { user } = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          // The App component will handle showing the correct content
          onClose();
        } else {
          setError('User document not found.');
        }
      } else if (mode === 'signup') {
        // Create a new user
        const { user } = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Prepare user data for Firestore
        const userData = {
          name: formData.name,
          department: formData.department,
          year: formData.year,
          phone: formData.phone,
          email: formData.email,
          createdAt: new Date().toISOString(),
          paymentStatus: 'unpaid', // Default payment status
        };

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), userData);

        // Show success message and switch to sign-in mode
        setSuccess('Account created successfully! Please sign in.');
        setTimeout(() => {
          setMode('signin');
          setSuccess('');
        }, 3000);
      } else if (mode === 'forgot') {
        // Send password reset email
        await sendPasswordResetEmail(auth, formData.email);
        setSuccess('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          setMode('signin');
          setSuccess('');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(
        err.message.includes('auth/')
          ? 'Invalid email or password'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md"
        >
          <motion.button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white z-10"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 blur-xl"></div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-black/40 border border-purple-500/20 p-6 sm:p-8">
              {/* Tab Navigation */}
              {mode !== 'forgot' && (
                <div className="flex mb-8 bg-black/20 rounded-lg p-1">
                  <button
                    onClick={() => setMode('signin')}
                    className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm sm:text-base transition-all ${
                      mode === 'signin'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm sm:text-base transition-all ${
                      mode === 'signup'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </button>
                </div>
              )}

              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-center gradient-text mb-6">
                  {mode === 'signin'
                    ? 'Welcome Back'
                    : mode === 'signup'
                    ? 'Create Account'
                    : 'Reset Password'}
                </h1>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-lg text-center text-sm sm:text-base"
                  >
                    {success}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {mode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm"
                            required
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">
                            Department
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.department}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  department: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm"
                              required
                            />
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">Year</label>
                          <div className="relative">
                            <select
                              value={formData.year}
                              onChange={(e) =>
                                setFormData({ ...formData, year: e.target.value })
                              }
                              className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm appearance-none"
                              required
                            >
                              <option value="">Select Year</option>
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                            </select>
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm"
                            required
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  {mode !== 'forgot' && (
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 rounded-lg pl-10 pr-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm"
                          required
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold flex items-center justify-center group ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
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
                      </div>
                    ) : (
                      <>
                        {mode === 'signin'
                          ? 'Sign In'
                          : mode === 'signup'
                          ? 'Create Account'
                          : 'Reset Password'}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 flex flex-col items-center space-y-4">
                  {mode === 'signin' && (
                    <button
                      onClick={() => setMode('forgot')}
                      className="text-sm text-gray-400 hover:text-white flex items-center"
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Forgot Password?
                    </button>
                  )}
                  
                  {mode === 'forgot' && (
                    <button
                      onClick={() => setMode('signin')}
                      className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                    >
                      Back to Sign In
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;