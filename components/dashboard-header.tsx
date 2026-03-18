"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Command,
  Plus,
  User,
  Settings,
  LogOut,
  X,
  Users,
  CalendarDays,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sidebarCollapsed: boolean
  userName?: string
  userEmail?: string
  userRole?: string
}

export function DashboardHeader({ searchQuery, onSearchChange, sidebarCollapsed, userName = "Admin Eagles", userEmail = "admin@eagles.com", userRole = "ADMIN" }: DashboardHeaderProps) {
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifications = [
    { id: 1, text: "Nouveau membre inscrit: Zakaria El Mansouri", time: "Il y a 2h", type: "info" as const },
    { id: 2, text: "Cotisation en retard: Hamza Berrada", time: "Il y a 5h", type: "warning" as const },
    { id: 3, text: "Événement demain: Réunion des membres", time: "Il y a 1j", type: "info" as const },
  ]

  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    window.location.href = "/login"
  }

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6">
        {/* Search */}
        <button
          onClick={() => setShowCommandPalette(true)}
          className="flex items-center gap-3 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-[#606060] hover:text-[#A0A0A0] hover:border-white/[0.12] transition-all w-80 group"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Rechercher...</span>
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-white/[0.06] rounded-md text-[10px] font-mono text-[#606060] group-hover:text-[#A0A0A0]">
            <Command size={10} /> K
          </kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <div className="mr-1">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
              className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D45902] rounded-full animate-pulse" />
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 glass-card rounded-2xl p-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <button className="text-xs text-[#D45902] hover:text-[#F97316] font-medium">
                    Tout marquer lu
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        n.type === "warning" ? "bg-[#F59E0B]" : "bg-[#3B82F6]"
                      )} />
                      <div>
                        <p className="text-xs text-white leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-[#606060] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 glass-card rounded-2xl p-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-white">{userName}</p>
                  <p className="text-xs text-[#606060]">{userEmail}</p>
                  <span className={cn(
                    "inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold",
                    userRole === "ADMIN" ? "bg-[#D45902]/10 text-[#D45902]" : "bg-[#3B82F6]/10 text-[#3B82F6]"
                  )}>
                    {userRole === "ADMIN" ? "Administrateur" : "Membre"}
                  </span>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                    <User size={14} /> Profil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                    <Settings size={14} /> Paramètres
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-colors"
                  >
                    <LogOut size={14} /> Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCommandPalette(false)}
          />
          <div className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search size={18} className="text-[#606060]" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher des membres, événements, actions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[#606060] outline-none"
              />
              <button
                onClick={() => setShowCommandPalette(false)}
                className="p-1 rounded-lg text-[#606060] hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#606060]">
                  Actions rapides
                </span>
              </div>
              {[
                { icon: Plus, label: "Nouveau membre", shortcut: "N" },
                { icon: DollarSign, label: "Enregistrer cotisation", shortcut: "C" },
                { icon: CalendarDays, label: "Créer événement", shortcut: "E" },
                { icon: Users, label: "Voir tous les membres", shortcut: "M" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => setShowCommandPalette(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A0A0A0] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <action.icon size={16} className="text-[#D45902]" />
                  <span className="flex-1 text-left">{action.label}</span>
                  <kbd className="px-2 py-0.5 bg-white/[0.06] rounded text-[10px] font-mono text-[#606060]">
                    {action.shortcut}
                  </kbd>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
