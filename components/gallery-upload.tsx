"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, ImagePlus } from "lucide-react"

interface GalleryUploadProps {
  onUploadComplete: (data: { title: string; imageUrl: string; category: string }) => void
  onClose: () => void
}

export function GalleryUpload({ onUploadComplete, onClose }: GalleryUploadProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Seules les images sont acceptées")
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("La taille maximale est de 4 MB")
      return
    }
    setError("")
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile || !title) {
      setError("Titre et image requis")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      // Use proper uploadthing client logic
      const { uploadFiles } = await import("@/lib/uploadthing");
      
      const uploadRes = await uploadFiles("mediaUploader", {
        files: [selectedFile],
      });

      if (!uploadRes || uploadRes.length === 0) {
        throw new Error("Upload failed");
      }

      const imageUrl = uploadRes[0].url || preview;

      onUploadComplete({
        title,
        imageUrl: imageUrl || "",
        category,
      })
    } catch (err) {
      console.error("Upload error:", err)
      // Fallback: save with preview data URL
      if (preview) {
        onUploadComplete({
          title,
          imageUrl: preview,
          category,
        })
      } else {
        setError("Erreur lors de l'upload")
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ImagePlus size={20} className="text-[#D45902]" />
            Ajouter une image
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">
              Titre <span className="text-[#D45902]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'image"
              className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Catégorie</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Sport, Événements, Sorties..."
              className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-[#D45902] focus:ring-2 focus:ring-[#D45902]/20 transition-all"
            />
          </div>

          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-white/[0.1] hover:border-[#D45902]/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreview(null)
                    setSelectedFile(null)
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="py-4">
                <Upload size={32} className="mx-auto text-muted-foreground/30 group-hover:text-[#D45902]/50 transition-colors mb-3" />
                <p className="text-sm text-muted-foreground">
                  Glissez une image ici ou <span className="text-[#D45902] font-medium">cliquez pour parcourir</span>
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">PNG, JPG, WEBP • Max 4 MB</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-[#EF4444] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-white/[0.08] text-muted-foreground text-sm font-medium hover:bg-white/[0.04] transition-all"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile || !title}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#D45902] to-[#F97316] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#D45902]/25 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Upload...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Publier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
