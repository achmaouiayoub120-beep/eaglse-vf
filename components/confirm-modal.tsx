"use client"

import { AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-200">
      <div className="glass-card rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-[#EF4444]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-[#A0A0A0]">{message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-[#A0A0A0] bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-xl transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
