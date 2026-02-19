import * as React from "react"

type IconProps = {
  size?: number
  color?: string
  style?: React.CSSProperties
}

const textIcon = (char: string, size: number, color: string, style: React.CSSProperties | undefined) => (
  <span
    style={{
      fontSize: `${size}px`,
      lineHeight: 1,
      color,
      fontFamily: "Arial, Helvetica, sans-serif",
      ...style,
    }}
  >
    {char}
  </span>
)

export const CircleCheckIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("✓", size, color, style)

export const XCircleIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("✕", size, color, style)

export const PackageIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("📦", size, color, style)

export const KeyRoundIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("🔑", size, color, style)

export const UserPlusIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("👋", size, color, style)

export const ShieldCheckIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("🛡", size, color, style)

export const RotateCcwIcon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("↺", size, color, style)

export const Undo2Icon = ({ size = 24, color = "#000", style }: IconProps) =>
  textIcon("↩", size, color, style)
