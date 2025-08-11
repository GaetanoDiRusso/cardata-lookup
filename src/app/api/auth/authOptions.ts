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
        // if (account?.provider === 'google') {
        //   try {
        //     await authUseCase.googleSignIn({
        //       email: profile?.email as string,
        //       name: profile?.name as string,
        //     });
        //   } catch (error) {
        //     console.error('SignIn error:', error);
        //     return false;
        //   }
        // }
        return (profile as any)?.email_verified && account?.provider === 'google';
      },
      async jwt({ token, user }) {
        if (user) {
          const userFromDB = await authUseCase.googleSignIn({
            email: user?.email as string,
            name: user?.name as string,
          });
  
          if (userFromDB) {
            token.id = userFromDB.id;
          }
        }
  
        return token;
      },
      async session({ session, token }) {
        if (session?.user) {
          (session.user as any).id = token.id as string;
        }
        return session;
      }
    },
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: 'jwt',
      // maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
  }