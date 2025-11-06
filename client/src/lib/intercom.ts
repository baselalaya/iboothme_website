declare global {
  interface Window { Intercom?: (...args: any[]) => void; intercomSettings?: any }
}

export function intercomUpdate(traits: Record<string, any>) {
  try {
    if (!window.Intercom) return;
    window.Intercom('update', traits);
  } catch {}
}

export function intercomBootIfNeeded(appId: string, opts?: Record<string, any>) {
  try {
    const settings = { app_id: appId, ...(opts||{}) };
    window.intercomSettings = { ...(window.intercomSettings||{}), ...settings };
    if (window.Intercom) {
      window.Intercom('reattach_activator');
      window.Intercom('update', window.intercomSettings);
    }
  } catch {}
}

