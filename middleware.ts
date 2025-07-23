import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/login', 
  '/api/auth/login', 
  '/presentation', 
  '/api/test-env', 
  '/api/test-generation', 
  '/api/projets/presentation',
  '/api/test-webhook',
  '/api/test-github-upload',
  '/api/test-config'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si c'est une route publique
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Autoriser toutes les pages de présentation (format: /presentation/[id])
  if (pathname.startsWith('/presentation/')) {
    return NextResponse.next()
  }

  // Vérifier le token d'authentification
  const token = request.cookies.get('auth-token')?.value

  // Si pas de token et pas sur une route publique, rediriger vers login
  if (!token && !pathname.startsWith('/login')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // TODO: Valider le token côté serveur
  // Pour l'instant, on vérifie juste s'il existe

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}