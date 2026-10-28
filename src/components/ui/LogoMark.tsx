// AllySupport mark: a speech bubble with an "A" cut into it, on an ink tile.
// Mirrors src/app/icon.svg (the favicon), so keep the two in sync.
export function LogoMark({ className = "", light = false }: { className?: string; light?: boolean }) {
    const tile = light ? "var(--color-paper)" : "var(--color-ink)"
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
            <rect width="32" height="32" fill={tile} />
            <path
                d="M6 6H26V21H14L8 27V21H6Z"
                fill="var(--color-signal)"
                className="origin-[8px_27px] transition-transform duration-500 ease-out-expo group-hover:-rotate-6"
            />
            <path d="M11 18.5L16 9.5L21 18.5M13.2 15H18.8" fill="none" stroke={tile} strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
    )
}
