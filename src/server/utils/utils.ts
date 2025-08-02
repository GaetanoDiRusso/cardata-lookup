import {randomBytes} from 'crypto';
import { getCreateNewPasswordRoute, getVerifyAccountRoute } from '@/constants/navigationRoutes';

export const getRandomAlphanumericString = (length: number): string => {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += possibleChars.charAt(bytes[i] % possibleChars.length);
  }
  return result;
}

export const composeAccountVerificationLink = (token: string): string => {
  return `${process.env.NEXTAUTH_URL}/${getVerifyAccountRoute()}?token=${token}`;
};

export const composePasswordResetLink = (token: string): string => {
  return `${process.env.NEXTAUTH_URL}/${getCreateNewPasswordRoute()}?token=${token}`;
};
