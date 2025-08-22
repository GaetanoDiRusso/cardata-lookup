import type { NextConfig } from "next";
import { NEXTAUTH_URL, NEXTAUTH_SECRET } from "./src/server/config";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL,
    NEXTAUTH_SECRET,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
};

export default nextConfig;
