/**
 * Theme module — light/dark switch persisted in localStorage.
 * Apply: <html data-theme="dark"> (or "light")
 * Default: respects prefers-color-scheme on first visit.
 *
 * Usage:
 *   Theme.init();
 *   Theme.toggle();
 *   Theme.set('light' | 'dark');
 *   Theme.get();
 *   Theme.mountToggle('#theme-btn-id');  // wires a button
 */
const Theme = (() => {
  const KEY = 'tac.theme';

  function get() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    // Update any toggle buttons on the page
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀' : '☾';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Modo claro' : 'Modo oscuro');
    });
  }

  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
  }

  function init(forced) {
    if (forced) { set(forced); return; }
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
      set(saved);
    } else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      set(prefersLight ? 'light' : 'dark');
    }
  }

  function mountToggle(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    el.setAttribute('data-theme-toggle', '1');
    el.addEventListener('click', toggle);
    set(get()); // refresh button label
  }

  return { init, get, set, toggle, mountToggle };
})();

// Auto-init on script load so the right theme paints immediately
Theme.init();
