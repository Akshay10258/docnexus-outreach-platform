import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This tells Next.js and Vercel to trace and bundle the generated SQLite 
    // database file so it is present in the serverless containers at runtime
    outputFileTracingIncludes: {
      "/api/**/*": ["./prisma/dev.db"],
    },
  },
};

export default nextConfig;
