import React from 'react';
import { CheckCircle, Clock, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmissionReceived: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
        <CheckCircle className="mx-auto mb-6 text-green-500" size={80} />
        
        <h1 className="text-3xl md:text-4xl font-black text-black mb-6">
          THANK YOU FOR YOUR SUBMISSION!
        </h1>
        
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          We have received your registration details. Your payment is currently being verified 
          by our team. Please check back in 24 hours to download your workshop ticket.
        </p>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
          <div className="flex items-center">
            <Clock className="text-yellow-500 mr-3" size={24} />
            <div className="text-left">
              <h3 className="font-bold text-black">Payment Verification in Progress</h3>
              <p className="text-gray-600">
                Our team will verify your UPI transaction within 24 hours.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/check-status"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <Download className="mr-2" size={20} />
            Check Registration Status
          </Link>
          
          <div className="text-gray-600">
            <p>or</p>
          </div>
          
          <Link
            to="/reach-workshop"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Workshop Page
          </Link>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Questions? Contact us at{' '}
            <a href="tel:+919342201408" className="text-blue-500 hover:underline">
              +91 9342201408
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReceived;