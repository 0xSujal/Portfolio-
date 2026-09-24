import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — the repo sits inside a home dir that has its own
  // lockfile, which Turbopack would otherwise pick up.
  turbopack: { root: __dirname },

  // Heavy work assets (video, render stills) live in R2, not /public — see
  // src/lib/assets.ts. Next's image optimizer needs the remote host
  // allowlisted to fetch and resize them. Cache-Control for these is set
  // directly on the R2 object at upload time (scripts/upload-to-r2.mjs),
  // since Next's own headers() only covers locally-served files.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-4835845db7a34dddabc159a00df2916f.r2.dev",
      },
    ],
  },
};

export default nextConfig;
