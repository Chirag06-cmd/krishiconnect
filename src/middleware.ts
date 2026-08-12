import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static') || pathname.endsWith('.ico') || pathname.endsWith('.png')) {
    return NextResponse.next()
  }

  // A mock cookie to check if user is "logged in"
  const isLoggedIn = request.cookies.has('mock-auth');

  // Define public paths that don't require login
  const publicPaths = ['/', '/login', '/signup', '/about', '/contact'];

  // If user is logged in and tries to access login/signup page, redirect to dashboard
  if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is not logged in and tries to access a protected dashboard page
  if (!isLoggedIn && pathname.startsWith('/dashboard') && !publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
