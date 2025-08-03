import React, { useState, useEffect } from 'react';
import { ASSETS } from '../utils/assets';

const ImageTest: React.FC = () => {
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Collect debug information
    const info = {
      userAgent: navigator.userAgent,
      location: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      timestamp: new Date().toISOString(),
      assets: ASSETS
    };
    setDebugInfo(info);
    console.log('🔍 Debug Information:', info);
  }, []);

  const testImage = async (name: string, url: string) => {
    setImageStatus(prev => ({ ...prev, [name]: 'loading' }));
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`Testing ${name}:`, response.status, response.statusText);
      
      if (response.ok) {
        setImageStatus(prev => ({ ...prev, [name]: 'success' }));
        console.log(`✅ ${name} is accessible`);
      } else {
        setImageStatus(prev => ({ ...prev, [name]: 'error' }));
        console.error(`❌ ${name} failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setImageStatus(prev => ({ ...prev, [name]: 'error' }));
      console.error(`❌ ${name} error:`, error);
    }
  };

  useEffect(() => {
    // Test all images
    Object.entries(ASSETS).forEach(([name, url]) => {
      testImage(name, url);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Image Loading Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(ASSETS).map(([name, url]) => (
            <div key={name} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{name}</h2>
              <div className="mb-4">
                <img 
                  src={url} 
                  alt={name}
                  className="w-full h-48 object-cover rounded-lg"
                  onLoad={() => setImageStatus(prev => ({ ...prev, [name]: 'success' }))}
                  onError={() => setImageStatus(prev => ({ ...prev, [name]: 'error' }))}
                />
              </div>
              <div className="space-y-2">
                <p><strong>URL:</strong> <code className="text-sm">{url}</code></p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    imageStatus[name] === 'success' ? 'bg-green-100 text-green-800' :
                    imageStatus[name] === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {imageStatus[name] === 'loading' ? '⏳ Loading...' :
                     imageStatus[name] === 'success' ? '✅ Success' :
                     imageStatus[name] === 'error' ? '❌ Error' : '?'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check the browser console for detailed error messages</li>
            <li>Verify that images exist in the <code>public/assets/images/</code> directory</li>
            <li>Ensure file names match exactly (case-sensitive)</li>
            <li>Check if the Vercel deployment is using the latest code</li>
            <li>Try accessing the image URLs directly in a new tab</li>
            <li>Clear browser cache and try again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ImageTest; 