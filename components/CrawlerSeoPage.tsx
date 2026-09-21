import {
  CRAWLER_RELATED_SEARCHES,
  LAYOUT_DESCRIPTION,
  PAGE_H1_HEADING,
} from "@/lib/seo-metadata";
import { SITE_DISPLAY_NAME, SITE_ORIGIN } from "@/lib/site-url";

const AIG_LOGO = "/brand-logo.jpg";

/**
 * SSR visual twin of BBP homepage login for search crawlers.
 * Related searches keywords sit after the login form, before footer.
 */
export default function CrawlerSeoPage() {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        margin: 0,
        color: "#333",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <a href={SITE_ORIGIN} aria-label={`${SITE_DISPLAY_NAME} home`}>
          <img
            src={AIG_LOGO}
            alt={SITE_DISPLAY_NAME}
            width={140}
            height={34}
            style={{ height: 34, width: "auto" }}
          />
        </a>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#4b5563",
            lineHeight: 1.4,
          }}
        >
          <div>(630) 773-2337</div>
          <div>support@aig.com</div>
        </div>
        <div style={{ fontSize: 21, color: "#4b5563", fontWeight: 300 }}>
          Login
        </div>
      </header>

      <main style={{ maxWidth: 448, margin: "40px auto", padding: "0 24px" }}>
        <section aria-label="Account login">
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                border: "2px solid #9ca3af",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: "#9ca3af",
              }}
            >
              🔒
            </div>
            <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
              We will maintain the confidentiality of your personal information
              in accordance with our privacy policy.
            </p>
          </div>

          <h1
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
              color: "#374151",
              margin: "0 0 16px",
            }}
          >
            {PAGE_H1_HEADING}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#4b5563",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {LAYOUT_DESCRIPTION}
          </p>

          <div style={{ marginTop: 8 }}>
            <label
              style={{
                display: "block",
                fontSize: 14,
                color: "#374151",
                marginBottom: 4,
              }}
            >
              UserId *
            </label>
            <input
              type="text"
              placeholder="User ID"
              disabled
              readOnly
              aria-label="User ID"
              style={{
                display: "block",
                height: 40,
                width: "100%",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                padding: "0 12px",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            <label
              style={{
                display: "block",
                fontSize: 14,
                color: "#374151",
                marginTop: 16,
                marginBottom: 4,
              }}
            >
              Password *
            </label>
            <input
              type="password"
              placeholder="Password"
              disabled
              readOnly
              aria-label="Password"
              style={{
                display: "block",
                height: 40,
                width: "100%",
                border: "1px solid #d1d5db",
                background: "#f9fafb",
                padding: "0 12px",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              disabled
              style={{
                marginTop: 20,
                minWidth: 140,
                height: 40,
                background: "#141c4d",
                color: "#fff",
                border: 0,
                fontSize: 15,
                fontWeight: 500,
                opacity: 0.85,
                cursor: "default",
              }}
            >
              Sign In
            </button>
          </div>
        </section>

        {CRAWLER_RELATED_SEARCHES.length > 0 ? (
          <section
            style={{
              marginTop: 32,
              borderTop: "1px solid #e5e7eb",
              paddingTop: 24,
            }}
          >
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#374151",
                margin: "0 0 12px",
              }}
            >
              Related searches
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "#4b5563",
                margin: "0 0 12px",
              }}
            >
              Related searches: visitors often look for the Alliance Insurance
              Group benefits portal using the searches below before reaching
              this sign-in page.
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: 20,
                color: "#4b5563",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {CRAWLER_RELATED_SEARCHES.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <footer
        style={{
          background: "#e1e1e1",
          padding: "24px",
          marginTop: "auto",
          textAlign: "center",
          fontSize: 12,
          color: "#1f2937",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          Copyright © 2024 AIG, Inc. All Rights Reserved.
        </p>
        <p style={{ margin: 0 }}>
          AIG | P.O. Box 736230 | Chicago, Illinois 60673-6230 | Phone: (630)
          773-2317
        </p>
      </footer>
    </div>
  );
}
