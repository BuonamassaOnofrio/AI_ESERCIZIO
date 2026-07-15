import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the Italian title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.setLang('it');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Radice Quadrata');
  });

  it('should switch to the English title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.setLang('en');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Square Root');
  });

  it('should toggle the theme', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const initial = app.theme();
    app.toggleTheme();
    expect(app.theme()).not.toBe(initial);
  });

  it('should report the square root of a valid number', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.setLang('en');
    app.inputValue = '25';
    app.calculateSquareRoot();
    fixture.detectChanges();
    expect(app.resultText()).toContain('5.0000');
    expect(app.hasError()).toBeFalse();
  });

  it('should flag negative numbers as an error', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.setLang('en');
    app.inputValue = '-4';
    app.calculateSquareRoot();
    expect(app.hasError()).toBeTrue();
  });
});
