# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Angular 19 (standalone components, no NgModules) single-page microfrontend ("Microfrontend Radice Quadrata") that lets a user enter a number and computes its square root. The entire application logic currently lives in one component: [src/app/app.component.ts](src/app/app.component.ts), [app.component.html](src/app/app.component.html), [app.component.css](src/app/app.component.css). There is no routing (`routes` in [src/app/app.routes.ts](src/app/app.routes.ts) is empty) and no backend — everything runs client-side.

UI copy and validation messages are in Italian.

## Commands

Run all commands from `sqrt-microfrontend/` (the Angular workspace root, one level below the repo root).

- Install deps: `npm install`
- Dev server: `npm start` (or `ng serve`) — serves at `http://localhost:4200/`, auto-reloads on save
- Build: `npm run build` (or `ng build`) — production build output goes to `dist/sqrt-microfrontend/`
- Watch/dev build: `npm run watch` (`ng build --watch --configuration development`)
- Unit tests (Karma/Jasmine): `npm test` (or `ng test`)
  - Run a single spec file: `ng test --include='**/app.component.spec.ts'`
- Generate a component: `ng generate component <name>`

No e2e test framework is configured. No lint script is defined in `package.json`.

## Architecture notes

- **Standalone bootstrap**: [src/main.ts](src/main.ts) bootstraps `AppComponent` directly via `bootstrapApplication`, configured with `appConfig` from [src/app/app.config.ts](src/app/app.config.ts) (zone change detection + router providers). There is no `AppModule`.
- **Component style**: components are `standalone: true` and import what they need directly (e.g. `AppComponent` imports `FormsModule` for `[(ngModel)]` two-way binding) rather than relying on a shared module.
- **Validation flow**: `AppComponent.calculateSquareRoot()` in [app.component.ts](src/app/app.component.ts) does inline validation (empty/NaN input, negative numbers) and sets `result`/`hasError` fields that the template binds to directly — there is no separate service, pipe, or reactive form for this.
- **Build target**: `angular.json` uses the newer `@angular-devkit/build-angular:application` builder (esbuild-based), not the legacy `browser` builder.
- **TypeScript strictness**: `tsconfig.json` enables `strict`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, and Angular's `strictTemplates`/`strictInjectionParameters`/`strictInputAccessModifiers` — keep new code compliant with these.
- Formatting: single quotes for `.ts` files, 2-space indentation (see [.editorconfig](.editorconfig)).
