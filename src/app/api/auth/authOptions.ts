import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/server/data/mongodb'
import { AuthUseCase } from '@/server/domain/usecases/auth/AuthUseCases'
import { UserRepositoryMongoDBImp } from '@/server/data/user/UserRepositoryMongoDBImp'
import { GOOGLE_ID, GOOGLE_SECRET } from '@/server/config'

const userRepository = new UserRepositoryMongoDBImp()
const authUseCase = new AuthUseCase(userRepository)

export const authOptions: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          try {
            await connectDB();
  
            if (!credentials?.email || !credentials?.password) {
              throw new Error('Invalid credentials');
            }
  
            // @ts-expect-error - credentials is not typed
            return await authUseCase.authenticate({
              email: credentials.email,
              password: credentials.password
            });
          } catch (error) {
            console.error('Auth error:', error);
            throw error;
          }
        }
      })
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        // For Google OAuth, just verify the email is verified
        if (account?.provider === 'google') {
          const isEmailVerified = (profile as any)?.email_verified === true;
          return isEmailVerified;
        }
        return true;
      },
      async jwt({ token, user, account, profile }) {
        // If this is a new sign-in with Google
        if (account?.provider === 'google' && profile) {
          try {
            const userFromDB = await authUseCase.googleSignIn({
              email: profile.email as string,
              name: profile.name as string,
            });
            
            if (userFromDB) {
              token.id = userFromDB.id;
              token.email = userFromDB.email;
              token.name = userFromDB.name;
            } else {
              console.log('🔐 Google SignIn: User not found in DB');
            }
          } catch (error) {
            console.error('🔐 Google SignIn Error in JWT:', error);
            // Don't fail the auth, just log the error
          }
        }
        
        return token;
      },
      async session({ session, token }) {
        console.log('🔐 Session Callback:', { 
          hasSession: !!session, 
          hasToken: !!token,
          tokenId: token.id,
          sessionUser: session?.user?.email 
        })
        
        if (session?.user) {
          (session.user as any).id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
        }
        return session;
      }
    },
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug mode in production temporarily
    // Fix cookie configuration for production
    cookies: {
      sessionToken: {
        name: '__Secure-next-auth.session-token',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
          // Don't set domain for vercel.app subdomains
        }
      },
      callbackUrl: {
        name: '__Secure-next-auth.callback-url',
        options: {
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      },
      csrfToken: {
        name: '__Host-next-auth.csrf-token',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
        }
      }
    }
  }