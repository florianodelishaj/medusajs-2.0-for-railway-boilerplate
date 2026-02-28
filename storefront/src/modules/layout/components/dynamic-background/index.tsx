import Image from "next/image"

type DynamicBackgroundProps = {
  children: React.ReactNode
  backgroundImage?: string | null
  categoryColor?: string | null
}

/**
 * Pure server component - applies background via Next.js Image or color gradient.
 * Priority: backgroundImage > categoryColor > default
 */
export default function DynamicBackground({
  children,
  backgroundImage = null,
  categoryColor = null,
}: DynamicBackgroundProps) {
  return (
    <div className="flex flex-col flex-1 bg-[#F4F4F0] relative">
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt="Category background"
            fill
            priority
            className="object-cover"
            style={{ zIndex: 0 }}
          />
          <div
            className="absolute inset-0 bg-white/40 pointer-events-none"
            style={{ zIndex: 1 }}
          />
        </>
      ) : categoryColor ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${categoryColor}60 0%, transparent 100%)`,
            zIndex: 0,
          }}
        />
      ) : null}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
