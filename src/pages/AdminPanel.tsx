import React, { useState, useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { Registration } from '../types/registration';
import { Users, CheckCircle, XCircle, LogOut, User, Mail, Phone, Hash } from 'lucide-react';
import DebugInfo from '../components/DebugInfo';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const adminEmails = ['itsme.ankit2006@gmail.com', 'specturnmedia@gmail.com'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && adminEmails.includes(user.email || '')) {
        setIsAuthenticated(true);
        loadRegistrations();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setRegistrations([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadRegistrations = async () => {
    setIsLoading(true);
    try {
      const registrationsRef = ref(database, 'registrations');
      const snapshot = await get(registrationsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const registrationsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setRegistrations(registrationsList.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaymentStatus = async (registrationId: string, currentStatus: boolean) => {
    try {
      const registrationRef = ref(database, `registrations/${registrationId}`);
      await update(registrationRef, { paymentConfirmed: !currentStatus });
      
      // Update local state
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId
            ? { ...reg, paymentConfirmed: !currentStatus }
            : reg
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Login to manage workshop registrations</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin email"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-gray-800 flex items-center">
            <Users className="mr-3 text-blue-500" size={32} />
            Workshop Registrations Admin
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <LogOut className="mr-2" size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Registrations</h3>
            <p className="text-3xl font-black text-blue-500">{registrations.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Confirmed Payments</h3>
            <p className="text-3xl font-black text-green-500">
              {registrations.filter(r => r.paymentConfirmed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Payments</h3>
            <p className="text-3xl font-black text-yellow-500">
              {registrations.filter(r => !r.paymentConfirmed).length}
            </p>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Registration Details</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No registrations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="mr-3 text-gray-400" size={20} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {registration.fullName}
                            </div>
                            <div className="text-sm text-gray-500">Age: {registration.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="mr-2 text-gray-400" size={16} />
                            {registration.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="mr-2 text-gray-400" size={16} />
                            {registration.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Hash className="mr-2 text-gray-400" size={16} />
                          {registration.transactionId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {registration.experience}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            registration.paymentConfirmed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {registration.paymentConfirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => togglePaymentStatus(registration.id!, registration.paymentConfirmed)}
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                            registration.paymentConfirmed
                              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                              : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                          }`}
                        >
                          {registration.paymentConfirmed ? (
                            <>
                              <XCircle className="mr-2" size={16} />
                              Mark Unconfirmed
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2" size={16} />
                              Confirm Payment
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Debug Information - Only visible to admins */}
        <div className="mt-8">
          <DebugInfo />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;