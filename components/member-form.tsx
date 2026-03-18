"use client"

import { useState, useEffect } from "react"
import { X, Upload } from "lucide-react"

interface Member {
  id: string
  nom: string
  prenom: string
  age: number
  ville: string
  telephone: string
  email: string
  dateAdhesion: string
  dureeMembership: string
  statut: "actif" | "inactif"
  photo: string
}

interface MemberFormProps {
  member: Member | null
  onSubmit: (member: Member) => void
  onClose: () => void
}

export function MemberForm({ member, onSubmit, onClose }: MemberFormProps) {
  const [form, setForm] = useState<Omit<Member, "id">>({
    nom: "",
    prenom: "",
    age: 20,
    ville: "",
    telephone: "",
    email: "",
    dateAdhesion: new Date().toISOString().split("T")[0],
    dureeMembership: "1 an",
    statut: "actif",
    photo: "",
  })

  useEffect(() => {
    if (member) {
      setForm({
        nom: member.nom,
        prenom: member.prenom,
        age: member.age,
        ville: member.ville,
        telephone: member.telephone,
        email: member.email,
        dateAdhesion: member.dateAdhesion,
        dureeMembership: member.dureeMembership,
        statut: member.statut,
        photo: member.photo,
      })
    }
  }, [member])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: member?.id || Date.now().toString(),
      ...form,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 glass-card rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#111111]/90 backdrop-blur-xl rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">
              {member ? "Modifier le Membre" : "Nouveau Membre"}
            </h2>
            <p className="text-xs text-[#606060] mt-0.5">
              {member ? "Mettez à jour les informations" : "Remplissez les informations du nouveau membre"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#606060] hover:text-white hover:bg-white/[0.04] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-xl font-bold text-white shrink-0">
              {form.prenom?.[0] || "?"}{form.nom?.[0] || "?"}
            </div>
            <div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#A0A0A0] border border-white/[0.08] rounded-xl hover:text-white hover:border-[#D45902]/30 transition-colors"
              >
                <Upload size={14} /> Changer la photo
              </button>
              <p className="text-[10px] text-[#606060] mt-1">JPG, PNG (max 2MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Prénom</label>
              <input
                required
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Nom</label>
              <input
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
                placeholder="Nom"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Âge</label>
              <input
                type="number"
                required
                min={15}
                max={99}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Ville</label>
              <input
                required
                value={form.ville}
                onChange={(e) => setForm({ ...form, ville: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
                placeholder="Ville"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Téléphone</label>
              <input
                required
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
                placeholder="06xxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] transition-colors"
                placeholder="email@exemple.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Date d&apos;adhésion</label>
              <input
                type="date"
                required
                value={form.dateAdhesion}
                onChange={(e) => setForm({ ...form, dateAdhesion: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Durée</label>
              <select
                value={form.dureeMembership}
                onChange={(e) => setForm({ ...form, dureeMembership: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-[#D45902] transition-colors"
              >
                <option value="6 mois" className="bg-[#111]">6 mois</option>
                <option value="1 an" className="bg-[#111]">1 an</option>
                <option value="2 ans" className="bg-[#111]">2 ans</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Statut</label>
            <div className="flex gap-3">
              {(["actif", "inactif"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, statut: s })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.statut === s
                      ? s === "actif"
                        ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                        : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"
                      : "bg-white/[0.04] text-[#606060] border border-white/[0.08] hover:text-white"
                  }`}
                >
                  {s === "actif" ? "Actif" : "Inactif"}
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
              {member ? "Mettre à jour" : "Créer le membre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
