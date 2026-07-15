import { Injectable, computed, effect, signal } from '@angular/core';

/** Languages supported by the UI. */
export type Lang = 'it' | 'en';

/** All user-facing strings for a single language. */
export interface Dictionary {
  title: string;
  subtitle: string;
  numberLabel: string;
  placeholder: string;
  calculate: string;
  noResult: string;
  errorInvalid: string;
  errorNegative: string;
  resultTemplate: string;
  languageLabel: string;
  themeToggleToDark: string;
  themeToggleToLight: string;
}

const DICTIONARIES: Record<Lang, Dictionary> = {
  it: {
    title: 'Radice Quadrata',
    subtitle: 'Inserisci un numero: la radice quadrata viene tracciata come su un disegno tecnico.',
    numberLabel: 'Numero',
    placeholder: 'es. 25',
    calculate: 'Calcola',
    noResult: 'Nessun calcolo eseguito ancora.',
    errorInvalid: 'Inserisci un numero valido.',
    errorNegative: 'Impossibile calcolare la radice di un numero negativo.',
    resultTemplate: 'La radice quadrata di {value} è {result}.',
    languageLabel: 'Lingua',
    themeToggleToDark: 'Passa alla modalità notte',
    themeToggleToLight: 'Passa alla modalità giorno',
  },
  en: {
    title: 'Square Root',
    subtitle: 'Enter a number and its square root is drafted like a technical drawing.',
    numberLabel: 'Number',
    placeholder: 'e.g. 25',
    calculate: 'Calculate',
    noResult: 'No calculation performed yet.',
    errorInvalid: 'Enter a valid number.',
    errorNegative: 'Cannot calculate the square root of a negative number.',
    resultTemplate: 'The square root of {value} is {result}.',
    languageLabel: 'Language',
    themeToggleToDark: 'Switch to night mode',
    themeToggleToLight: 'Switch to day mode',
  },
};

const STORAGE_KEY = 'sqrt-microfrontend.lang';

/**
 * Runtime translation store. The active language is a signal so any
 * component reading `dict()` re-renders immediately on language change —
 * including already-computed results/errors, which are re-translated rather
 * than frozen in the language they were produced in (see
 * `AppComponent.resultText`).
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.resolveInitialLang());
  readonly dict = computed<Dictionary>(() => DICTIONARIES[this.lang()]);

  constructor() {
    // Keep <html lang> and the stored preference in sync with every change.
    effect(() => {
      const lang = this.lang();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  /**
   * Precedence: explicit user choice (localStorage) > browser locale > 'it'
   * (the app's original/default language). Guards on `typeof` so this stays
   * safe if ever run outside a browser (e.g. during prerendering).
   */
  private resolveInitialLang(): Lang {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'it' || stored === 'en') {
        return stored;
      }
    }
    if (typeof navigator !== 'undefined' && !navigator.language?.toLowerCase().startsWith('it')) {
      return 'en';
    }
    return 'it';
  }
}
