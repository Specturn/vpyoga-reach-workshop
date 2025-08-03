// Utility function to handle asset paths properly
export const getAssetPath = (path: string): string => {
  // In development, use the path as is
  if (import.meta.env.DEV) {
    return path;
  }
  
  // In production, ensure the path starts with /
  return path.startsWith('/') ? path : `/${path}`;
};

// Specific asset paths
export const ASSETS = {
  DR_VENKATESH_IMAGE: getAssetPath('/assets/images/image.png'),
  UPI_QR_CODE: getAssetPath('/assets/images/UPI-QR.jpeg'),
} as const; 