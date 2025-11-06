import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

export function createApp() {
  return { App };
}

if (typeof window !== 'undefined') {
  createRoot(document.getElementById("root")!).render(<App />);
}
