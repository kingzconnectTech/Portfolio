type Props = {
  chapterNumber: string
  chapterTitle: string
  className?: string
}

export function PlaceholderImage({
  chapterNumber,
  chapterTitle,
  className = '',
}: Props) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-[#1a1816] to-[#0f0e0d] ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <div className="text-center p-8">
        <div className="font-hn text-[11px] tracking-[0.28em] text-amber-story/80 mb-4" style={{ color: '#c4a574' }}>
          {chapterNumber}
        </div>
        <h3 className="font-hn text-2xl tracking-[-0.02em] text-cream/70">
          {chapterTitle}
        </h3>
        <p className="mt-4 font-hn text-xs text-cream/40">
          Image placeholder - replace with actual cinematic photograph
        </p>
      </div>
    </div>
  )
}
