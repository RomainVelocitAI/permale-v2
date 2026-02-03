// Service d'upload modulaire pour gérer les images
// Supporte différents providers (local, Cloudinary, GitHub, etc.)

import { Octokit } from '@octokit/rest';

export interface UploadProvider {
  upload(file: File | Buffer | string, filename: string): Promise<string>;
  delete?(url: string): Promise<void>;
}

// Provider pour le développement local
// Stocke temporairement les images encodées en base64
export class LocalProvider implements UploadProvider {
  async upload(file: File | Buffer | string, filename: string): Promise<string> {
    // En local, on retourne une data URL base64
    // Cette approche ne fonctionnera pas en production mais est parfaite pour les tests
    if (typeof file === 'string') {
      // Si c'est déjà une base64 string
      return file.startsWith('data:') ? file : `data:image/jpeg;base64,${file}`;
    }
    
    // Pour un Buffer
    if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64');
      const mimeType = getMimeType(filename);
      return `data:${mimeType};base64,${base64}`;
    }
    
    // Pour un File object (côté client uniquement)
    throw new Error('File object upload not supported on server side');
  }
}

// Provider pour Cloudinary (à implémenter plus tard)
export class CloudinaryProvider implements UploadProvider {
  private cloudName: string;
  private apiKey: string;
  private apiSecret: string;
  
  constructor(config: { cloudName: string; apiKey: string; apiSecret: string }) {
    this.cloudName = config.cloudName;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }
  
  async upload(file: File | Buffer | string, filename: string): Promise<string> {
    // TODO: Implémenter l'upload vers Cloudinary
    // Pour l'instant, on retourne une URL factice
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/v1234567890/${filename}`;
  }
  
  async delete(url: string): Promise<void> {
    // TODO: Implémenter la suppression sur Cloudinary
  }
}

// Provider pour GitHub
export class GitHubProvider implements UploadProvider {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;
  
  constructor(config: { token: string; owner: string; repo: string; branch?: string }) {
    this.octokit = new Octokit({ auth: config.token });
    this.owner = config.owner;
    this.repo = config.repo;
    this.branch = config.branch || 'main';
  }
  
  async upload(file: File | Buffer | string, filename: string): Promise<string> {
    console.log('[GitHubProvider] Début upload:', filename);
    console.log('[GitHubProvider] Config:', { owner: this.owner, repo: this.repo, branch: this.branch });
    
    try {
      // Générer un chemin unique pour l'image
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const path = `projets/${year}/${month}/${timestamp}-${randomString}-${filename}`;
      
      console.log('[GitHubProvider] Path généré:', path);
      
      // Convertir l'image en base64 si nécessaire
      let content: string;
      if (typeof file === 'string') {
        // Si c'est déjà une data URL, extraire la partie base64
        if (file.startsWith('data:')) {
          content = file.split(',')[1];
          console.log('[GitHubProvider] Data URL détectée, taille base64:', content.length);
        } else {
          content = file;
          console.log('[GitHubProvider] String base64 directe, taille:', content.length);
        }
      } else if (Buffer.isBuffer(file)) {
        content = file.toString('base64');
        console.log('[GitHubProvider] Buffer converti, taille base64:', content.length);
      } else {
        throw new Error('Unsupported file type for GitHub upload');
      }
      
      // Upload vers GitHub - utilise createFile au lieu de createOrUpdateFileContents
      // pour éviter les conflits SHA
      console.log('[GitHubProvider] Appel API GitHub...');
      try {
        const response = await this.octokit.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path: path,
          message: `Upload image: ${filename}`,
          content: content,
          branch: this.branch
        });
        
        console.log('[GitHubProvider] Upload réussi, response:', response.status);
        
        // Retourner l'URL raw de l'image
        const rawUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
        console.log('[GitHubProvider] URL générée:', rawUrl);
        return rawUrl;
      } catch (error: any) {
        console.error('[GitHubProvider] Erreur upload:', error.message);
        console.error('[GitHubProvider] Status:', error.status);
        console.error('[GitHubProvider] Response:', error.response?.data);
        // Si l'erreur est un conflit (409), réessayer avec un nouveau nom
        if (error.status === 409) {
          // File conflict detected, retrying with new filename
          const newPath = `projets/${year}/${month}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${filename}`;
          
          await this.octokit.repos.createOrUpdateFileContents({
            owner: this.owner,
            repo: this.repo,
            path: newPath,
            message: `Upload image: ${filename}`,
            content: content,
            branch: this.branch
          });
          
          return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${newPath}`;
        }
        throw error;
      }
    } catch (error) {
      console.error('[GitHubProvider] Erreur finale:', error);
      throw new Error(`Failed to upload to GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async delete(url: string): Promise<void> {
    try {
      // Extraire le path de l'URL
      const match = url.match(/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\/(.+)$/);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }
      
      const path = match[1];
      
      // Récupérer le SHA actuel du fichier
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path
      });
      
      if ('sha' in data) {
        // Supprimer le fichier
        await this.octokit.repos.deleteFile({
          owner: this.owner,
          repo: this.repo,
          path: path,
          message: `Delete image: ${path}`,
          sha: data.sha,
          branch: this.branch
        });
      }
    } catch (error) {
      throw new Error(`Failed to delete from GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Service principal d'upload
export class UploadService {
  private provider: UploadProvider;
  
  constructor(provider?: UploadProvider) {
    // Par défaut, utilise le provider local
    this.provider = provider || new LocalProvider();
  }
  
  async uploadImages(images: string[], filenames: string[]): Promise<string[]> {
    const results: string[] = [];
    
    // Upload les images une par une pour éviter les conflits simultanés
    for (let i = 0; i < images.length; i++) {
      try {
        // Uploading image
        const url = await this.provider.upload(images[i], filenames[i] || `image-${i}.jpg`);
        results.push(url);
        
        // Petit délai entre les uploads pour éviter les conflits GitHub
        if (i < images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        throw error; // Re-throw pour arrêter le processus si une image échoue
      }
    }
    
    return results;
  }
  
  async uploadImage(image: string, filename: string): Promise<string> {
    return this.provider.upload(image, filename);
  }
}

// Helper pour déterminer le type MIME
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml'
  };
  
  return mimeTypes[ext || 'jpg'] || 'image/jpeg';
}

// Factory pour créer le service selon l'environnement
export function createUploadService(): UploadService {
  const environment = process.env.NODE_ENV;
  const uploadProvider = process.env.UPLOAD_PROVIDER;
  
  console.log('[createUploadService] Environment:', environment);
  console.log('[createUploadService] Upload Provider:', uploadProvider);
  
  // GitHub provider
  if (uploadProvider === 'github') {
    const config = {
      token: process.env.GITHUB_TOKEN!,
      owner: process.env.GITHUB_OWNER || 'RomainVelocitAI',
      repo: process.env.GITHUB_REPO || 'permale-images',
      branch: process.env.GITHUB_BRANCH || 'main'
    };
    console.log('[createUploadService] Configuration GitHub:', {
      owner: config.owner,
      repo: config.repo,
      branch: config.branch,
      tokenExists: !!config.token,
      tokenLength: config.token?.length
    });
    return new UploadService(new GitHubProvider(config));
  }
  
  // En production avec Cloudinary
  if (environment === 'production' && uploadProvider === 'cloudinary') {
    const config = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      apiSecret: process.env.CLOUDINARY_API_SECRET!
    };
    return new UploadService(new CloudinaryProvider(config));
  }
  
  // Par défaut (dev/test), utilise le provider local
  return new UploadService(new LocalProvider());
}