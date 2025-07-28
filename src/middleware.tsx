// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Log de la requête
  console.log('Requête:', request.nextUrl.pathname)
  
  // Continuer vers la page suivante
  return NextResponse.next()
}

// Optionnel: configurer sur quelles routes le middleware s'applique
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}