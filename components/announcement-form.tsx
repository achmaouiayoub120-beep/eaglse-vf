"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Announcement {
  id: string
  titre: string
  contenu: string
  date: string
  visibilite: "public" | "membres"
  epingle: boolean
  auteur: string
}

interface AnnouncementFormProps {
  announcement: Announcement | null
  onSubmit: (announcement: Announcement) => void
  onClose: () => void
}

export function AnnouncementForm({ announcement, onSubmit, onClose }: AnnouncementFormProps) {
  const [form, setForm] = useState<Omit<Announcement, "id">>({
    titre: "",
    contenu: "",
    date: new Date().toISOString().split("T")[0],
    visibilite: "public",
    epingle: false,
    auteur: "Admin Eagles",
  })

  useEffect(() => {
    if (announcement) {
      setForm({
        titre: announcement.titre,
        contenu: announcement.contenu,
        date: announcement.date,
        visibilite: announcement.visibilite,
        epingle: announcement.epingle,
        auteur: announcement.auteur,
      })
    }
  }, [announcement])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: announcement?.id || Date.now().toString(),
      ...form,
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
              {announcement ? "Modifier l'Annonce" : "Nouvelle Annonce"}
            </h2>
            <p className="text-xs text-[#606060] mt-0.5">Publiez une annonce pour le club</p>
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
              placeholder="Titre de l'annonce"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Contenu</label>
            <textarea
              required
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              rows={5}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors resize-none"
              placeholder="Écrivez votre annonce..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Visibilité</label>
            <div className="flex gap-3">
              {([
                { value: "public" as const, label: "Public", desc: "Visible par tous" },
                { value: "membres" as const, label: "Membres uniquement", desc: "Réservé aux membres" },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, visibilite: opt.value })}
                  className={`flex-1 p-3 rounded-xl text-left transition-all border ${
                    form.visibilite === opt.value
                      ? "bg-[#D45902]/10 border-[#D45902]/30 text-white"
                      : "bg-white/[0.02] border-white/[0.08] text-[#606060] hover:text-white"
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-60">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.epingle}
              onChange={(e) => setForm({ ...form, epingle: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-white/[0.08] peer-checked:bg-[#D45902] transition-colors relative">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-[#A0A0A0]">Épingler en haut du fil</span>
          </label>

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
              {announcement ? "Mettre à jour" : "Publier l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
