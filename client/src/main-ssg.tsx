import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './main'

// This file allows vite-ssg to import a standard SPA entry and generate HTML.
// It simply renders the existing app. vite-ssg will call this during build.
export function createApp() {
  return { App }
}

// In the browser, hydrate/mount as usual when not running under vite-ssg
if (typeof window !== 'undefined') {
  const root = document.getElementById('root') || document.getElementById('app')
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

