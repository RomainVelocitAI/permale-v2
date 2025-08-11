// Configuration centralisée pour l'application

export const getBaseUrl = () => {
  // En production (Vercel), utiliser l'URL de production
  if (process.env.NODE_ENV === 'production') {
    return 'https://permale-v2.vercel.app';
  }
  
  // Pour Vercel Preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // En développement local
  if (typeof window !== 'undefined') {
    // Côté client
    return window.location.origin;
  }
  
  // Côté serveur en développement
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

export const config = {
  baseUrl: getBaseUrl(),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};