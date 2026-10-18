import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "GridConnect";
const DEFAULT_DESCRIPTION =
  "GridConnect is a comprehensive platform designed to bridge the gap between racing drivers and teams. It provides role-based dashboards, real-time communication, and discovery tools for the racing community.";

/**
 * Sets document title, meta description, Open Graph, and optional JSON-LD structured data. Cleans up on unmount.
 */
export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  noIndex = false,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // ── Title ──
    const prevTitle = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    // ── Meta helpers ──
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(
        `meta[${attr}="${key}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", ogTitle || title || SITE_NAME);
    setMeta("property", "og:description", ogDescription || description);
    setMeta("property", "og:type", ogType);
    if (ogImage) setMeta("property", "og:image", ogImage);

    if (noIndex) {
      setMeta("name", "robots", "noindex, nofollow");
    }

    // ── Canonical ──
    let linkEl = document.querySelector(
      "link[rel='canonical']",
    ) as HTMLLinkElement | null;
    if (canonical) {
      if (!linkEl) {
        linkEl = document.createElement("link");
        linkEl.setAttribute("rel", "canonical");
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute("href", canonical);
    }

    // ── JSON-LD ──
    let scriptEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-seo", "dynamic");
      scriptEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(scriptEl);
    }

    // ── Cleanup ──
    return () => {
      document.title = prevTitle;
      if (scriptEl) scriptEl.remove();
    };
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    noIndex,
    jsonLd,
  ]);
}
