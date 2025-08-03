import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, LogOut } from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { user, signInWithGoogle, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center text-white hover:text-yellow-300 transition-colors"
      >
        <LogIn size={16} className="mr-1" />
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center text-white">
        <User size={16} className="mr-1" />
        <span className="text-sm hidden md:inline">{user.email}</span>
      </div>
      <button
        onClick={logout}
        className="text-white hover:text-yellow-300 transition-colors"
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};

export default AuthStatus; 