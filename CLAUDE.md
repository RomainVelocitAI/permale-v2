# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Permale is a jewelry project management application built with Next.js 15 and TypeScript. It integrates with Airtable to manage client information and jewelry project details.

## Development Commands

```bash
# Start development server (on 0.0.0.0:3000)
npm run dev

# Or use the start script
bash start.sh

# Build for production
npm run build

# Run production server
npm run start

# Run linting
npm run lint
```

## Architecture

### Tech Stack
- **Next.js 15.4.2** with App Router and Turbopack
- **TypeScript** with strict mode
- **Tailwind CSS v4** via PostCSS
- **Airtable** as the data backend

### Key Directories
- `/app/api/` - API routes for Airtable operations
- `/components/` - React components (DetailProjet, FormulaireClient, ListeProjets)
- `/lib/airtable.ts` - Airtable integration layer
- `/types/` - TypeScript type definitions

### Data Model
Projects in Airtable include:
- Client info: Nom, Prenom, Email, Telephone
- Project details: Type de bijou, Budget, Description, Occasion, Pour qui
- Customization: A un modele (boolean), Photos modele (array), Gravure
- Scheduling: Date de livraison
- Media: Images (array), Image selectionnee
- Metadata: Date de creation

### Environment Variables
Required in `.env.local`:
```
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=appXBgsSjbSGjAGqA
AIRTABLE_TABLE_NAME=Projets
```

**Important**: 
- The Airtable base name is "Joaillerie Siva" (NOT "Permale")
- The base ID is `appXBgsSjbSGjAGqA`
- The table name is "Projets" with ID `tbld55N3Bmz9hKBqe`

## Key Implementation Notes

1. **Server Components by Default**: All components are server components unless marked with 'use client'

2. **API Pattern**: RESTful routes in `/app/api/` handle all Airtable operations

3. **Type Safety**: Use the `Projet` type from `/types/index.ts` for all project-related operations

4. **Routing**: The home page (`/`) automatically redirects to `/projets`

5. **Image Handling**: Projects support multiple images with a selected image feature

## Common Tasks

### Adding New API Endpoints
Create new route handlers in `/app/api/` following the Next.js App Router conventions.

### Modifying the Data Model
1. Update the TypeScript types in `/types/`
2. Adjust the Airtable field mappings in API routes
3. Update components to handle new fields

### Working with Airtable
The `/lib/airtable.ts` file provides the base configuration. All Airtable operations should go through the API routes for proper error handling and data transformation.

## Current Implementation Status

### Incomplete Features (TODOs in code)
- Several Airtable field mappings are commented out in `/lib/airtable.ts`
- Image generation API integration is pending
- TypeBijou select field needs proper Airtable mapping
- Some project fields not fully implemented (photosModele, etc.)

### API Routes Pattern
- GET `/api/projets` - Fetch all projects
- GET `/api/projets?id={id}` - Fetch specific project
- POST `/api/projets` - Create new project
- PUT `/api/projets` - Update project (mainly for images)

### TypeScript Types
The main `Projet` interface includes all jewelry project fields. The `TypeBijou` enum defines all jewelry types (Alliance, Bague de Fiançailles, Chevalière, etc.).

## Image Upload System

### Architecture
- Modular upload service with provider pattern (`/lib/upload-service.ts`)
- Supports multiple providers: local (dev), GitHub, Cloudinary
- Images are converted to base64 on the client before upload
- Provider uploads images and returns URLs for Airtable

### GitHub Provider Setup
1. Create GitHub Personal Access Token with 'repo' scope
2. Configure environment variables:
   ```
   UPLOAD_PROVIDER=github
   GITHUB_TOKEN=your_token
   GITHUB_OWNER=RomainVelocitAI
   GITHUB_REPO=permale-images
   ```
3. Images are stored in: `https://github.com/RomainVelocitAI/permale-images`

### Local Development
By default, uses LocalProvider which returns data URLs. For production, switch to GitHub or Cloudinary provider.