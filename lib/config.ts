// Configuration centralisée pour l'application

export const getBaseUrl = () => {
  // En production (Netlify), utiliser l'URL de production
  if (process.env.NODE_ENV === 'production') {
    return 'https://permale.netlify.app';
  }
  
  // Pour Netlify Deploy Preview et Branch deploys
  if (process.env.DEPLOY_URL) {
    return process.env.DEPLOY_URL;
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