import React from 'react';
import { Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const Contact: React.FC = () => {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_CONTACT_ID);

  return (
    <section className="bg-yellow-400 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-black mb-12">
          QUESTIONS? GET IN TOUCH
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <Phone className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-2xl font-bold text-black mb-4">Call Us</h3>
            <div className="space-y-2">
              <p className="text-xl text-gray-700">
                <a href="tel:+919342201408" className="hover:text-red-500 transition-colors">
                  +91 9342201408
                </a>
              </p>
              <p className="text-xl text-gray-700">
                <a href="tel:+918431328486" className="hover:text-red-500 transition-colors">
                  +91 8431328486
                </a>
              </p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <MessageCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-2xl font-bold text-black mb-4">Send Message</h3>
            
            {state.succeeded ? (
              <div className="text-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="text-lg font-semibold">Thank you for your message!</p>
                  <p className="text-sm">We'll get back to you soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email" 
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="your@email.com"
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-left text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Tell us about your question..."
                  />
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1 block"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {state.submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;