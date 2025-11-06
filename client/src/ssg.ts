// Entry for vite-ssg
import { ViteSSG } from 'vite-ssg'
import App from './App'
import './index.css'
import { getStaticPaths } from './ssg-routes'

export const createApp = ViteSSG(
  App,
  // Provide the list of routes to generate at build time
  async () => {
    const routes = await getStaticPaths()
    return { routes }
  },
  async (_ctx) => {
    // place to run global setup during SSG if needed
  }
)
