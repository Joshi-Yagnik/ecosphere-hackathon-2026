import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix: suppress lockfile warning when multiple package-lock.json files exist
  // in a monorepo-style project structure.
  /* config options here */
};

export default nextConfig;
