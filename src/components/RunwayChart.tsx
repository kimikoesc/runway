// RunwayChart draws the savings balance falling month by month until it hits zero.
// Plain SVG, no chart library: one line, a light fill under it, and a dot where money runs out.
import type { Currency } from '../types'
import { balanceSeries } from '../lib/runway'
import { formatMoney } from '../lib/format'

// Props: starting savings, monthly net burn (spending − income), and the currency for the description.
type Props = {
  savings: number
  netBurn: number
  currency: Currency
}

// Chart drawing area in SVG units; the SVG scales to fit its container's width.
const WIDTH = 400
const HEIGHT = 120
const PAD = 6 // keeps the line and dot from being clipped at the edges

// RunwayChart() turns the balance series into SVG coordinates and draws them.
export default function RunwayChart({ savings, netBurn, currency }: Props) {
  const points = balanceSeries(savings, netBurn)
  const last = points[points.length - 1]
  const maxMonth = last.month || 1
  const maxBalance = Math.max(...points.map((p) => p.balance), 1)

  // x() / y() map a month and a balance to a position in the drawing area (SVG y grows downward).
  const x = (month: number) => PAD + (month / maxMonth) * (WIDTH - PAD * 2)
  const y = (balance: number) => HEIGHT - PAD - (balance / maxBalance) * (HEIGHT - PAD * 2)

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.month)},${y(p.balance)}`).join(' ')
  const area = `${line} L${x(last.month)},${y(0)} L${x(0)},${y(0)} Z`
  const runsOut = netBurn > 0 && last.balance === 0

  // The description screen readers hear instead of the picture.
  const description = netBurn > 0
    ? `Savings fall from ${formatMoney(savings, currency)} to zero over ${(savings / netBurn).toFixed(1)} months`
    : 'Savings never run out'

  return (
    <figure className="runway-chart">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={description}>
        <line className="chart-baseline" x1={PAD} x2={WIDTH - PAD} y1={y(0)} y2={y(0)} />
        <path className="chart-area" d={area} />
        <path className="chart-line" d={line} />
        {runsOut && <circle className="chart-dot" cx={x(last.month)} cy={y(0)} r={4} />}
      </svg>
      <figcaption className="chart-axis" aria-hidden="true">
        <span>Now</span>
        <span>{netBurn > 0 ? `${Math.round(last.month * 10) / 10} months` : '12 months'}</span>
      </figcaption>
    </figure>
  )
}
