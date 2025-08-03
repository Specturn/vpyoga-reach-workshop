// Simple asset paths - direct approach
export const ASSETS = {
  DR_VENKATESH_IMAGE: '/assets/images/image.png',
  UPI_QR_CODE: '/assets/images/UPI-QR.jpeg',
} as const;

// Debug function to log all asset paths
export const debugAssets = () => {
  console.log('🔍 Asset Debug Information:');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Base URL:', import.meta.env.BASE_URL);
  console.log('Assets:', ASSETS);
  
  // Test if assets are accessible
  Object.entries(ASSETS).forEach(([name, path]) => {
    console.log(`${name}: ${path}`);
  });
}; 