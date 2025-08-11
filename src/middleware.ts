import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AUTH_ROUTES } from './constants/authRoutes';
import { getLoginRoute } from './constants/navigationRoutes';
import { TESTING_BASE_PATH, isTestingEnabled } from './constants/testingRoutes';

const authRoutes = AUTH_ROUTES;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip middleware for testing routes ONLY in development
  if (isTestingEnabled() && path.startsWith(TESTING_BASE_PATH)) {
    return NextResponse.next();
  }
  
  const isAuthPath = authRoutes.some((route) => path.startsWith(route));
  const secret = process.env.NEXTAUTH_SECRET || "";
  
  // Use the correct cookie name based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieName = isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
  
  const isLoggedIn = await getToken({ req, secret, cookieName });

  console.log({ 
    isAuthPath, 
    isLoggedIn, 
    path, 
    authRoutes, 
    cookieName, 
    isProduction,
    NODE_ENV: process.env.NODE_ENV
  });

  // Users that are already logged in should not be able to access public (auth) paths (login, signup, forgot password..)
  if (isAuthPath && isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Users that are not logged in should not be able to access protected (app) paths
  if (!isAuthPath && !isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = getLoginRoute();
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
