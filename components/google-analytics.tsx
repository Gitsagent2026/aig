"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

function normalizedMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  if (!raw) return null
  return /^G-[A-Z0-9]+$/i.test(raw) ? raw : null
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const measurementId = normalizedMeasurementId()

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") return
    const query = searchParams?.toString()
    const pagePath = query ? `${pathname}?${query}` : pathname
    window.gtag("config", measurementId, { page_path: pagePath })
  }, [measurementId, pathname, searchParams])

  if (!measurementId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
