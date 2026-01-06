import Image from "next/image"

type DynamicBackgroundProps = {
  children: React.ReactNode
  backgroundImage?: string | null
}

/**
 * Pure server component - applies background via Next.js Image
 * Uses priority loading for instant background display
 */
export default function DynamicBackground({
  children,
  backgroundImage = null,
}: DynamicBackgroundProps) {
  return (
    <div className="flex flex-col flex-1 bg-[#F4F4F0] relative">
      {/* Background image with priority loading */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt="Category background"
            fill
            priority
            className="object-cover"
            style={{ zIndex: 0 }}
          />
          {/* Semi-transparent overlay */}
          <div
            className="absolute inset-0 bg-white/40 pointer-events-none"
            style={{ zIndex: 1 }}
          />
        </>
      )}
      <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
