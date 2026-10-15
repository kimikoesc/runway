// RunwayStrip shows the runway as a row of 24 month blocks: full months filled, the last one partly filled.
import type { CSSProperties } from 'react'
import { STRIP_MONTHS, stripFills } from '../lib/runway'

type Props = {
  months: number
}

// RunwayStrip() draws the blocks. Each block's fill amount goes into a CSS variable, and CSS paints it.
export default function RunwayStrip({ months }: Props) {
  // The description screen readers hear instead of the picture.
  const description =
    months === Infinity
      ? 'Savings never run out'
      : `${Math.min(months, STRIP_MONTHS).toFixed(1)} of ${STRIP_MONTHS} months covered`

  return (
    <figure className="runway-strip">
      <div className="strip-blocks" role="img" aria-label={description}>
        {stripFills(months).map((fill, i) => (
          // The index is a fine key here: the 24 blocks never get added, removed or reordered.
          // React's `style` takes an object; custom properties like --fill need the CSSProperties cast.
          <span key={i} className="strip-block" style={{ '--fill': fill } as CSSProperties} />
        ))}
      </div>
      <figcaption className="strip-ticks" aria-hidden="true">
        <span>Now</span>
        <span>12 months</span>
        <span>24+ months</span>
      </figcaption>
    </figure>
  )
}
