import { getBaseURL } from "@lib/util/env"

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/cart",
          "/*/checkout",
          "/*/account",
          "/*/search",
          "/*/results",
          "/*/order/confirmed",
          "/*/forgot-password",
          "/*/reset-password",
        ],
      },
    ],
    sitemap: `${getBaseURL()}/sitemap.xml`,
  }
}
