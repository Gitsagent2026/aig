/** @type {import('next-sitemap').IConfig} */
const SITE_URL = process.env.SITE_URL || "https://aigwealthcareportal.com"
const PUBLIC_UI_ROUTES = new Set(["/"])

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false,
  exclude: [
    "/api/*",
    "/authentication/*",
    "/blocked",
    "/forgot-password*",
    "/new-user*",
    "/verify*",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap_index.xml",
  ],
  transform: async (_config, path) => {
    if (!PUBLIC_UI_ROUTES.has(path)) return null
    return {
      loc: path,
      changefreq: "weekly",
      priority: path === "/" ? 1 : 0.8,
      alternateRefs: [],
    }
  },
}
