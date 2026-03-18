"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Loader2, AlertCircle, UserPlus, LogIn } from "lucide-react"

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: "Faible", color: "bg-red-500" }
  if (score <= 2) return { score: 2, label: "Moyen", color: "bg-amber-500" }
  if (score <= 3) return { score: 3, label: "Bon", color: "bg-blue-500" }
  return { score: 4, label: "Fort", color: "bg-emerald-500" }
}

export default function LoginPage() {
  const router = useRouter()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shakeForm, setShakeForm] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [mounted, setMounted] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const strength = password.length > 0 ? getPasswordStrength(password) : null

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMsg("")

      if (!email || !password) {
        setErrorMsg("Veuillez remplir tous les champs")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      setIsLoading(true)

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.error || "Email ou mot de passe incorrect")
          setPassword("")
          setShakeForm(true)
          setTimeout(() => setShakeForm(false), 600)
          setIsLoading(false)
          return
        }

        setLoginSuccess(true)
        setTimeout(() => router.push("/"), 800)
      } catch {
        setErrorMsg("Erreur de connexion au serveur")
        setIsLoading(false)
      }
    },
    [email, password, router]
  )

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMsg("")

      if (!fullName || !email || !password) {
        setErrorMsg("Veuillez remplir tous les champs obligatoires")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      if (password.length < 6) {
        setErrorMsg("Le mot de passe doit contenir au moins 6 caractères")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      if (password !== confirmPassword) {
        setErrorMsg("Les mots de passe ne correspondent pas")
        setShakeForm(true)
        setTimeout(() => setShakeForm(false), 600)
        return
      }

      setIsLoading(true)

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password, phone, city }),
        })

        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.error || "Erreur lors de l'inscription")
          setShakeForm(true)
          setTimeout(() => setShakeForm(false), 600)
          setIsLoading(false)
          return
        }

        setLoginSuccess(true)
        setTimeout(() => router.push("/"), 800)
      } catch {
        setErrorMsg("Erreur de connexion au serveur")
        setIsLoading(false)
      }
    },
    [fullName, email, password, confirmPassword, phone, city, router]
  )

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#D45902]/40"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animation: `particle-float ${8 + (i % 12)}s linear infinite`,
              animationDelay: `${i % 8}s`,
            }}
          />
        ))}
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D45902]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#D45902]/6 rounded-full blur-[120px]" />
      </div>

      {/* Login Card */}
      <div
        className={`relative w-full max-w-md mx-4 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${shakeForm ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
      >
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          {/* Grain texture */}
          <div className="absolute inset-0 grain-overlay rounded-3xl" />

          {/* Content */}
          <div className="relative z-10">
            {/* Dual Logos */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="relative w-16 h-16 transition-transform duration-500 hover:scale-110">
                <Image
                  src="/logos/school-logo.png"
                  alt="EST - École Supérieure de Technologie"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="relative w-16 h-16 transition-transform duration-500 hover:scale-110 group">
                <Image
                  src="/logos/eagles-logo.png"
                  alt="Club Eagles"
                  fill
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 rounded-full bg-[#D45902]/0 group-hover:bg-[#D45902]/15 transition-all duration-500 blur-xl" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">
                Club Eagles Management
              </h1>
              <p className="text-sm text-[#A0A0A0]">
                {mode === "login" ? "Connectez-vous pour accéder à la plateforme" : "Créez votre compte membre"}
              </p>
            </div>

            {/* Mode toggle tabs */}
            <div className="flex mb-6 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => { setMode("login"); setErrorMsg("") }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === "login"
                    ? "bg-gradient-to-r from-[#D45902] to-[#F97316] text-white shadow-lg shadow-[#D45902]/20"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                <LogIn size={14} />
                Connexion
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setErrorMsg("") }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === "register"
                    ? "bg-gradient-to-r from-[#D45902] to-[#F97316] text-white shadow-lg shadow-[#D45902]/20"
                    : "text-[#A0A0A0] hover:text-white"
                }`}
              >
                <UserPlus size={14} />
                Inscription
              </button>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="mb-5 flex items-center gap-3 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20">
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <p className="text-sm text-[#EF4444]">{errorMsg}</p>
              </div>
            )}

            {/* Success overlay */}
            {loginSuccess && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#080808]/90 rounded-3xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">{mode === "login" ? "Connexion réussie" : "Inscription réussie"}</p>
                  <p className="text-sm text-[#A0A0A0] mt-1">Redirection...</p>
                </div>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-[#A0A0A0] mb-2">
                    Adresse email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="votre@email.com"
                    className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-[#A0A0A0] mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      placeholder="Entrez votre mot de passe"
                      className="w-full h-12 px-4 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#606060] hover:text-white transition-colors rounded-lg"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                              level <= strength.score ? strength.color : "bg-white/[0.08]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#606060] font-medium">{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded border border-white/[0.15] bg-white/[0.04] peer-checked:bg-[#D45902] peer-checked:border-[#D45902] transition-all flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#A0A0A0]">Se souvenir de moi</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D45902] to-[#F97316] text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D45902]/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connexion en cours...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                    Nom complet <span className="text-[#D45902]">*</span>
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    placeholder="Prénom Nom"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                    Email <span className="text-[#D45902]">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="votre@email.com"
                    className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                      Mot de passe <span className="text-[#D45902]">*</span>
                    </label>
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      placeholder="Min. 6 caractères"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-confirm" className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                      Confirmer <span className="text-[#D45902]">*</span>
                    </label>
                    <input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      placeholder="Confirmer"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                {strength && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            level <= strength.score ? strength.color : "bg-white/[0.08]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#606060] font-medium">{strength.label}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                      Téléphone
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                      placeholder="06XXXXXXXX"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-city" className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
                      Ville
                    </label>
                    <input
                      id="reg-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={isLoading}
                      placeholder="Ville"
                      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-[#606060] outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all duration-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" onChange={() => setShowPassword(!showPassword)} />
                  <div className="w-4 h-4 rounded border border-white/[0.15] bg-white/[0.04] peer-checked:bg-[#D45902] peer-checked:border-[#D45902] transition-all flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#A0A0A0]">Afficher les mots de passe</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D45902] to-[#F97316] text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D45902]/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Inscription en cours...
                    </span>
                  ) : (
                    "Créer mon compte"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#606060] mt-6">
          © Ahmed Arryan Bennifou — Club Eagles Management System
        </p>
      </div>
    </div>
  )
}
