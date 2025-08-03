import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { Eye, X } from 'lucide-react';

const DebugInfo: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [registrations, setRegistrations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const registrationsRef = ref(database, 'registrations');
      const snapshot = await get(registrationsRef);
      if (snapshot.exists()) {
        setRegistrations(snapshot.val());
      } else {
        setRegistrations(null);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDebug) {
      fetchRegistrations();
    }
  }, [showDebug]);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Debug Info"
      >
        <Eye size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Debug Information</h2>
          <button
            onClick={() => setShowDebug(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {registrations ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Registrations in Database:</h3>
            {Object.entries(registrations).map(([id, data]: [string, any]) => (
              <div key={id} className="border border-gray-200 rounded p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">Registration ID: {id}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>Name:</strong> {data.fullName}</div>
                  <div><strong>Email:</strong> {data.email}</div>
                  <div><strong>User Email:</strong> {data.userEmail}</div>
                  <div><strong>Phone:</strong> {data.phone}</div>
                  <div><strong>Transaction ID:</strong> {data.transactionId}</div>
                  <div><strong>Payment Confirmed:</strong> {data.paymentConfirmed ? '✅ Yes' : '❌ No'}</div>
                  <div><strong>User ID:</strong> {data.userId}</div>
                  <div><strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No registrations found in database.</p>
        )}
      </div>
    </div>
  );
};

export default DebugInfo; 