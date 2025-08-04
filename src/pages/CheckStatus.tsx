import React, { useState, useEffect } from 'react';
import { Search, Download, Clock, AlertCircle } from 'lucide-react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../config/firebase';
import { Registration } from '../types/registration';
import { generateTicketPDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';

const CheckStatus: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'confirmed' | 'pending' | 'not-found'>('idle');
  const [registration, setRegistration] = useState<Registration | null>(null);

  // Auto-check status when user is loaded
  useEffect(() => {
    if (user && !authLoading) {
      checkStatus();
    }
  }, [user, authLoading]);

  const checkStatus = async () => {
    if (!user?.email) {
      setStatus('not-found');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setRegistration(null);

    try {
      const registrationsRef = ref(database, 'registrations');
      const snapshot = await get(registrationsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const registrations = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Search for registration by user's email (case-insensitive)
        const searchEmail = user.email.toLowerCase();
        const foundRegistration = registrations.find(reg => {
          const regEmail = (reg.email || '').toLowerCase();
          const regUserEmail = (reg.userEmail || '').toLowerCase();
          return regEmail === searchEmail || regUserEmail === searchEmail;
        });
        
        if (foundRegistration) {
          setRegistration(foundRegistration);
          setStatus(foundRegistration.paymentConfirmed ? 'confirmed' : 'pending');
        } else {
          setStatus('not-found');
        }
      } else {
        setStatus('not-found');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          alert('Database access error. Please contact support.');
        } else if (error.message.includes('network')) {
          alert('Network error. Please check your connection and try again.');
        } else {
          alert('Error checking status. Please try again or contact support.');
        }
      } else {
        alert('Error checking status. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTicket = async () => {
    if (registration) {
      try {
        await generateTicketPDF(registration);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating ticket. Please try again.');
      }
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your registration status...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Sign In Required</h2>
          <p className="text-red-700 mb-6">
            Please sign in with your Google account to check your registration status.
          </p>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center mx-auto"
          >
            ← Back to Workshop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-black mb-4">
            CHECK REGISTRATION STATUS
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Checking status for: <strong>{user.email}</strong>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Signed in as:</strong> {user.email}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Checking your registration status...</p>
          </div>
        )}
        
        {/* Status Results */}
        {status === 'confirmed' && registration && (
          <div className="bg-green-100 border border-green-400 rounded-lg p-6 text-center">
            <div className="text-green-600 mb-4">
              <Download size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Confirmed!</h2>
            <p className="text-green-700 mb-6">
              Success! Your payment has been confirmed. You can now download your workshop ticket.
            </p>
            <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Registration Details:</strong><br />
                Name: {registration.fullName}<br />
                Email: {registration.email || registration.userEmail}<br />
                Transaction ID: {registration.transactionId}
              </p>
            </div>
            <button
              onClick={downloadTicket}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
            >
              <Download className="mr-2" size={20} />
              DOWNLOAD TICKET
            </button>
          </div>
        )}

        {status === 'pending' && registration && (
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-6 text-center">
            <div className="text-yellow-600 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Payment Pending</h2>
            <p className="text-yellow-700 mb-4">
              Your registration is pending. Our team is still verifying your payment. 
              Please check back later or contact us if you have questions.
            </p>
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>Registration Details:</strong><br />
                Name: {registration.fullName}<br />
                Email: {registration.email || registration.userEmail}<br />
                Transaction ID: {registration.transactionId}
              </p>
            </div>
          </div>
        )}

        {status === 'not-found' && !isLoading && (
          <div className="bg-red-100 border border-red-400 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <AlertCircle size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Registration Not Found</h2>
            <p className="text-red-700 mb-4">
              We could not find a registration with your email address: <strong>{user.email}</strong>
            </p>
            <div className="text-sm text-red-600">
              <p><strong>Possible reasons:</strong></p>
              <ul className="text-left max-w-md mx-auto">
                <li>• You haven't registered for the workshop yet</li>
                <li>• You registered with a different email address</li>
                <li>• There was an issue with your registration</li>
                <li>• Contact us if you believe this is an error</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <div className="mb-6">
            <a
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
            >
              ← Back to Workshop Details
            </a>
          </div>
          
          <p className="text-gray-600 mb-4">Need help?</p>
          <div className="space-x-4">
            <a
              href="tel:+919342201408"
              className="text-blue-500 hover:underline font-semibold"
            >
              +91 9342201408
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="tel:+918431328486"
              className="text-blue-500 hover:underline font-semibold"
            >
              +91 8431328486
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;