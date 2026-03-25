import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // M2: CSP headers to mitigate XSS risk with JWT in localStorage
  // TODO: Migrate to httpOnly cookie-based auth via a BFF pattern for full XSS protection
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              `connect-src 'self' https: ${process.env.NODE_ENV === 'development' ? 'http://localhost:*' : ''}`.trim(),
              "font-src 'self' data:",
            ].join("; ") + ";",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
