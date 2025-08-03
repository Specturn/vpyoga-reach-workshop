import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { Registration } from '../types/registration';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const TicketVerification: React.FC = () => {
  const { verificationCode } = useParams<{ verificationCode: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<Registration | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyTicket = async () => {
      if (!verificationCode) {
        setError('Invalid verification code');
        setIsLoading(false);
        return;
      }

      try {
        const registrationsRef = ref(database, 'registrations');
        const snapshot = await get(registrationsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const registrations = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          // Find ticket by verification code
          const foundTicket = registrations.find(reg => {
            const expectedCode = btoa(`${reg.id}-${reg.email}-${reg.timestamp}`).substring(0, 12).toUpperCase();
            return expectedCode === verificationCode.toUpperCase();
          });
          
          if (foundTicket) {
            setTicket(foundTicket);
            setIsValid(true);
          } else {
            setError('Ticket not found or invalid verification code');
          }
        } else {
          setError('No registrations found');
        }
      } catch (error) {
        console.error('Error verifying ticket:', error);
        setError('Error verifying ticket. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyTicket();
  }, [verificationCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Verifying ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="text-red-600 mb-4">
            <XCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Invalid Ticket</h2>
          <p className="text-red-700 mb-6">
            {error || 'This ticket could not be verified. It may be invalid or expired.'}
          </p>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Workshop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="text-green-600 mb-4">
            <CheckCircle size={48} className="mx-auto" />
          </div>
          <h1 className="text-3xl font-black text-green-800 mb-2">Valid Ticket</h1>
          <p className="text-green-700">This ticket has been verified and is authentic.</p>
        </div>

        {ticket && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-2">Participant Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {ticket.fullName}</div>
                <div><strong>Email:</strong> {ticket.email}</div>
                <div><strong>Phone:</strong> {ticket.phone}</div>
                <div><strong>Age:</strong> {ticket.age}</div>
                <div><strong>Experience:</strong> {ticket.experience}</div>
                <div><strong>Registration ID:</strong> {ticket.id}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2">Workshop Details</h3>
              <div className="text-sm space-y-1">
                <div><strong>Event:</strong> REACH - The Best Version of You</div>
                <div><strong>Dates:</strong> August 9th & 10th, 2025</div>
                <div><strong>Venue:</strong> Fireflies Intercultural Center</div>
                <div><strong>Address:</strong> Kanakapura Road, Kaggalipura, Bengaluru</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">Payment Status</h3>
              <div className="text-sm">
                <div><strong>Transaction ID:</strong> {ticket.transactionId}</div>
                <div><strong>Status:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs font-semibold ${
                    ticket.paymentConfirmed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.paymentConfirmed ? 'CONFIRMED' : 'PENDING'}
                  </span>
                </div>
                <div><strong>Generated:</strong> {new Date(ticket.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Security Information</h3>
              <div className="text-sm">
                <div><strong>Verification Code:</strong> {verificationCode}</div>
                <div><strong>Verified At:</strong> {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Workshop
          </a>
        </div>
      </div>
    </div>
  );
};

export default TicketVerification; 