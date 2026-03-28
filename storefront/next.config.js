// Salta check durante build Docker e runtime production
if (process.env.NODE_ENV !== 'production') {
  const checkEnvVariables = require("./check-env-variables")
  checkEnvVariables()
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        // Note: needed to serve images from /public folder
        protocol: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https")
          ? "https"
          : "http",
        hostname: process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ""),
      },
      {
        // Note: only needed when using local-file for product media
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(
          "https://",
          ""
        ),
      },
      {
        // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        // Note: can be removed after deleting demo products
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        // Placeholder images (rimuovere quando si usano immagini reali)
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // Covers all Railway MinIO buckets (dev and prod)
        protocol: "https",
        hostname: "*.up.railway.app",
      },
      ...(process.env.NEXT_PUBLIC_MINIO_ENDPOINT
        ? [
            {
              // Note: needed when using MinIO bucket storage for media
              protocol: "https",
              hostname: process.env.NEXT_PUBLIC_MINIO_ENDPOINT,
            },
          ]
        : []),
    ],
  },
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
  async headers() {
    const medusaBackendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const meilisearchUrl = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || 'http://localhost:7700';
    const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT ? `https://${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}` : '';

    // In dev Next.js usa eval() per webpack source maps: unsafe-eval necessario
    const isDev = process.env.NODE_ENV !== 'production'
    const csp = [
      "default-src 'self'",
      // Next.js App Router richiede unsafe-inline per gli script di hydration
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com https://embeds.iubenda.com https://cdn.iubenda.com`,
      "style-src 'self' 'unsafe-inline' https://cdn.iubenda.com",
      "font-src 'self' data:",
      // blob: necessario per MapLibre GL WebWorkers
      "worker-src blob:",
      `img-src 'self' data: blob: https: ${minioEndpoint}`,
      `connect-src 'self' https://api.stripe.com ${medusaBackendUrl} ${meilisearchUrl} ${minioEndpoint} https://api.maptiler.com https://idb.iubenda.com`,
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

module.exports = nextConfig
