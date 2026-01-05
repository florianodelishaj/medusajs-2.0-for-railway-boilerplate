const checkEnvVariables = require("./check-env-variables")

// Salta check durante build Docker (Railway passa env vars come ARG)
if (process.env.NODE_ENV !== 'production') {
  checkEnvVariables()
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
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
  // async headers() {
  //   // Build connect-src dynamically based on environment
  //   const medusaBackendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  //   const meilisearchUrl = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700';

  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: [
  //             "default-src 'self'",
  //             "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
  //             "style-src 'self' 'unsafe-inline'",
  //             "font-src 'self' data: https://js.stripe.com",
  //             "img-src 'self' data: blob: https:",
  //             `connect-src 'self' https://api.stripe.com ${medusaBackendUrl} ${meilisearchUrl}`,
  //             "frame-src https://js.stripe.com https://hooks.stripe.com",
  //           ].join('; '),
  //         },
  //       ],
  //     },
  //   ]
  // },
}

module.exports = nextConfig
