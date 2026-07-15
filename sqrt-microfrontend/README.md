# SqrtMicrofrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.24.

It is a single-page square root calculator with a "technical drawing" (blueprint) theme and runtime multi-language support.

## Features

### Theme

`ThemeService` ([src/app/services/theme.service.ts](src/app/services/theme.service.ts)) exposes the active theme (`'light'` | `'dark'`) as a signal and mirrors it onto `<html data-theme="...">`. `app.component.css` defines all colors as CSS custom properties on `:host`, with a `:host-context([data-theme='light'])` block overriding them for the light theme — so both themes stay driven from the same rules.

- Default: browser's `prefers-color-scheme`, falling back to dark ("night blueprint") if unset.
- Toggled with the sun/moon button in the app's toolbar; the choice is remembered in `localStorage`.

### Language (IT / EN)

`I18nService` ([src/app/services/i18n.service.ts](src/app/services/i18n.service.ts)) exposes the active language and a `Dictionary` of UI strings as signals. `AppComponent` keeps the calculator's result/error as structured state (not a pre-rendered string) precisely so it can be re-translated on the fly if the user switches language after calculating.

- Default: `it`, unless the browser's language clearly isn't Italian.
- Switched with the IT / EN control in the app's toolbar; the choice is remembered in `localStorage`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
