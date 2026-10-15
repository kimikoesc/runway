# Runway

Shows how long your savings last. Enter your savings, your income sources and your monthly spending, and the top of the page shows your runway in months, the month your money runs out, and a strip of month blocks that shades from light to dark orange as your runway grows.

Frontend only for now: data is saved in your browser's localStorage.

## Run it

```bash
npm install
npm run dev      # start the dev server, open the URL it prints
npm test         # run tests in watch mode (npx vitest run for a single run)
npm run build    # type-check, then build to dist/
npm run preview  # serve the built app
```

Needs Node 20.19+.

## Folder layout

```
index.html              page shell Vite serves
src/main.tsx            mounts <App /> into the page
src/App.tsx             page layout + currency picker
src/App.css             theme color variables + page layout
src/types.ts            shared data types
src/lib/runway.ts       runway math (totals, months, run-out date, strip fills, zones)
src/lib/format.ts       money/date formatting, currency list, slider limit
src/store/runwayStore.ts  the store: state + every action + useRunway() hook
src/store/storage.ts    load/save (localStorage today) + default sample data
src/components/         reusable pieces: Slider, Checkbox, EditableText, MoneyInput,
                        IconButton, StatCard, Section, RunwayStrip (+ components.css)
src/features/           page sections: RunwayHeader, StatsRow, IncomeSection, SpendingSection
```

Tests sit next to the code they test (`*.test.ts` / `*.test.tsx`).

## How it works

- **Math** lives in `src/lib/runway.ts`: net burn = checked spending − income; runway = savings ÷ net burn. If income covers spending, the runway is ∞.
- **State** lives in `src/store/runwayStore.ts`. Components read it with `useRunway()` and change it only through store actions (`addExpense`, `toggleExpense`, ...).
- **Saving** lives in `src/store/storage.ts`. The store calls `saveState` after every change.

## Themes

Runway has light and dark mode. It follows the device setting until you tap the sun/moon button, then remembers your choice (`src/lib/theme.ts`).

All colors are CSS variables at the top of `src/App.css`: light values on `:root`, dark values in the `prefers-color-scheme: dark` block and the `[data-theme='dark']` block (keep those two identical). To add another theme, add a `:root[data-theme='name']` block that overrides the same variables.

## Adding the backend later

Only `src/store/storage.ts` needs to change: make `loadState` / `saveState` call your API. The store's actions and every component stay the same. `runwayStore.setState(...)` can apply data loaded from the server.

## Learning notes

New to React from Svelte? Read [docs/react-for-svelte.md](docs/react-for-svelte.md).
