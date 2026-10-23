interface TechChipProps {
  label: string
}

/**
 * Small pill tag for a single tool. Rendered as an `<li>` so it can live in a
 * `<ul>` (wrap-safe on narrow screens).
 */
export function TechChip({ label }: TechChipProps) {
  return (
    <li className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-[5px] font-hn text-[9px] uppercase leading-none tracking-[0.16em] text-white/50">
      {label}
    </li>
  )
}
