declare global {
  interface Window { Intercom?: (...args: any[]) => void; intercomSettings?: any }
}

// Unlock page scroll if Intercom leaves body in a fixed/locked state
function unlockBodyScrollIfStuck() {
  try {
    const b = document.body;
    if (!b) return;
    const cs = window.getComputedStyle ? window.getComputedStyle(b) : ({} as any);
    const overflow = (b.style.overflow || (cs && cs.overflow) || '').toLowerCase();
    const position = (b.style.position || (cs && cs.position) || '').toLowerCase();
    // Always clear hard locks to keep page scroll usable, even when Intercom is open
    if (overflow.includes('hidden') || position === 'fixed') {
      b.style.overflow = '';
      b.style.position = '';
      b.style.top = '';
      b.style.width = '';
    }
  } catch {}
}

// Polling helper to repeatedly unlock for a short period
function pulseUnlock(durationMs = 1200, intervalMs = 100) {
  const start = Date.now();
  const id = setInterval(() => {
    try { unlockBodyScrollIfStuck(); } catch {}
    if (Date.now() - start >= durationMs) clearInterval(id);
  }, intervalMs);
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
      // Attach visibility hooks to aggressively restore scroll when messenger hides
      try {
        window.Intercom('onHide', function(){ unlockBodyScrollIfStuck(); pulseUnlock(); });
        window.Intercom('onShow', function(){ unlockBodyScrollIfStuck(); pulseUnlock(); });
        window.Intercom('onUnreadCountChange', function(){ unlockBodyScrollIfStuck(); });
      } catch {}
    }
  } catch {}
}

// Expose manual fixer for places like route changes
export function intercomEnsureScroll() { unlockBodyScrollIfStuck(); }

// Global listeners to aggressively clear sticky locks on user interaction and navigation
try {
  const bounce = () => { unlockBodyScrollIfStuck(); };
  ['click','touchend','visibilitychange','focus'].forEach(evt => {
    window.addEventListener(evt as any, bounce, true);
  });
  ['popstate','hashchange'].forEach(evt => {
    window.addEventListener(evt as any, () => { unlockBodyScrollIfStuck(); pulseUnlock(); }, false);
  });
} catch {}
