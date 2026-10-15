# React for Svelte developers

How the Svelte ideas you already know map to the React code in this repo. Each section points to a real file.

## Components and props — `src/components/Slider.tsx`

Svelte declares inputs with `export let value`. React components are functions; inputs arrive as one object, `props`, which we destructure:

```tsx
type Props = { value: number; onChange: (value: number) => void }
export default function Slider({ value, onChange }: Props) { ... }
```

The `Props` type is TypeScript's way of saying which props exist. A missing or wrong prop is a compile error.

## Markup: JSX instead of a template

- `class` → `className` (`class` is a reserved word in JS). See `src/features/SpendingSection.tsx`.
- `{#if x}...{/if}` → `{x && <Thing />}` or `{x ? <A /> : <B />}`. See `src/features/RunwayHeader.tsx`.
- `on:click={fn}` → `onClick={fn}`.

## Local state: `let` → `useState` — `src/components/EditableText.tsx`

Svelte makes `let draft` reactive by itself. In React you ask for state and get a value plus a setter:

```tsx
const [draft, setDraft] = useState<string | null>(null)
setDraft('Rent') // re-renders the component
```

Assigning `draft = 'x'` directly does nothing in React. Always call the setter.

**Hook rule:** call `useState` (and every `use...` function) at the top of the component, never inside `if` or loops. React tracks hooks by call order.

## Derived values: `$:` → plain variables — `src/features/RunwayHeader.tsx`

The whole component function re-runs on every render, so derived values are just variables:

```tsx
const spending = totalSpending(expenses) // Svelte: $: spending = totalSpending(expenses)
```

`useEffect` is React's version of `$:` with side effects (fetching, timers). This app doesn't need one.

## Two-way binding: `bind:value` → `value` + `onChange` — `src/components/MoneyInput.tsx`

React has no `bind:`. The parent passes the value down and a function to call with the new value:

```tsx
<MoneyInput value={savings} onChange={runwayStore.setSavings} />
```

## Loops: `{#each}` → `.map()` + `key` — `src/features/SpendingSection.tsx`

```tsx
{expenses.map((expense) => <div key={expense.id}>...</div>)}
```

`key` is Svelte's `{#each items as item (item.id)}`. Use a stable id, not the array index, so React keeps each row's input state on the right row when rows are added or deleted.

## Slots: `<slot>` → `children` and element props — `src/components/Section.tsx`

- Default slot → the `children` prop (whatever you put between the tags).
- Named slot → a normal prop that takes JSX, e.g. `action={<IconButton ... />}`.

## Stores: writable store → `runwayStore` + `useSyncExternalStore` — `src/store/runwayStore.ts`

`runwayStore` works like a Svelte writable store with methods: it has `getState()` and `subscribe()`, plus named actions (`addExpense`, `toggleExpense`, ...). Components read it with:

```tsx
const { expenses } = useRunway() // Svelte: $runwayStore
```

`useRunway` wraps React's built-in `useSyncExternalStore`, which subscribes and re-renders on change, the same job `$store` auto-subscription does in Svelte.

## Immutable updates — `src/store/runwayStore.ts`

Svelte notices `items.push(x); items = items`. React only notices a **new object**. So every action builds a new state instead of changing the old one:

```ts
update({ ...state, expenses: [...state.expenses, newExpense] })            // add
update({ ...state, expenses: state.expenses.filter((e) => e.id !== id) })  // remove
update({ ...state, expenses: state.expenses.map((e) => e.id === id ? { ...e, ...changes } : e) }) // edit
```

## Styles: scoped `<style>` → plain CSS files — `src/App.css`

Svelte scopes CSS to the component automatically. Here CSS is global, so class names are specific (`.stat-card`, `.money-input`). All colors are CSS variables in `src/App.css`, so a theme only has to override them.

## Tests — `src/App.test.tsx`

Vitest (same runner SvelteKit uses) + Testing Library. Tests find elements the way users do, by label or role (`getByLabelText('Include Rent')`), so they keep working when markup changes.
