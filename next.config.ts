import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/PFE_2nd_try' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/PFE_2nd_try' : '',
};

export default nextConfig;
