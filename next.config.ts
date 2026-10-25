import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 90 for the Work strip, where every screenshot should hold up to a zoom.
  images: { qualities: [75, 90] },
  redirects() {
    // /journal became /writings; old links stay good.
    return [
      { source: "/journal", destination: "/writings", permanent: true },
      {
        source: "/journal/:slug",
        destination: "/writings/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
