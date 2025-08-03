import React, { useState, useEffect } from 'react';
import { ASSETS } from '../utils/assets';

const AssetDebugger: React.FC = () => {
  const [assetStatus, setAssetStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (import.meta.env.DEV || localStorage.getItem('showAssetDebugger') === 'true') {
      setIsVisible(true);
    }
  }, []);

  const testAsset = async (name: string, url: string) => {
    setAssetStatus(prev => ({ ...prev, [name]: 'loading' }));
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setAssetStatus(prev => ({ ...prev, [name]: 'success' }));
        console.log(`✅ Asset loaded successfully: ${name} (${url})`);
      } else {
        setAssetStatus(prev => ({ ...prev, [name]: 'error' }));
        console.error(`❌ Asset failed to load: ${name} (${url}) - Status: ${response.status}`);
      }
    } catch (error) {
      setAssetStatus(prev => ({ ...prev, [name]: 'error' }));
      console.error(`❌ Asset failed to load: ${name} (${url}) - Error:`, error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Test all assets
      Object.entries(ASSETS).forEach(([name, url]) => {
        testAsset(name, url);
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-sm z-50 max-w-xs">
      <h3 className="font-bold mb-2">Asset Debugger</h3>
      <div className="space-y-1">
        {Object.entries(ASSETS).map(([name, url]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="truncate">{name}:</span>
            <span className={`ml-2 ${
              assetStatus[name] === 'success' ? 'text-green-400' :
              assetStatus[name] === 'error' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {assetStatus[name] === 'loading' ? '⏳' :
               assetStatus[name] === 'success' ? '✅' :
               assetStatus[name] === 'error' ? '❌' : '?'}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="mt-2 text-xs text-gray-400 hover:text-white"
      >
        Close
      </button>
    </div>
  );
};

export default AssetDebugger; 