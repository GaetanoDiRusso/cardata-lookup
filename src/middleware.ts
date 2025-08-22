import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AUTH_ROUTES } from './constants/authRoutes';
import { getLoginRoute } from './constants/navigationRoutes';
import { TESTING_BASE_PATH, isTestingEnabled } from './constants/testingRoutes';
import { NEXTAUTH_SECRET } from './server/config';
import { AUTH_COOKIE_NAME } from './constants/authConfig';

const authRoutes = AUTH_ROUTES;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip middleware for testing routes ONLY in development
  if (isTestingEnabled() && path.startsWith(TESTING_BASE_PATH)) {
    return NextResponse.next();
  }
  
  const isAuthPath = authRoutes.some((route) => path.startsWith(route));
  const secret = NEXTAUTH_SECRET;
  
  const isLoggedIn = await getToken({ req, secret, cookieName: AUTH_COOKIE_NAME });
  console.log('GAETA :: isLoggedIn', isLoggedIn);
  
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
