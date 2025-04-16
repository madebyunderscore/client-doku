// utils/utm-tagging.js
// This function tag external links with UTM parameters.
// It takes a source and a content map as arguments.

export function addUTMToExternalLinks({ source, contentMap = {} }) {
    if (!source) {
      console.warn('UTM source is required');
      return;
    }
  
    function tagLinks(selector, content) {
      const links = document.querySelectorAll(selector);
      links.forEach((link) => {
        try {
          const url = new URL(link.href);
          if (!url.hostname || url.hostname === window.location.hostname) return; // Skip internal
          if (url.searchParams.has("utm_source")) return; // Already tagged
  
          url.searchParams.append("utm_source", source);
          url.searchParams.append("utm_content", content);
          link.href = url.toString();
        } catch (e) {
          console.warn("Invalid link skipped:", link.href);
        }
      });
    }
  
    Object.entries(contentMap).forEach(([selector, utmContent]) => {
      tagLinks(selector, utmContent);
    });
  }