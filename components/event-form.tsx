"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Event {
  id: string
  titre: string
  date: string
  heure: string
  lieu: string
  description: string
  capacite: number
  participants: string[]
}

interface EventFormProps {
  event: Event | null
  onSubmit: (event: Event) => void
  onClose: () => void
}

export function EventForm({ event, onSubmit, onClose }: EventFormProps) {
  const [form, setForm] = useState<Omit<Event, "id" | "participants">>({
    titre: "",
    date: new Date().toISOString().split("T")[0],
    heure: "14:00",
    lieu: "",
    description: "",
    capacite: 50,
  })

  useEffect(() => {
    if (event) {
      setForm({
        titre: event.titre,
        date: event.date,
        heure: event.heure,
        lieu: event.lieu,
        description: event.description,
        capacite: event.capacite,
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: event?.id || Date.now().toString(),
      ...form,
      participants: event?.participants || [],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 glass-card rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-white">
              {event ? "Modifier l'Événement" : "Nouvel Événement"}
            </h2>
            <p className="text-xs text-[#606060] mt-0.5">Remplissez les détails de l&apos;événement</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#606060] hover:text-white hover:bg-white/[0.04] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Titre</label>
            <input
              required
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
              placeholder="Titre de l'événement"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Heure</label>
              <input
                type="time"
                required
                value={form.heure}
                onChange={(e) => setForm({ ...form, heure: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Lieu</label>
            <input
              required
              value={form.lieu}
              onChange={(e) => setForm({ ...form, lieu: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
              placeholder="Lieu de l'événement"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors resize-none"
              placeholder="Description de l'événement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Capacité max</label>
            <input
              type="number"
              required
              min={1}
              value={form.capacite}
              onChange={(e) => setForm({ ...form, capacite: parseInt(e.target.value) || 0 })}
              className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#A0A0A0] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"
            >
              {event ? "Mettre à jour" : "Créer l'événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
