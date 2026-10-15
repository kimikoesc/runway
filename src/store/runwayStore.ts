// The app's store: holds the state and every action that changes it.
// Works like a Svelte writable store: getState() ~ get(store), subscribe() ~ store.subscribe().
// Components never change data directly; they call these actions.
import { useSyncExternalStore } from 'react'
import type { Currency, Expense, Income, RunwayState } from '../types'
import * as defaultStorage from './storage'

// Storage is anything that can load and save state; tests pass a fake one, the backend will pass an API one.
type Storage = { loadState(): RunwayState; saveState(state: RunwayState): void }

// RunwayStore is the full list of things the store can do.
export type RunwayStore = ReturnType<typeof createRunwayStore>

// createRunwayStore() builds a store. It's a function (not just one object) so tests can make fresh stores.
export function createRunwayStore(storage: Storage = defaultStorage) {
  let state = storage.loadState()
  const listeners = new Set<() => void>()

  // update() is the only place state changes: swap in the new object, save it, tell subscribers.
  // React needs a NEW object (not a mutated one) to notice a change — unlike Svelte, which tracks assignments.
  function update(next: RunwayState) {
    state = next
    storage.saveState(state)
    listeners.forEach((listener) => listener())
  }

  return {
    // getState() returns the current state.
    getState: () => state,

    // subscribe() registers a function to call on every change and returns a function that unregisters it.
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    // setState() replaces everything at once (used by tests now, by loading from the backend later).
    setState: (next: RunwayState) => update(next),

    // setCurrency() changes the currency symbol only; amounts are not converted.
    setCurrency: (currency: Currency) => update({ ...state, currency }),

    // setSavings() changes the savings amount.
    setSavings: (savings: number) => update({ ...state, savings }),

    // addIncome() adds an empty income source for the user to fill in.
    addIncome: () =>
      update({ ...state, incomes: [...state.incomes, { id: crypto.randomUUID(), name: 'New income', amount: 0 }] }),

    // updateIncome() changes some fields (name and/or amount) of one income.
    updateIncome: (id: string, changes: Partial<Omit<Income, 'id'>>) =>
      update({ ...state, incomes: state.incomes.map((i) => (i.id === id ? { ...i, ...changes } : i)) }),

    // removeIncome() deletes one income, but always keeps at least one.
    removeIncome(id: string) {
      if (state.incomes.length <= 1) return
      update({ ...state, incomes: state.incomes.filter((i) => i.id !== id) })
    },

    // addExpense() adds an empty, checked expense for the user to fill in.
    addExpense: () =>
      update({
        ...state,
        expenses: [...state.expenses, { id: crypto.randomUUID(), name: 'New expense', amount: 0, enabled: true }],
      }),

    // updateExpense() changes some fields of one expense.
    updateExpense: (id: string, changes: Partial<Omit<Expense, 'id'>>) =>
      update({ ...state, expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...changes } : e)) }),

    // toggleExpense() checks/unchecks one expense, i.e. includes/excludes it from the totals.
    toggleExpense: (id: string) =>
      update({ ...state, expenses: state.expenses.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e)) }),

    // removeExpense() deletes one expense.
    removeExpense: (id: string) => update({ ...state, expenses: state.expenses.filter((e) => e.id !== id) }),
  }
}

// runwayStore is the one store the app uses.
export const runwayStore = createRunwayStore()

// useRunway() lets a component read the state and re-render when it changes.
// Svelte equivalent: `$runwayStore`. useSyncExternalStore is React's built-in way to read an outside store.
export function useRunway(): RunwayState {
  return useSyncExternalStore(runwayStore.subscribe, runwayStore.getState)
}
