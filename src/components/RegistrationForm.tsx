import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, push, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';
import { RegistrationFormData } from '../types/registration';
import { CreditCard, User, Phone, Mail, Calendar, Award, Hash, LogIn, AlertCircle, LogOut } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import upiQrCode from '/assets/images/UPI-QR.jpeg';

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [formspreeState, formspreeHandleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_REGISTRATION_ID);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    experience: 'Beginner',
    transactionId: ''
  });

  // Update email when user changes
  useEffect(() => {
    if (user && !authLoading) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user, authLoading]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingRegistration, setHasExistingRegistration] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  // Check if user has already registered
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (user && !authLoading) {
        try {
          const registrationsRef = ref(database, 'registrations');
          const snapshot = await get(registrationsRef);
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            const registrations = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            
            // Check if this email (or userEmail) already exists in any registration
            const userEmail = user.email?.toLowerCase();
            const hasExisting = registrations.some(reg => {
              const regEmail = (reg.email || '').toLowerCase();
              const regUserEmail = (reg.userEmail || '').toLowerCase();
              return regEmail === userEmail || regUserEmail === userEmail;
            });
            
            if (hasExisting) {
              setHasExistingRegistration(true);
            }
          }
        } catch (error) {
          console.error('Error checking existing registration:', error);
        } finally {
          setCheckingRegistration(false);
        }
      } else if (!authLoading) {
        setCheckingRegistration(false);
      }
    };

    checkExistingRegistration();
  }, [user, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to register for the workshop.');
      return;
    }

    if (hasExistingRegistration) {
      alert('You have already registered for this workshop.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Double-check for existing registration before submitting
      const registrationsRef = ref(database, 'registrations');
      const snapshot = await get(registrationsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const registrations = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        const userEmail = user.email?.toLowerCase();
        const hasExisting = registrations.some(reg => {
          const regEmail = (reg.email || '').toLowerCase();
          const regUserEmail = (reg.userEmail || '').toLowerCase();
          return regEmail === userEmail || regUserEmail === userEmail;
        });
        
        if (hasExisting) {
          alert('You have already registered for this workshop.');
          setIsSubmitting(false);
          return;
        }
      }

      // Save to Firebase with user ID
      await push(registrationsRef, {
        ...formData,
        email: user.email, // Use authenticated email consistently
        userId: user.uid,
        userEmail: user.email,
        paymentConfirmed: false,
        timestamp: Date.now()
      });

      // Submit to Formspree using React hooks
      const formElement = e.target as HTMLFormElement;
      await formspreeHandleSubmit(formElement);

      navigate('/submission-received');
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading || checkingRegistration) {
    return (
      <section id="registration" className="bg-red-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="ml-3 text-lg">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show sign-in required message
  if (!user) {
    return (
      <section id="registration" className="bg-red-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <LogIn className="text-red-500 mr-3" size={48} />
              <h3 className="text-2xl font-black text-black">Sign In Required</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Please sign in with your Google account to register for the workshop.
            </p>
            <button
              onClick={signInWithGoogle}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center mx-auto"
            >
              <LogIn className="mr-2" size={20} />
              Sign In with Google
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show already registered message
  if (hasExistingRegistration) {
    return (
      <section id="registration" className="bg-red-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <AlertCircle className="text-yellow-500 mr-3" size={48} />
              <h3 className="text-2xl font-black text-black">Already Registered</h3>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              You have already registered for this workshop with email: <strong>{user.email}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              If you need to make changes to your registration, please contact us.
            </p>
            
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-black mb-3">Need to register with a different email?</h4>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => signOut(auth)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <LogOut className="mr-2" size={16} />
                    Sign Out & Use Different Email
                  </button>
                  <a
                    href="/check-status"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    Check My Registration Status
                  </a>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p><strong>Options:</strong></p>
                <ul className="text-left max-w-md mx-auto mt-2 space-y-1">
                  <li>• <strong>Sign Out:</strong> Use a different Google account</li>
                  <li>• <strong>Check Status:</strong> View your current registration</li>
                  <li>• <strong>Contact Us:</strong> For registration changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="registration" className="bg-red-500 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-8">
          RESERVE YOUR SPOT IN 3 SIMPLE STEPS
        </h2>
        <p className="text-xl text-white text-center mb-12">
          Seats are limited. Complete the steps below to secure your registration.
        </p>

        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* User Info */}
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-green-800 font-semibold">
                Signed in as: <span className="text-green-600">{user.email}</span>
              </p>
              <button
                onClick={() => signOut(auth)}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Step 1: Payment */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-black mb-4 flex items-center">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-lg">1</span>
              Pay via QR Code
            </h3>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <CreditCard className="mx-auto mb-4 text-red-500" size={64} />
              <p className="text-lg text-gray-700 mb-4">
                Scan the QR code with any UPI app to pay the registration fee.
              </p>
              <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                <img 
                  src={upiQrCode} 
                  alt="UPI QR Code for Payment"
                  className="w-48 h-48 object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Transaction ID */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-black mb-4 flex items-center">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-lg">2</span>
              Note Your Transaction ID
            </h3>
            <p className="text-lg text-gray-700">
              After paying, please copy the 12-digit UPI Transaction ID (e.g., 2345xxxxxxxx) from your payment app.
            </p>
          </div>

          {/* Step 3: Form */}
          <div>
            <h3 className="text-2xl font-black text-black mb-6 flex items-center">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-lg">3</span>
              Submit Your Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-bold mb-2">
                    <User className="inline mr-2" size={20} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  <ValidationError 
                    prefix="Full Name" 
                    field="fullName"
                    errors={formspreeState.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    <Mail className="inline mr-2" size={20} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Email from your Google account"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Using your Google account email: <strong>{user?.email}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    <Phone className="inline mr-2" size={20} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                  <ValidationError 
                    prefix="Phone" 
                    field="phone"
                    errors={formspreeState.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    <Calendar className="inline mr-2" size={20} />
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                  <ValidationError 
                    prefix="Age" 
                    field="age"
                    errors={formspreeState.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    <Award className="inline mr-2" size={20} />
                    Yoga Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <ValidationError 
                    prefix="Experience" 
                    field="experience"
                    errors={formspreeState.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    <Hash className="inline mr-2" size={20} />
                    UPI Transaction ID *
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter 12-digit transaction ID"
                  />
                  <ValidationError 
                    prefix="Transaction ID" 
                    field="transactionId"
                    errors={formspreeState.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formspreeState.submitting}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isSubmitting || formspreeState.submitting) ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;