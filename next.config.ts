import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/room", // Or any other desired root page
        permanent: true, // Set to false for temporary redirects (307)
      },
    ];
  },
};

export default nextConfig;
