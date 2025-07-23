import { NextRequest, NextResponse } from 'next/server'

// Utilisateur unique autorisé
// IMPORTANT : Changer ces identifiants avant de déployer !
const AUTHORIZED_USER = {
  email: process.env.ADMIN_EMAIL || 'siva@permale.com',
  password: process.env.ADMIN_PASSWORD || 'Azalees2025'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Vérifier les credentials
    const isValidUser = email === AUTHORIZED_USER.email && password === AUTHORIZED_USER.password

    if (!isValidUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Créer un token simple avec timestamp
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    // Créer la réponse avec le cookie
    const response = NextResponse.json({ 
      success: true, 
      token,
      user: { email: AUTHORIZED_USER.email }
    })

    // Définir le cookie httpOnly pour plus de sécurité
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return response

  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}