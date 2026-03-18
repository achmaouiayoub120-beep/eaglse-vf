"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarDays,
  Image as ImageIcon,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole?: string
  userName?: string
  userEmail?: string
}

const allNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "⌘1", roles: ["ADMIN", "MEMBER"] },
  { id: "members", label: "Membres", icon: Users, shortcut: "⌘2", roles: ["ADMIN"] },
  { id: "contributions", label: "Cotisations", icon: DollarSign, shortcut: "⌘3", roles: ["ADMIN", "MEMBER"] },
  { id: "events", label: "Événements", icon: CalendarDays, shortcut: "⌘4", roles: ["ADMIN", "MEMBER"] },
  { id: "gallery", label: "Galerie", icon: ImageIcon, shortcut: "⌘5", roles: ["ADMIN", "MEMBER"] },
  { id: "announcements", label: "Annonces", icon: Megaphone, shortcut: "⌘6", roles: ["ADMIN", "MEMBER"] },
  { id: "settings", label: "Paramètres", icon: Settings, shortcut: "⌘7", roles: ["ADMIN", "MEMBER"] },
]

export function Sidebar({ activeTab, onTabChange, userRole = "ADMIN", userName = "Admin Eagles", userEmail = "admin@eagles.com" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navItems = allNavItems.filter(item => item.roles.includes(userRole))

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    window.location.href = "/login"
  }

  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#0A0A0A] border-r border-white/[0.06] z-40 flex flex-col transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo section */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-[#A0A0A0] hover:text-white hover:bg-white/[0.04] transition-colors"
            title="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
        ) : (
          <>
            <div className="w-10 h-10 shrink-0 relative group">
              <img
                src="/logos/eagles-logo.png"
                alt="Eagles Logo"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-[#D45902]/0 group-hover:bg-[#D45902]/10 transition-all duration-500" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white leading-tight truncate">
                Club Eagles
              </h1>
              <p className="text-[10px] text-[#A0A0A0] truncate">
                Management System
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {!collapsed && (
          <div className="mb-3 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#606060]">
              Navigation
            </span>
          </div>
        )}
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                    isActive
                      ? "bg-[#D45902] text-white shadow-lg shadow-[#D45902]/20"
                      : "text-[#A0A0A0] hover:bg-white/[0.04] hover:text-white"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      <span className="text-[10px] text-[#606060] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.shortcut}
                      </span>
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold",
            userRole === "ADMIN" ? "bg-[#D45902]/10 text-[#D45902]" : "bg-[#3B82F6]/10 text-[#3B82F6]"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", userRole === "ADMIN" ? "bg-[#D45902]" : "bg-[#3B82F6]")} />
            {userRole === "ADMIN" ? "Administrateur" : "Membre"}
          </span>
        </div>
      )}

      {/* User section */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[10px] text-[#606060] truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#606060] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div className="border-t border-white/[0.06] p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-[#606060] hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs">Réduire</span>}
        </button>
      </div>
    </aside>
  )
}
