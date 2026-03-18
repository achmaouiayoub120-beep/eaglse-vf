"use client"

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const memberGrowthData = [
  { month: "Jan", membres: 12 },
  { month: "Fév", membres: 18 },
  { month: "Mar", membres: 24 },
  { month: "Avr", membres: 31 },
  { month: "Mai", membres: 38 },
  { month: "Jun", membres: 45 },
  { month: "Jul", membres: 42 },
  { month: "Aoû", membres: 48 },
  { month: "Sep", membres: 55 },
  { month: "Oct", membres: 62 },
  { month: "Nov", membres: 68 },
  { month: "Déc", membres: 75 },
]

const eventParticipationData = [
  { event: "Réunion Générale", participants: 45 },
  { event: "Tournoi Sport", participants: 38 },
  { event: "Workshop", participants: 28 },
  { event: "Sortie Club", participants: 52 },
  { event: "Conférence", participants: 35 },
]

const contributionData = [
  { name: "Payées", value: 65, color: "#22C55E" },
  { name: "En attente", value: 20, color: "#F59E0B" },
  { name: "En retard", value: 15, color: "#EF4444" },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs font-semibold text-white mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs text-[#A0A0A0]">
            <span style={{ color: entry.color || "#D45902" }}>●</span> {entry.name || entry.dataKey}: <span className="text-white font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Member Growth */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Croissance des Membres</h3>
        <p className="text-xs text-[#606060] mb-6">Évolution sur les 12 derniers mois</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={memberGrowthData}>
            <defs>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D45902" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#D45902" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#606060", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#606060", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="membres"
              stroke="#D45902"
              strokeWidth={2}
              fill="url(#orangeGradient)"
              dot={{ fill: "#D45902", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#F97316", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Contribution Breakdown */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Statut des Cotisations</h3>
        <p className="text-xs text-[#606060] mb-6">Répartition année en cours</p>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width="50%" height={220}>
            <PieChart>
              <Pie
                data={contributionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {contributionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {contributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="flex-1">
                  <p className="text-xs text-white font-medium">{item.name}</p>
                  <p className="text-[11px] text-[#606060]">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Participation */}
      <div className="glass-card rounded-2xl p-6 lg:col-span-2">
        <h3 className="text-sm font-semibold text-white mb-1">Participation aux Événements</h3>
        <p className="text-xs text-[#606060] mb-6">Nombre de participants par événement</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={eventParticipationData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="event" tick={{ fill: "#606060", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#606060", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="participants" fill="#D45902" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
