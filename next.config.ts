import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
