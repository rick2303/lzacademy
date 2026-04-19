import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www → non-www (301 permanent)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lz-englishacademy.com" }],
        destination: "https://lz-englishacademy.com/:path*",
        permanent: true,
      },
      // Rutas de mercado eliminadas → home (301 permanent)
      { source: "/mexico", destination: "/", permanent: true },
      { source: "/colombia", destination: "/", permanent: true },
      { source: "/honduras", destination: "/", permanent: true },
      { source: "/latinos-usa", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
