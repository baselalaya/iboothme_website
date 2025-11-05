import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children, containerId = "portal-root" }: { children: ReactNode; containerId?: string }) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }
    setEl(container);
    return () => {
      // do not remove if other components might use it
    };
  }, [containerId]);

  if (!el) return null;
  return createPortal(children, el);
}

