"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  message: string
  type: ToastType
  visible: boolean
  onClose: () => void
  duration?: number
}

const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
const styles = {
  success: "border-[#22C55E]/20 bg-[#22C55E]/10",
  error: "border-[#EF4444]/20 bg-[#EF4444]/10",
  warning: "border-[#F59E0B]/20 bg-[#F59E0B]/10",
  info: "border-[#3B82F6]/20 bg-[#3B82F6]/10",
}
const iconColors = {
  success: "text-[#22C55E]",
  error: "text-[#EF4444]",
  warning: "text-[#F59E0B]",
  info: "text-[#3B82F6]",
}

export function Toast({ message, type, visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onClose])

  if (!visible) return null
  const Icon = icons[type]

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl max-w-sm", styles[type])}>
        <Icon size={18} className={iconColors[type]} />
        <p className="text-sm font-medium text-white flex-1">{message}</p>
        <button onClick={onClose} className="p-1 rounded-md text-[#606060] hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
