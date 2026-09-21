/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://aig.wealthcareportal.com",
  generateRobotsTxt: false, // app/robots.txt/route.ts is the source of truth
  // ...other options
  exclude: ["/admin/*", "/login", "/register"], // Exclude specific paths from the sitemap
  exclude: ["/admin/*", "/login", "/register"], // Exclude specific paths from the sitemap
};
