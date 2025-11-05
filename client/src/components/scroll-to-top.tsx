import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes, with a tiny delay to
    // allow exit animations to start for a smoother feel.
    const id = window.setTimeout(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}
