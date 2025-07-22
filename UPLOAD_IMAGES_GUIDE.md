# Guide d'Upload d'Images pour Permale

## Architecture Actuelle

L'application utilise une architecture modulaire pour gérer l'upload d'images :

1. **Frontend** : Conversion des fichiers en base64
2. **API Route** : Réception et traitement des images
3. **Service d'Upload** : Gestion modulaire des providers (local/cloud)
4. **Airtable** : Stockage des URLs des images

## Fonctionnement en Local

### 1. Le formulaire client
- Les fichiers sélectionnés sont convertis en base64
- Les données sont envoyées à l'API en JSON

### 2. L'API route `/api/projets`
- Reçoit les images en base64
- Utilise le `LocalProvider` qui retourne des data URLs
- Envoie ces URLs à Airtable

### 3. Airtable
- Reçoit les URLs (data URLs en local)
- Les stocke dans le champ "Photos modele"

## Configuration pour Netlify

### Option 1 : Cloudinary (Recommandé)

1. **Créer un compte Cloudinary**
   - Obtenir : Cloud Name, API Key, API Secret

2. **Variables d'environnement Netlify**
   ```
   UPLOAD_PROVIDER=cloudinary
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```

3. **Implémenter le CloudinaryProvider**
   ```typescript
   // Dans lib/upload-service.ts
   async upload(file: string, filename: string): Promise<string> {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('upload_preset', 'votre_preset');
     
     const response = await fetch(
       `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
       { method: 'POST', body: formData }
     );
     
     const data = await response.json();
     return data.secure_url;
   }
   ```

### Option 2 : Netlify Large Media

1. **Activer Netlify Large Media**
   - Dans les paramètres du site Netlify

2. **Utiliser Git LFS**
   ```bash
   git lfs track "*.jpg" "*.png" "*.jpeg"
   git add .gitattributes
   git commit -m "Configure Git LFS"
   ```

### Option 3 : Service tiers (AWS S3, etc.)

1. **Configurer le service**
2. **Créer un nouveau Provider**
3. **Ajouter les variables d'environnement**

## Limitations

### Netlify
- Taille max des requêtes : 6MB
- Timeout des fonctions : 10 secondes (26s en Pro)
- Pas de stockage persistant

### Airtable
- Les URLs doivent être publiquement accessibles
- Taille max par attachment : 5GB
- Types de fichiers : tous supportés

## Migration de Local vers Production

1. **Changer le provider**
   ```env
   # .env.local (dev)
   UPLOAD_PROVIDER=local
   
   # Netlify (prod)
   UPLOAD_PROVIDER=cloudinary
   ```

2. **Configurer les variables d'environnement**
   - Dans Netlify Dashboard > Site settings > Environment variables

3. **Tester l'upload**
   - Vérifier que les images sont bien uploadées
   - Vérifier qu'Airtable peut accéder aux URLs

## Dépannage

### Erreur "Request body too large"
- Réduire la taille/qualité des images côté client
- Implémenter une compression avant l'upload

### Erreur "Function timeout"
- Utiliser un upload asynchrone
- Implémenter un système de queue

### Images non visibles dans Airtable
- Vérifier que les URLs sont publiques
- Vérifier les CORS si nécessaire

## Code d'exemple pour compression d'image

```javascript
async function compressImage(file, maxWidth = 1920) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```