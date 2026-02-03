# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Permale is a jewelry project management application built with Next.js 15 and TypeScript. It manages client jewelry projects through Airtable integration, supporting AI-generated jewelry images and client presentations.

## Development Commands

```bash
# Development
npm run dev          # Start development server on 0.0.0.0:3000 with Turbopack
bash start.sh        # Alternative development start script

# Production
npm run build        # Build for production
npm run start        # Run production server

# Quality
npm run lint         # Run ESLint

# Testing & Utilities
npm run create-test  # Create test record in Airtable (node create-test-record.js)
node create-airtable-fields.js  # Check/verify Airtable field configuration
node create-fields-metadata.js  # Generate field metadata for Airtable
```

## Architecture

### Tech Stack
- **Next.js 15.4.2** with App Router and Turbopack
- **TypeScript** with strict mode
- **Tailwind CSS v4** via PostCSS
- **Airtable** as the data backend
- **Framer Motion** for animations
- **OpenAI API** for image generation
- **GitHub/Cloudinary** for image storage

### Critical Airtable Configuration
```
Base Name: "Joaillerie Permale"
Base ID: appX1G5XuBKe4po97
Table Name: "Projets"
Table ID: tbld55N3Bmz9hKBqe
```

### Environment Variables
Required in `.env.local`:
```bash
# Airtable (Required)
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=appX1G5XuBKe4po97
AIRTABLE_TABLE_NAME=Projets

# Upload Provider (Required)
UPLOAD_PROVIDER=github  # Options: github, cloudinary, local

# GitHub Provider (If UPLOAD_PROVIDER=github)
GITHUB_TOKEN=
GITHUB_OWNER=RomainVelocitAI
GITHUB_REPO=permale-images
GITHUB_BRANCH=main

# OpenAI (Optional)
OPENAI_API_KEY=

# Authentication (Optional)
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Data Model

### TypeScript Types (`/types/index.ts`)
- **Projet**: Main jewelry project interface with 25+ fields
- **TypeBijou**: Enum of jewelry types (Alliance, Bague de Fiançailles, etc.)

### Airtable Field Mappings
The application maps TypeScript fields to Airtable columns with specific transformations:
- TypeBijou uses the new field "Type de bijou (nouveau)" with 10 exact options
- Images field expects array of `{url, filename}` objects
- Budget is stored as number in Airtable
- photosModele URLs are extracted from Airtable attachments

### AI Image Fields
Projects support 5 AI-generated images:
- `imageIA1` through `imageIA5`: Individual image URLs
- `imageSelectionnee`: Currently selected/featured image
- `urlPresentation`: Auto-generated presentation URL

## API Routes

| Route | Method | Purpose |
|-------|---------|---------|
| `/api/projets` | GET | Fetch all projects (sorted by date) |
| `/api/projets?id={id}` | GET | Fetch specific project |
| `/api/projets` | POST | Create new project |
| `/api/projets` | PUT | Update project (images, selection) |
| `/api/projets/presentation` | GET | Fetch project for public presentation |
| `/api/generate-image` | POST | Generate AI jewelry images |
| `/api/auth/login` | POST | Admin authentication |
| `/api/auth/logout` | POST | Admin logout |

## Image Upload System

### Provider Pattern (`/lib/upload-service.ts`)
The system uses a modular provider pattern supporting:
- **LocalProvider**: Data URLs for development
- **GitHubProvider**: GitHub repository storage (production)
- **CloudinaryProvider**: Cloudinary CDN (alternative)

### GitHub Image Storage
Images are organized in: `projets/{year}/{month}/{timestamp}-{random}-{filename}`

Upload flow:
1. Client converts image to base64
2. Server receives base64 string
3. Provider uploads to GitHub/Cloudinary
4. Returns public URL for Airtable storage

### Image Generation
- Uses OpenAI DALL-E integration (`/lib/gpt-image-jewelry-service.ts`)
- Generates jewelry prompts based on project details
- Supports batch generation of multiple variations

## Key Implementation Details

### Airtable Integration (`/lib/airtable.ts`)
- Lazy initialization pattern for Airtable client
- Automatic URL presentation generation on project creation
- Field mapping with type conversions and defaults
- Photo extraction from Airtable attachment fields

### URL Presentation System
Projects get automatic presentation URLs:
- Format: `/presentation/{nom}-{prenom}-{recordId}`
- Generated on project creation
- Stored in `URL Presentation` field

### TypeScript Configuration
- Target: ES2017
- Module: ESNext with bundler resolution
- Strict mode enabled
- Path alias: `@/*` maps to root

## Known Issues & TODOs

### Field Mapping Limitations
- TypeBijou mapping is simplified (loses specific type detail)
- aUnModele is calculated from photosModele presence
- Some fields return default values when not properly mapped

### Pending Features
- Complete OpenAI image generation integration
- Full TypeBijou bidirectional mapping
- Cloudinary provider implementation
- Test coverage for API routes

## Deployment

### Vercel Configuration
The project includes `vercel.json` with:
- Next.js framework configuration
- La Réunion region deployment
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Static asset caching optimization

### Netlify Configuration
The project includes `netlify.toml` with:
- Next.js plugin configuration
- Security headers
- Optimized caching for assets
- Standalone output mode

### Production Checklist
1. Set all required environment variables
2. Configure upload provider (GitHub recommended)
3. Verify Airtable base/table IDs
4. Test image upload functionality
5. Validate presentation URLs

## Project-Specific Notes

### No Test Framework
This project currently has no test framework configured. Tests are limited to:
- Manual testing via `npm run create-test` for Airtable integration
- Airtable field verification utilities

### Critical Files
- `/lib/airtable.ts`: Core Airtable integration - handles all database operations
- `/lib/upload-service.ts`: Image upload abstraction layer
- `/app/api/projets/route.ts`: Main API endpoint for CRUD operations
- `/types/index.ts`: TypeScript interfaces defining the data model

### Database Information
- **Base**: "Joaillerie Permale" (nouvelle base dupliquée)
- **Base ID**: appX1G5XuBKe4po97
- **Table**: "Projets"
- **Structure**: Identique à l'ancienne base "Joaillerie Siva"