"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Cotisation {
  id: string
  membreId: string
  membreNom: string
  montant: number
  datePaiement: string
  statut: "payée" | "en attente" | "en retard"
  methode: string
  annee: string
}

interface CotisationFormProps {
  cotisation: Cotisation | null
  membres: { id: string; nom: string; prenom: string }[]
  onSubmit: (cotisation: Cotisation) => void
  onClose: () => void
}

export function CotisationForm({ cotisation, membres, onSubmit, onClose }: CotisationFormProps) {
  const [form, setForm] = useState({
    membreId: "",
    montant: 300,
    datePaiement: new Date().toISOString().split("T")[0],
    statut: "payée" as "payée" | "en attente" | "en retard",
    methode: "Espèces",
    annee: "2025",
  })

  useEffect(() => {
    if (cotisation) {
      setForm({
        membreId: cotisation.membreId,
        montant: cotisation.montant,
        datePaiement: cotisation.datePaiement,
        statut: cotisation.statut,
        methode: cotisation.methode,
        annee: cotisation.annee,
      })
    }
  }, [cotisation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const membre = membres.find((m) => m.id === form.membreId)
    onSubmit({
      id: cotisation?.id || Date.now().toString(),
      ...form,
      membreNom: membre ? `${membre.prenom} ${membre.nom}` : "Inconnu",
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
              {cotisation ? "Modifier la Cotisation" : "Enregistrer un Paiement"}
            </h2>
            <p className="text-xs text-[#606060] mt-0.5">Enregistrez le paiement d&apos;un membre</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#606060] hover:text-white hover:bg-white/[0.04] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Membre</label>
            <select
              required
              value={form.membreId}
              onChange={(e) => setForm({ ...form, membreId: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
            >
              <option value="" className="bg-[#111]">Sélectionner un membre</option>
              {membres.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#111]">
                  {m.prenom} {m.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Montant (DH)</label>
              <input
                type="number"
                required
                min={0}
                value={form.montant}
                onChange={(e) => setForm({ ...form, montant: parseInt(e.target.value) || 0 })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Année</label>
              <select
                value={form.annee}
                onChange={(e) => setForm({ ...form, annee: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
              >
                <option value="2024" className="bg-[#111]">2024</option>
                <option value="2025" className="bg-[#111]">2025</option>
                <option value="2026" className="bg-[#111]">2026</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Date de paiement</label>
              <input
                type="date"
                required
                value={form.datePaiement}
                onChange={(e) => setForm({ ...form, datePaiement: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Méthode</label>
              <select
                value={form.methode}
                onChange={(e) => setForm({ ...form, methode: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
              >
                <option value="Espèces" className="bg-[#111]">Espèces</option>
                <option value="Virement" className="bg-[#111]">Virement</option>
                <option value="Carte" className="bg-[#111]">Carte bancaire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Statut</label>
            <div className="flex gap-2">
              {([
                { value: "payée" as const, label: "Payée", color: "#22C55E" },
                { value: "en attente" as const, label: "En attente", color: "#F59E0B" },
                { value: "en retard" as const, label: "En retard", color: "#EF4444" },
              ]).map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm({ ...form, statut: s.value })}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                    form.statut === s.value
                      ? `text-[${s.color}] border-[${s.color}]/30`
                      : "text-[#606060] border-white/[0.08] hover:text-white"
                  }`}
                  style={form.statut === s.value ? { 
                    color: s.color, 
                    backgroundColor: `${s.color}15`,
                    borderColor: `${s.color}30`,
                  } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>
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
              {cotisation ? "Mettre à jour" : "Enregistrer le paiement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
