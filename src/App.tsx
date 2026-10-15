// App() is the root component: the page title bar, then each section top to bottom.
import './App.css'
import './components/components.css'
import { runwayStore, useRunway } from './store/runwayStore'
import { CURRENCIES, currencySymbol } from './lib/format'
import type { Currency } from './types'
import RunwayHeader from './features/RunwayHeader'
import StatsRow from './features/StatsRow'
import IncomeSection from './features/IncomeSection'
import SpendingSection from './features/SpendingSection'

export default function App() {
  const { currency } = useRunway()

  return (
    <main className="app">
      <header className="top-bar">
        <h1 className="brand">
          {/* alt="" because the word "Runway" right beside it already names the app */}
          <img src="/logo.svg" alt="" width="28" height="28" />
          Runway
        </h1>
        <select
          className="currency-select"
          aria-label="Currency"
          value={currency}
          onChange={(e) => runwayStore.setCurrency(e.target.value as Currency)}
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code} ({currencySymbol(code)})
            </option>
          ))}
        </select>
      </header>
      <RunwayHeader />
      <StatsRow />
      <IncomeSection />
      <SpendingSection />
    </main>
  )
}
