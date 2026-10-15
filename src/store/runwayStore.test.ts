import { createRunwayStore } from './runwayStore'
import { DEFAULT_STATE, loadState, saveState } from './storage'
import type { RunwayState } from '../types'

// makeStore() builds a store with a fake storage so tests never touch real localStorage.
function makeStore() {
  const storage = { loadState: () => structuredClone(DEFAULT_STATE), saveState: vi.fn() }
  return { store: createRunwayStore(storage), saveState: storage.saveState }
}

describe('runwayStore actions', () => {
  it('setCurrency changes currency and saves', () => {
    const { store, saveState } = makeStore()
    store.setCurrency('USD')
    expect(store.getState().currency).toBe('USD')
    expect(saveState).toHaveBeenCalledExactlyOnceWith(store.getState())
  })

  it('setSavings changes savings', () => {
    const { store } = makeStore()
    store.setSavings(500)
    expect(store.getState().savings).toBe(500)
  })

  it('addIncome appends a blank income', () => {
    const { store } = makeStore()
    store.addIncome()
    expect(store.getState().incomes.at(-1)).toMatchObject({ name: 'New income', amount: 0 })
  })

  it('updateIncome and removeIncome change only that income', () => {
    const { store } = makeStore()
    store.addIncome()
    const [first, second] = store.getState().incomes
    store.updateIncome(second.id, { name: 'Freelance', amount: 9000 })
    expect(store.getState().incomes[1]).toMatchObject({ name: 'Freelance', amount: 9000 })
    store.removeIncome(second.id)
    expect(store.getState().incomes).toEqual([first])
  })

  it('removeIncome keeps the last income', () => {
    const { store, saveState } = makeStore()
    const before = store.getState()
    store.removeIncome(before.incomes[0].id)
    expect(store.getState()).toBe(before)
    expect(saveState).not.toHaveBeenCalled()
  })

  it('addExpense, updateExpense, toggleExpense, removeExpense', () => {
    const { store } = makeStore()
    store.addExpense()
    const added = store.getState().expenses.at(-1)!
    expect(added).toMatchObject({ name: 'New expense', amount: 0, enabled: true })
    store.updateExpense(added.id, { amount: 42 })
    expect(store.getState().expenses.at(-1)!.amount).toBe(42)
    store.toggleExpense(added.id)
    expect(store.getState().expenses.at(-1)!.enabled).toBe(false)
    store.removeExpense(added.id)
    expect(store.getState().expenses).toHaveLength(DEFAULT_STATE.expenses.length)
  })

  it('never mutates the previous state object', () => {
    const { store } = makeStore()
    const before = store.getState()
    const beforeCopy = structuredClone(before)
    store.toggleExpense(before.expenses[0].id)
    expect(store.getState()).not.toBe(before)
    expect(before).toEqual(beforeCopy)
  })

  it('notifies subscribers until they unsubscribe', () => {
    const { store } = makeStore()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.setSavings(1)
    unsubscribe()
    store.setSavings(2)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('setState replaces everything', () => {
    const { store } = makeStore()
    const next: RunwayState = { currency: 'EUR', savings: 1, incomes: [], expenses: [] }
    store.setState(next)
    expect(store.getState()).toEqual(next)
  })
})

describe('storage', () => {
  it('defaults reproduce the example numbers', () => {
    expect(DEFAULT_STATE.savings).toBe(2200000)
    expect(DEFAULT_STATE.incomes.reduce((s, i) => s + i.amount, 0)).toBe(132600)
    expect(DEFAULT_STATE.expenses.reduce((s, e) => s + e.amount, 0)).toBe(377251)
  })

  it('falls back to defaults on bad JSON', () => {
    localStorage.setItem('runway:v1', 'not json')
    const state = loadState()
    expect(state.currency).toBe('JPY')
    expect(state.expenses).toHaveLength(7)
  })

  it('falls back to defaults when fields are missing', () => {
    localStorage.setItem('runway:v1', JSON.stringify({ currency: 'JPY', savings: 1, incomes: [] }))
    expect(loadState().expenses).toHaveLength(7)
  })

  it('round-trips saved state', () => {
    const s: RunwayState = {
      currency: 'PHP',
      savings: 10,
      incomes: [{ id: 'a', name: 'Job', amount: 5 }],
      expenses: [{ id: 'b', name: 'Food', amount: 3, enabled: false }],
    }
    saveState(s)
    expect(loadState()).toEqual(s)
  })
})
