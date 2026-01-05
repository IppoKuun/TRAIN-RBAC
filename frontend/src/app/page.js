"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"



export default function Home() {
  const Router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!API_URL) {
      setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
      return
    }
    try {
      setLoading(true)
      const data = { username: username, password: password }
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ data }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })

      const JSONres = await res.json()
      if (!res.ok) {
        setMsg(JSONres.err)
        return
      }
      Router.push("/admin/AdminHome")
    } catch (e) {
      setMsg(`Erreur lors de la connection avec le serveur ${e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-indigo-500 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
            Tableau de bord
          </p>
          <h1 className="text-4xl font-black leading-tight text-white lg:text-5xl">
            Connexion à l’espace admin
          </h1>
          <p className="text-base text-slate-200">
            Gérez les membres, les rôles et les accès. Connectez-vous avec vos identifiants pour continuer.
          </p>
          <div className="mt-auto hidden lg:flex h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-indigo-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/80 text-white font-bold">
              RB
            </div>
            <div>
              <p className="font-semibold">Train-RBAC</p>
              <p className="text-slate-200">Accès sécurisé et audit des permissions</p>
            </div>
          </div>
        </div>

        <div className="flex items-stretch bg-white/5">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-6 border-t border-white/10 bg-white/10 p-8 text-slate-900 backdrop-blur lg:border-l lg:border-t-0 lg:p-10"
          >
            <div>
              <p className="text-sm font-semibold text-indigo-200">Bienvenue</p>
              <p className="text-2xl font-bold text-white">Entrez vos identifiants</p>
            </div>

            {msg && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm font-semibold text-red-50 shadow">
                {msg}
              </div>
            )}

            <label className="flex flex-col gap-2 text-sm font-medium text-white">
              <span>Nom d’utilisateur</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200/40"
                placeholder="admin"
                autoComplete="username"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-white">
              <span>Mot de passe</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200/40"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </label>

            <div className="flex flex-wrap gap-3 text-xs text-slate-100">
              <span className="text-slate-200/80">Remplir automatiquement :</span>
              <button
                type="button"
                onClick={() => {
                  setUsername("admin")
                  setPassword("123456789")
                }}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-500/20"
              >
                Admin (admin / 123456789)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername("viewer")
                  setPassword("123456789")
                }}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-500/20"
              >
                Viewer (viewer / 123456789)
              </button>
            </div>

            <button
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <p className="text-center text-xs text-slate-200/80">
              Accès réservé aux membres autorisés. Vos identifiants sont chiffrés.
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
