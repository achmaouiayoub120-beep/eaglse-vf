"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
  trend?: number
  variant?: "default" | "accent" | "success" | "warning"
  suffix?: string
}

export function StatsCard({ label, value, icon: Icon, trend, variant = "default", suffix = "" }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  const gradients = {
    default: "from-[#D45902]/10 to-transparent",
    accent: "from-[#F97316]/10 to-transparent",
    success: "from-[#22C55E]/10 to-transparent",
    warning: "from-[#F59E0B]/10 to-transparent",
  }

  const iconColors = {
    default: "text-[#D45902]",
    accent: "text-[#F97316]",
    success: "text-[#22C55E]",
    warning: "text-[#F59E0B]",
  }

  return (
    <div className="glass-card rounded-2xl p-5 group hover:border-[#D45902]/20 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
      {/* Gradient accent */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl rounded-bl-full opacity-50", gradients[variant])} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2.5 rounded-xl bg-white/[0.04]", iconColors[variant])}>
            <Icon size={18} />
          </div>
          {trend !== undefined && (
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend >= 0 ? "text-[#22C55E] bg-[#22C55E]/10" : "text-[#EF4444] bg-[#EF4444]/10"
            )}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-white mb-1">
          {displayValue.toLocaleString()}{suffix}
        </p>
        <p className="text-xs text-[#A0A0A0]">{label}</p>
      </div>
    </div>
  )
}
