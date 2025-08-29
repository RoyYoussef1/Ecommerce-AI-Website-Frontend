import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // الدومينات المسموح تجيب منها صور
    domains: ["localhost"], 
  },
};

export default nextConfig;
