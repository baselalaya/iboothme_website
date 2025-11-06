// Minimal SSG integration file to be picked up by vite-plugin-ssg if used later.
// This file exports optional hooks; current app hydrates as a standard SPA.
export const onBeforeRender = async () => {
  // placeholder for potential per-route data prefetching during SSG
  return {};
};

