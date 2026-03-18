"use client"

import { Users, DollarSign, CalendarDays, UserPlus, Clock } from "lucide-react"

const activities = [
  { id: 1, action: "Nouveau membre inscrit", name: "Zakaria El Mansouri", time: "Il y a 2h", icon: UserPlus, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
  { id: 2, action: "Cotisation enregistrée", name: "Imane Chami - 300 DH", time: "Il y a 4h", icon: DollarSign, color: "text-[#D45902]", bg: "bg-[#D45902]/10" },
  { id: 3, action: "Événement créé", name: "Réunion mensuelle - 20 Jan", time: "Il y a 6h", icon: CalendarDays, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
  { id: 4, action: "Membre mis à jour", name: "Hamza Berrada", time: "Il y a 1j", icon: Users, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  { id: 5, action: "Cotisation en retard", name: "Ali Benomar - 300 DH", time: "Il y a 2j", icon: Clock, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
]

export function ActivityFeed() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        Activité Récente
      </h3>
      <div className="space-y-1">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group"
            >
              <div className={`p-2 rounded-xl ${activity.bg} ${activity.color} shrink-0`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#A0A0A0]">{activity.action}</p>
                <p className="text-xs font-medium text-white truncate">{activity.name}</p>
              </div>
              <span className="text-[10px] text-[#606060] shrink-0">{activity.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
