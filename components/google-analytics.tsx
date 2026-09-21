import Script from "next/script"

function normalizedMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  if (!raw) return null
  return /^G-[A-Z0-9]+$/i.test(raw) ? raw : null
}

export function GoogleAnalytics() {
  const measurementId = normalizedMeasurementId()
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
