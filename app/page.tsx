"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit2, Trash2, Users, DollarSign, Search, CalendarDays, TrendingUp, MapPin, Clock, Heart, MessageCircle, Pin, Globe, Lock, Bell, Moon, User, Shield, Upload } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCard } from "@/components/stats-card"
import { ActivityFeed } from "@/components/activity-feed"
import { DashboardCharts } from "@/components/dashboard-charts"
import { MemberForm } from "@/components/member-form"
import { EventForm } from "@/components/event-form"
import { AnnouncementForm } from "@/components/announcement-form"
import { CotisationForm } from "@/components/cotisation-form"
import { ConfirmModal } from "@/components/confirm-modal"
import { Toast, type ToastType } from "@/components/toast"
import { GalleryUpload } from "@/components/gallery-upload"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

// Types (kept compatible with existing form components)
interface Member { id: string; nom: string; prenom: string; age: number; ville: string; telephone: string; email: string; dateAdhesion: string; dureeMembership: string; statut: "actif" | "inactif"; photo: string }
interface Cotisation { id: string; membreId: string; membreNom: string; montant: number; datePaiement: string; statut: "payée" | "en attente" | "en retard"; methode: string; annee: string }
interface Event { id: string; titre: string; date: string; heure: string; lieu: string; description: string; capacite: number; participants: string[] }
interface GalleryItem { id: string; titre: string; url: string; eventId: string; likes: number; liked: boolean }
interface Announcement { id: string; titre: string; contenu: string; date: string; visibilite: "public" | "membres"; epingle: boolean; auteur: string }
interface CurrentUser { id: string; fullName: string; email: string; role: string; phone?: string; city?: string; age?: number; status?: string; memberCode?: string; joinDate?: string; membershipType?: string }

// ─── Mappers: DB format → UI format (preserves existing component interfaces) ───
function mapDbMember(u: any): Member {
  const parts = (u.fullName || "").split(" ")
  return {
    id: u.id,
    prenom: parts[0] || "",
    nom: parts.slice(1).join(" ") || "",
    age: u.age || 0,
    ville: u.city || "",
    telephone: u.phone || "",
    email: u.email || "",
    dateAdhesion: u.joinDate ? new Date(u.joinDate).toISOString().split("T")[0] : "",
    dureeMembership: u.membershipType || "1 an",
    statut: u.status === "ACTIVE" ? "actif" : "inactif",
    photo: "",
  }
}

function mapDbPayment(p: any): Cotisation {
  const statusMap: Record<string, "payée" | "en attente" | "en retard"> = { PAID: "payée", PENDING: "en attente", UNPAID: "en retard" }
  return {
    id: p.id,
    membreId: p.userId,
    membreNom: p.user?.fullName || "",
    montant: p.amount,
    datePaiement: p.paymentDate ? new Date(p.paymentDate).toISOString().split("T")[0] : "",
    statut: statusMap[p.status] || "en attente",
    methode: p.method || "",
    annee: p.period || "",
  }
}

function mapDbEvent(e: any): Event {
  return {
    id: e.id,
    titre: e.title,
    description: e.description,
    lieu: e.location || "",
    date: e.eventDate ? new Date(e.eventDate).toISOString().split("T")[0] : "",
    heure: e.eventTime || "",
    capacite: e.capacity,
    participants: [],
  }
}

function mapDbGallery(m: any): GalleryItem {
  return { id: m.id, titre: m.title, url: m.imageUrl || "", eventId: "", likes: 0, liked: false }
}

function mapDbAnnouncement(a: any): Announcement {
  return {
    id: a.id,
    titre: a.title,
    contenu: a.content,
    date: a.createdAt ? new Date(a.createdAt).toISOString().split("T")[0] : "",
    visibilite: a.visibility === "public" ? "public" : "membres",
    epingle: a.pinned,
    auteur: a.createdBy?.fullName || "Admin Eagles",
  }
}

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-background" suppressHydrationWarning>
      <div className="w-[260px] bg-card border-r border-border skeleton-shimmer" />
      <div className="flex-1 p-6 space-y-6">
        <div className="h-12 skeleton-shimmer rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton-shimmer rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-72 skeleton-shimmer rounded-2xl" />
          <div className="h-72 skeleton-shimmer rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [cotisations, setCotisations] = useState<Cotisation[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showCotisationForm, setShowCotisationForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [showGalleryUpload, setShowGalleryUpload] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedCotisation, setSelectedCotisation] = useState<Cotisation | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean }>({ message: "", type: "info", visible: false })
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({ isOpen: false, title: "", message: "", onConfirm: () => {} })

  const showToast = useCallback((message: string, type: ToastType) => { setToast({ message, type, visible: true }) }, [])
  const isAdmin = currentUser?.role === "ADMIN"

  // ─── Load data from API ───
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me")
        if (!res.ok) { router.push("/login"); return }
        const { user } = await res.json()
        setCurrentUser(user)

        // Fetch all data in parallel
        const [membersRes, paymentsRes, eventsRes, mediaRes, announcementsRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/payments"),
          fetch("/api/events"),
          fetch("/api/media"),
          fetch("/api/announcements"),
        ])

        if (membersRes.ok) { const d = await membersRes.json(); setMembers((d.members || []).map(mapDbMember)) }
        if (paymentsRes.ok) { const d = await paymentsRes.json(); setCotisations((d.payments || []).map(mapDbPayment)) }
        if (eventsRes.ok) { const d = await eventsRes.json(); setEvents((d.events || []).map(mapDbEvent)) }
        if (mediaRes.ok) { const d = await mediaRes.json(); setGallery((d.media || []).map(mapDbGallery)) }
        if (announcementsRes.ok) { const d = await announcementsRes.json(); setAnnouncements((d.announcements || []).map(mapDbAnnouncement)) }
      } catch (err) {
        console.error("Init error:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  // ─── CRUD via API ───
  const handleSubmitMember = async (m: Member) => {
    try {
      if (selectedMember) {
        await fetch(`/api/members/${m.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: `${m.prenom} ${m.nom}`, email: m.email, phone: m.telephone, city: m.ville, age: m.age, status: m.statut === "actif" ? "ACTIVE" : "SUSPENDED", membershipType: m.dureeMembership }),
        })
        setMembers(prev => prev.map(x => x.id === m.id ? m : x))
        showToast("Membre mis à jour", "success")
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: `${m.prenom} ${m.nom}`, email: m.email, phone: m.telephone, city: m.ville, age: m.age, password: "Member123!", joinDate: m.dateAdhesion, membershipType: m.dureeMembership }),
        })
        if (res.ok) {
          const { member } = await res.json()
          setMembers(prev => [...prev, mapDbMember(member)])
        }
        showToast("Membre ajouté", "success")
      }
    } catch { showToast("Erreur lors de la sauvegarde", "error") }
  }

  const handleSubmitCotisation = async (c: Cotisation) => {
    const statusMap: Record<string, string> = { "payée": "PAID", "en attente": "PENDING", "en retard": "UNPAID" }
    try {
      if (selectedCotisation) {
        await fetch(`/api/payments/${c.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: c.montant, period: c.annee, status: statusMap[c.statut], method: c.methode, paymentDate: c.datePaiement || null }),
        })
        setCotisations(prev => prev.map(x => x.id === c.id ? c : x))
        showToast("Cotisation mise à jour", "success")
      } else {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: c.membreId, amount: c.montant, period: c.annee, status: statusMap[c.statut], method: c.methode, paymentDate: c.datePaiement || null }),
        })
        if (res.ok) {
          const { payment } = await res.json()
          setCotisations(prev => [...prev, mapDbPayment(payment)])
        }
        showToast("Paiement enregistré", "success")
      }
    } catch { showToast("Erreur lors de la sauvegarde", "error") }
  }

  const handleSubmitEvent = async (e: Event) => {
    try {
      if (selectedEvent) {
        await fetch(`/api/events/${e.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: e.titre, description: e.description, location: e.lieu, eventDate: e.date, eventTime: e.heure, capacity: e.capacite }),
        })
        setEvents(prev => prev.map(x => x.id === e.id ? e : x))
        showToast("Événement mis à jour", "success")
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: e.titre, description: e.description, location: e.lieu, eventDate: e.date, eventTime: e.heure, capacity: e.capacite }),
        })
        if (res.ok) {
          const { event } = await res.json()
          setEvents(prev => [...prev, mapDbEvent(event)])
        }
        showToast("Événement créé", "success")
      }
    } catch { showToast("Erreur lors de la sauvegarde", "error") }
  }

  const handleSubmitAnnouncement = async (a: Announcement) => {
    try {
      if (selectedAnnouncement) {
        await fetch(`/api/announcements/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: a.titre, content: a.contenu, visibility: a.visibilite, pinned: a.epingle }),
        })
        setAnnouncements(prev => prev.map(x => x.id === a.id ? a : x))
        showToast("Annonce mise à jour", "success")
      } else {
        const res = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: a.titre, content: a.contenu, visibility: a.visibilite, pinned: a.epingle }),
        })
        if (res.ok) {
          const { announcement } = await res.json()
          setAnnouncements(prev => [...prev, mapDbAnnouncement(announcement)])
        }
        showToast("Annonce publiée", "success")
      }
    } catch { showToast("Erreur lors de la sauvegarde", "error") }
  }

  const handleGalleryUpload = async (data: { title: string; imageUrl: string; category: string }) => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.title, imageUrl: data.imageUrl, category: data.category }),
      })
      if (res.ok) {
        const { mediaItem } = await res.json()
        setGallery(prev => [mapDbGallery(mediaItem), ...prev])
      }
      setShowGalleryUpload(false)
      showToast("Image ajoutée à la galerie", "success")
    } catch { showToast("Erreur lors de l'upload", "error") }
  }

  const deleteMember = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer ce membre ?", onConfirm: async () => {
    await fetch(`/api/members/${id}`, { method: "DELETE" })
    setMembers(prev => prev.filter(x => x.id !== id)); showToast("Membre supprimé", "success"); setConfirmModal(p => ({ ...p, isOpen: false }))
  }})
  const deleteCotisation = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cette cotisation ?", onConfirm: async () => {
    await fetch(`/api/payments/${id}`, { method: "DELETE" })
    setCotisations(prev => prev.filter(x => x.id !== id)); showToast("Cotisation supprimée", "success"); setConfirmModal(p => ({ ...p, isOpen: false }))
  }})
  const deleteEvent = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cet événement ?", onConfirm: async () => {
    await fetch(`/api/events/${id}`, { method: "DELETE" })
    setEvents(prev => prev.filter(x => x.id !== id)); showToast("Événement supprimé", "success"); setConfirmModal(p => ({ ...p, isOpen: false }))
  }})
  const deleteAnnouncement = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cette annonce ?", onConfirm: async () => {
    await fetch(`/api/announcements/${id}`, { method: "DELETE" })
    setAnnouncements(prev => prev.filter(x => x.id !== id)); showToast("Annonce supprimée", "success"); setConfirmModal(p => ({ ...p, isOpen: false }))
  }})
  const deleteGalleryItem = (id: string) => setConfirmModal({ isOpen: true, title: "Supprimer", message: "Supprimer cette image ?", onConfirm: async () => {
    await fetch(`/api/media?id=${id}`, { method: "DELETE" })
    setGallery(prev => prev.filter(x => x.id !== id)); showToast("Image supprimée", "success"); setConfirmModal(p => ({ ...p, isOpen: false }))
  }})

  const toggleLike = (id: string) => { setGallery(prev => prev.map(g => g.id === id ? { ...g, liked: !g.liked, likes: g.liked ? g.likes - 1 : g.likes + 1 } : g)) }

  // Stats
  const paidC = cotisations.filter(c => c.statut === "payée").length
  const totalRev = cotisations.filter(c => c.statut === "payée").reduce((s, c) => s + c.montant, 0)
  const activeM = members.filter(m => m.statut === "actif").length
  const filtered = members.filter(m => !searchQuery || `${m.prenom} ${m.nom} ${m.email} ${m.ville}`.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) return <LoadingSkeleton />

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole={currentUser?.role} userName={currentUser?.fullName} userEmail={currentUser?.email} />
      <div className="flex-1 ml-[260px] flex flex-col overflow-hidden">
        <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} sidebarCollapsed={false} userName={currentUser?.fullName} userEmail={currentUser?.email} userRole={currentUser?.role} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-6">

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-bold text-foreground">{isAdmin ? "Dashboard" : "Mon Espace"}</h2><p className="text-sm text-muted-foreground mt-0.5">{isAdmin ? "Vue d'ensemble — Club Eagles" : `Bienvenue, ${currentUser?.fullName}`}</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {isAdmin ? (
                    <>
                      <StatsCard label="Total Membres" value={members.length} icon={Users} trend={12} variant="accent" />
                      <StatsCard label="Membres Actifs" value={activeM} icon={TrendingUp} trend={8} variant="success" />
                      <StatsCard label="Événements" value={events.length} icon={CalendarDays} trend={5} />
                      <StatsCard label="Revenus (DH)" value={totalRev} icon={DollarSign} trend={15} variant="warning" suffix=" DH" />
                    </>
                  ) : (
                    <>
                      <StatsCard label="Mon Statut" value={currentUser?.status === "ACTIVE" ? "Actif" : "Inactif"} icon={User} variant="success" />
                      <StatsCard label="Mes Cotisations" value={`${paidC}/${cotisations.length}`} icon={DollarSign} variant={paidC === cotisations.length ? "success" : "warning"} />
                      <StatsCard label="Événements" value={events.length} icon={CalendarDays} />
                      <StatsCard label="Annonces" value={announcements.length} icon={Bell} variant="accent" />
                    </>
                  )}
                </div>
                {isAdmin && <DashboardCharts />}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ActivityFeed />
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><DollarSign size={14} className="text-[#D45902]" />Cotisations Récentes</h3>
                    <div className="space-y-3">{cotisations.slice(0, 5).map(c => (
                      <div key={c.id} className="flex items-center justify-between"><div><p className="text-xs font-medium text-foreground">{c.membreNom}</p><p className="text-[10px] text-muted-foreground">{c.datePaiement || "Non payé"}</p></div>
                        <div className="text-right"><p className="text-xs font-bold text-foreground">{c.montant} DH</p><span className={cn("text-[10px] font-semibold", c.statut === "payée" && "text-[#22C55E]", c.statut === "en attente" && "text-[#F59E0B]", c.statut === "en retard" && "text-[#EF4444]")}>{c.statut}</span></div></div>
                    ))}</div>
                  </div>
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-[#D45902]" />Performance</h3>
                    <div className="space-y-4">{[
                      { label: "Taux de paiement", value: cotisations.length > 0 ? Math.round((paidC / cotisations.length) * 100) : 0 },
                      { label: "Membres actifs", value: members.length > 0 ? Math.round((activeM / members.length) * 100) : 0 },
                      { label: "Participation", value: 78 },
                    ].map((m, i) => (<div key={i}><div className="flex justify-between mb-1"><span className="text-xs text-muted-foreground">{m.label}</span><span className="text-xs font-bold text-foreground">{m.value}%</span></div><div className="w-full bg-border rounded-full h-1.5"><div className="bg-[#D45902] rounded-full h-1.5 transition-all duration-1000" style={{ width: `${m.value}%` }} /></div></div>))}</div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS — Admin only */}
            {activeTab === "members" && isAdmin && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-foreground">Membres</h2><p className="text-sm text-muted-foreground">{members.length} membre(s) enregistré(s)</p></div>
                  <button onClick={() => { setSelectedMember(null); setShowMemberForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Ajouter</button>
                </div>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-border">
                    {["Membre", "Email", "Ville", "Âge", "Statut", "Actions"].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}
                  </tr></thead><tbody>
                    {filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center"><Search size={32} className="mx-auto text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">Aucun membre trouvé</p></td></tr> :
                    filtered.map(m => (<tr key={m.id} className="border-b border-border hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-xs font-bold text-white">{m.prenom[0]}{m.nom[0]}</div><div><span className="text-sm font-medium text-foreground">{m.prenom} {m.nom}</span><p className="text-[10px] text-muted-foreground">Depuis {m.dateAdhesion}</p></div></div></td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{m.email}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{m.ville}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{m.age}</td>
                      <td className="px-5 py-3.5"><span className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold", m.statut === "actif" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]")}>{m.statut}</span></td>
                      <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedMember(m); setShowMemberForm(true) }} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteMember(m.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><Trash2 size={14} /></button>
                      </div></td>
                    </tr>))}
                  </tbody></table></div>
                </div>
              </div>
            )}

            {/* CONTRIBUTIONS */}
            {activeTab === "contributions" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-foreground">Cotisations</h2><p className="text-sm text-muted-foreground">{paidC}/{cotisations.length} payée(s) — Total: {totalRev} DH</p></div>
                  {isAdmin && <button onClick={() => { setSelectedCotisation(null); setShowCotisationForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Enregistrer</button>}
                </div>
                {/* Progress bar */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Taux de collecte</span><span className="text-sm font-bold text-foreground">{cotisations.length > 0 ? Math.round((paidC / cotisations.length) * 100) : 0}%</span></div>
                  <div className="w-full bg-border rounded-full h-3"><div className="bg-gradient-to-r from-[#D45902] to-[#22C55E] rounded-full h-3 transition-all duration-1000" style={{ width: `${cotisations.length > 0 ? (paidC / cotisations.length) * 100 : 0}%` }} /></div>
                </div>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-border">
                    {["Membre", "Montant", "Date", "Méthode", "Statut", ...(isAdmin ? ["Actions"] : [])].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}
                  </tr></thead><tbody>
                    {cotisations.map(c => (<tr key={c.id} className="border-b border-border hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{c.membreNom}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground font-semibold">{c.montant} DH</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.datePaiement || "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.methode || "—"}</td>
                      <td className="px-5 py-3.5"><span className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold", c.statut === "payée" && "bg-[#22C55E]/10 text-[#22C55E]", c.statut === "en attente" && "bg-[#F59E0B]/10 text-[#F59E0B]", c.statut === "en retard" && "bg-[#EF4444]/10 text-[#EF4444]")}>{c.statut}</span></td>
                      {isAdmin && <td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setSelectedCotisation(c); setShowCotisationForm(true) }} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => deleteCotisation(c.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"><Trash2 size={14} /></button>
                      </div></td>}
                    </tr>))}
                  </tbody></table></div>
                </div>
              </div>
            )}

            {/* EVENTS */}
            {activeTab === "events" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-foreground">Événements</h2><p className="text-sm text-muted-foreground">{events.length} événement(s) planifié(s)</p></div>
                  {isAdmin && <button onClick={() => { setSelectedEvent(null); setShowEventForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Créer</button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {events.map(ev => (
                    <div key={ev.id} className="glass-card rounded-2xl p-5 hover:border-[#D45902]/20 hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className="flex items-start justify-between mb-3"><h3 className="text-sm font-bold text-foreground leading-tight flex-1 pr-2">{ev.titre}</h3>
                        {isAdmin && <div className="flex gap-1"><button onClick={() => { setSelectedEvent(ev); setShowEventForm(true) }} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors opacity-0 group-hover:opacity-100"><Edit2 size={13} /></button><button onClick={() => deleteEvent(ev.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button></div>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{ev.description}</p>
                      <div className="space-y-1.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5"><CalendarDays size={11} /><span>{ev.date}</span><Clock size={11} className="ml-2" /><span>{ev.heure}</span></div>
                        <div className="flex items-center gap-1.5"><MapPin size={11} /><span>{ev.lieu}</span></div>
                        <div className="flex items-center gap-1.5"><Users size={11} /><span>{ev.participants.length}/{ev.capacite} participants</span></div>
                      </div>
                      <div className="mt-3 w-full bg-border rounded-full h-1"><div className="bg-[#D45902] rounded-full h-1" style={{ width: `${(ev.participants.length / ev.capacite) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY */}
            {activeTab === "gallery" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-foreground">Galerie Média</h2><p className="text-sm text-muted-foreground">Photos et vidéos du club</p></div>
                  {isAdmin && <button onClick={() => setShowGalleryUpload(true)} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Upload size={14} />Ajouter</button>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map(item => (
                    <div key={item.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-0.5 transition-all duration-200">
                      <div className="aspect-video bg-gradient-to-br from-[#D45902]/20 to-[#F97316]/10 flex items-center justify-center relative overflow-hidden">
                        {item.url && item.url !== "/placeholder.svg" ? (
                          <img src={item.url} alt={item.titre} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">📸</span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        {isAdmin && (
                          <button onClick={() => deleteGalleryItem(item.id)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#EF4444] transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">{item.titre}</h4>
                        <div className="flex items-center gap-4">
                          <button onClick={() => toggleLike(item.id)} className={cn("flex items-center gap-1 text-xs transition-colors", item.liked ? "text-[#EF4444]" : "text-muted-foreground hover:text-[#EF4444]")}><Heart size={14} fill={item.liked ? "#EF4444" : "none"} />{item.likes}</button>
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"><MessageCircle size={14} />0</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-xl font-bold text-foreground">Annonces</h2><p className="text-sm text-muted-foreground">Actualités et communications du club</p></div>
                  {isAdmin && <button onClick={() => { setSelectedAnnouncement(null); setShowAnnouncementForm(true) }} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium bg-gradient-to-r from-[#D45902] to-[#F97316] text-white rounded-xl hover:shadow-lg hover:shadow-[#D45902]/25 transition-all"><Plus size={14} />Publier</button>}
                </div>
                <div className="space-y-4">
                  {[...announcements].sort((a, b) => (b.epingle ? 1 : 0) - (a.epingle ? 1 : 0)).map(ann => (
                    <div key={ann.id} className={cn("glass-card rounded-2xl p-6 hover:border-[#D45902]/20 transition-all group", ann.epingle && "border-[#D45902]/20 glow-orange")}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {ann.epingle && <Pin size={14} className="text-[#D45902]" />}
                          <h3 className="text-base font-bold text-foreground">{ann.titre}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1", ann.visibilite === "public" ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-[#F59E0B]/10 text-[#F59E0B]")}>{ann.visibilite === "public" ? <><Globe size={10} />Public</> : <><Lock size={10} />Membres</>}</span>
                          {isAdmin && <>
                            <button onClick={() => { setSelectedAnnouncement(ann); setShowAnnouncementForm(true) }} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#D45902] hover:bg-[#D45902]/10 transition-colors opacity-0 group-hover:opacity-100"><Edit2 size={13} /></button>
                            <button onClick={() => deleteAnnouncement(ann.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>
                          </>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{ann.contenu}</p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground"><span>{ann.date}</span><span>•</span><span>{ann.auteur}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
                <div><h2 className="text-xl font-bold text-foreground">Paramètres</h2><p className="text-sm text-muted-foreground">Configuration de la plateforme</p></div>
                <div className="glass-card rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D45902] to-[#F97316] flex items-center justify-center text-2xl font-bold text-white">{currentUser?.fullName?.charAt(0) || "U"}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-foreground">{currentUser?.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">{isAdmin ? "Administrateur principal" : "Membre"}</p>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-6 space-y-4">
                    {[
                      { icon: User, label: "Profil utilisateur", desc: "Gérer vos informations personnelles" },
                      { icon: Bell, label: "Notifications", desc: "Configurer les alertes et rappels" },
                      { icon: Shield, label: "Sécurité", desc: "Mot de passe et authentification" },
                    ].map((item, i) => (<div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"><div className="p-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] text-[#D45902]"><item.icon size={18} /></div><div className="flex-1"><p className="text-sm font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div><ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" /></div>))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <footer className="border-t border-border py-4 mt-8">
            <p className="text-center text-[11px] text-muted-foreground">© Ahmed Arryan Bennifou — Club Eagles Management System</p>
          </footer>
        </main>
      </div>

      {/* Modals */}
      {showMemberForm && <MemberForm member={selectedMember} onSubmit={handleSubmitMember} onClose={() => setShowMemberForm(false)} />}
      {showCotisationForm && <CotisationForm cotisation={selectedCotisation} membres={members} onSubmit={handleSubmitCotisation} onClose={() => setShowCotisationForm(false)} />}
      {showEventForm && <EventForm event={selectedEvent} onSubmit={handleSubmitEvent} onClose={() => setShowEventForm(false)} />}
      {showAnnouncementForm && <AnnouncementForm announcement={selectedAnnouncement} onSubmit={handleSubmitAnnouncement} onClose={() => setShowAnnouncementForm(false)} />}
      {showGalleryUpload && <GalleryUpload onUploadComplete={handleGalleryUpload} onClose={() => setShowGalleryUpload(false)} />}
      <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(p => ({ ...p, isOpen: false }))} />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(p => ({ ...p, visible: false }))} />
    </div>
  )
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
}
