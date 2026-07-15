import { Injectable, effect, signal } from '@angular/core';

/**
 * 'dark' is the "night blueprint" look (deep navy + grid lines) and is the
 * app's default; 'light' is the "day blueprint" (pale paper + grid lines).
 * See app.component.css for the CSS variables each theme sets.
 */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sqrt-microfrontend.theme';

/**
 * Tracks the active theme as a signal and mirrors it onto
 * `<html data-theme="...">`, which `app.component.css` keys its CSS custom
 * properties off of via `:host-context([data-theme='light'])`.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.resolveInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  /**
   * Precedence: explicit user choice (localStorage) > OS/browser
   * `prefers-color-scheme` > 'dark' (the app's default). Guards on `typeof`
   * so this stays safe if ever run outside a browser (e.g. during
   * prerendering).
   */
  private resolveInitialTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }
}
