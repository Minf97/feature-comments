import type { NextConfig } from "next";
import { codeInspectorPlugin } from "code-inspector-plugin";


const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }));
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
