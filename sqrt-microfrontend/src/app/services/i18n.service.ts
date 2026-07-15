import { Injectable, computed, effect, signal } from '@angular/core';

export type Lang = 'it' | 'en';

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

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(this.resolveInitialLang());
  readonly dict = computed<Dictionary>(() => DICTIONARIES[this.lang()]);

  constructor() {
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
