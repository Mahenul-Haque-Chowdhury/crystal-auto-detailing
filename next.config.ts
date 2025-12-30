import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    localPatterns: [{ pathname: "/ghora1.png" }],
  },
};

export default nextConfig;
