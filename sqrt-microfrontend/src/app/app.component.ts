import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService, Lang } from './services/i18n.service';
import { ThemeService } from './services/theme.service';

/**
 * Outcome of the last `calculateSquareRoot()` call. Kept as raw data (not a
 * pre-rendered string) so `resultText` can re-translate it whenever the
 * language changes, instead of freezing the message in whatever language was
 * active at calculation time.
 */
type CalculationState =
  | { status: 'idle' }
  | { status: 'invalid' }
  | { status: 'negative' }
  | { status: 'success'; value: number; sqrt: number };

/**
 * Square root calculator. Owns only the calculation state; language and
 * theme are delegated to {@link I18nService} and {@link ThemeService} so
 * both can be switched at runtime without reloading the page.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly i18n = inject(I18nService);
  private readonly themeService = inject(ThemeService);

  inputValue = '';

  readonly dict = this.i18n.dict;
  readonly lang = this.i18n.lang;
  readonly theme = this.themeService.theme;

  private readonly state = signal<CalculationState>({ status: 'idle' });

  readonly hasError = computed(() => {
    const status = this.state().status;
    return status === 'invalid' || status === 'negative';
  });

  /** Renders `state` in the current language; recomputes on every language switch. */
  readonly resultText = computed(() => {
    const state = this.state();
    const dict = this.dict();

    switch (state.status) {
      case 'invalid':
        return dict.errorInvalid;
      case 'negative':
        return dict.errorNegative;
      case 'success':
        return dict.resultTemplate
          .replace('{value}', String(state.value))
          .replace('{result}', state.sqrt.toFixed(4));
      default:
        return dict.noResult;
    }
  });

  calculateSquareRoot(): void {
    const value = Number(this.inputValue);

    if (!this.inputValue || Number.isNaN(value)) {
      this.state.set({ status: 'invalid' });
      return;
    }

    if (value < 0) {
      this.state.set({ status: 'negative' });
      return;
    }

    this.state.set({ status: 'success', value, sqrt: Math.sqrt(value) });
  }

  setLang(lang: Lang): void {
    this.i18n.setLang(lang);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
