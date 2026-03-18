"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-[#D45902]/30 transition-all text-muted-foreground hover:text-foreground flex items-center justify-center dark:bg-[#1A1A1A]"
      title={`Passer au thème ${theme === "light" ? "sombre" : "clair"}`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#D45902]" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-[#D45902]" />
      <span className="sr-only">Changer le thème</span>
    </button>
  )
}
