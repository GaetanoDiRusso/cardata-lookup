import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/server/data/mongodb'
import { AuthUseCase } from '@/server/domain/usecases/auth/AuthUseCases'
import { UserRepositoryMongoDBImp } from '@/server/data/user/UserRepositoryMongoDBImp'
import { GOOGLE_ID, GOOGLE_SECRET } from '@/server/config'

const userRepository = new UserRepositoryMongoDBImp()
const authUseCase = new AuthUseCase(userRepository)

// Debug logging for production
console.log('🔐 Auth Config Debug:', {
  GOOGLE_ID: GOOGLE_ID ? '✅ Set' : '❌ Missing',
  GOOGLE_SECRET: GOOGLE_SECRET ? '✅ Set' : '❌ Missing',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Missing',
  NODE_ENV: process.env.NODE_ENV
})

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
        console.log('🔐 SignIn Callback:', { 
          provider: account?.provider, 
          emailVerified: (profile as any)?.email_verified,
          user: user?.email 
        })
        
        // For Google OAuth, just verify the email is verified
        if (account?.provider === 'google') {
          const isEmailVerified = (profile as any)?.email_verified === true;
          console.log('🔐 Google SignIn Result:', { isEmailVerified, email: profile?.email });
          return isEmailVerified;
        }
        return true;
      },
      async jwt({ token, user, account, profile }) {
        console.log('🔐 JWT Callback:', { 
          hasToken: !!token, 
          hasUser: !!user, 
          provider: account?.provider,
          tokenId: token.id 
        })
        
        // If this is a new sign-in with Google
        if (account?.provider === 'google' && profile) {
          try {
            console.log('🔐 Attempting Google SignIn in JWT callback');
            const userFromDB = await authUseCase.googleSignIn({
              email: profile.email as string,
              name: profile.name as string,
            });
            
            if (userFromDB) {
              console.log('🔐 Google SignIn Success:', { userId: userFromDB.id, email: userFromDB.email });
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
  }