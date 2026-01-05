"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, UserCog, EllipsisVertical, UserPlus } from "lucide-react"
import OptsMenu from "../../components/OptsMenu"
import ConfirmModal from "../../components/ConfirmModal"
import CreateStaffModal from "../../components/CreateStaffModal"




export default function AdminPage(){
    const [cur, setCur] = useState(null)
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState(null)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editDraft, setEditDraft] = useState({ username: "", role: "" })
    const [confirmEditId, setConfirmEditId] = useState(null)
    const [createOpen, setCreateOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const openMenuRef = useRef(null)
    const API_URL = process.env.NEXT_PUBLIC_API_URL

      const Router = useRouter()
    
    const fetchMembers = async () => {
        if (!API_URL) {
            setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
            return
        }
        try{
            setLoading(true)
            const res = await fetch(`${API_URL}/staffRoutes`, { credentials: "include" })
            const data = await res.json()

            if (res.status === 403) {
                setMsg("Vous ne disposez pas des droits.")
                setMembers([])
                return
            }
            if (!res.ok) {
                setMsg(data?.err || "Impossible de récupérer la liste du staff.")
                return
            }
            setMembers(data.doc || [])
        }catch(e){
            setMsg(`Connexion avec le serveur impossible`)
            console.error(e)
        }finally{
            setLoading(false)
        }
    }

    const getUser = async () => {
        if (!API_URL) {
            setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
            return
        }
        try{
            const res = await fetch(`${API_URL}/auth/me`,{credentials:"include"})
            const data = await res.json()

            if (res.status === 403) {
                setMsg("Vous ne disposez pas des droits.")
                Router.push("/")
                return
            }
            if (!data.isAuthenticated){ 
                Router.push("/")
                return
            }
            setCur(data.cur)
        }catch(e){
            setMsg(`Connexion avec le serveur impossible`)  
            console.error(e)
        }
    }

    useEffect(() => {fetchMembers()}, [])
    useEffect(() =>{ getUser()}, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (openMenuRef.current && !openMenuRef.current.contains(event.target)) {
                setOpenMenuId(null)
            }
        }
        if (openMenuId) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("touchstart", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [openMenuId])

    const  handleLogout = async () => {
        if (!API_URL) {
            setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
            return
        }
        try {
            await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials:"include"})
        } catch (e) {
            console.error("Erreur logout", e)
        } finally {
            Router.push("/")
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
            <div className="relative mx-auto flex w-full max-w-5xl flex-col px-6 pb-16 pt-10">

                <header className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Membre du staff</h1>
                        <button
                          type="button"
                          onClick={() => setCreateOpen(true)}
                          className="inline-flex items-center gap-2 ml-100 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
                        >
                            <UserPlus size={18} />
                            Ajouter
                        </button>
                        <button 
                        type="button"
                        className="rounded-full bg-indigo-600 cursor-pointer px-4 py-2 text-sm font-bold text-white"
                        onClick={handleLogout}
                        >
                        Déconnecter
                         <LogOut size={18}/>   
                        </button>
                    </div>
                    {cur ? (
                        <p className="text-sm text-slate-600">
                            Vous êtes <span className="font-semibold text-slate-900">{cur.username}</span> — rôle : <span className="font-semibold text-emerald-600">{cur.role}</span>
                        </p>
                    ) : (
                        <p className="text-sm text-slate-500">Chargement de votre session...</p>
                    )}
                    {msg && (
                        <p className="text-sm font-semibold text-red-600">{msg}</p>
                    )}
                </header>

                <section className="mt-10 grid gap-4 grid-cols-[repeat(auto-fit,_minmax(260px,1fr))]">
                    {loading && (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-slate-500">
                            Chargement de la liste du staff...
                        </div>
                    )}
                    {!loading && members.length === 0 && (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-slate-500">
                            Aucun membre pour le moment.
                        </div>
                    )}
                    {members.length > 0 && members.map((m)=> {
                        const isOpen = openMenuId === m._id
                        const isEditing = editingId === m._id
                        return (
                            <article
                              className="relative rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                              key={m._id}
                              ref={isOpen ? (node) => { openMenuRef.current = node } : null}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-3">
                                                <input
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                                    value={editDraft.username}
                                                    onChange={(e) => setEditDraft((prev) => ({ ...prev, username: e.target.value }))}
                                                />
                                                <select
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                                    value={editDraft.role}
                                                    onChange={(e) => setEditDraft((prev) => ({ ...prev, role: e.target.value }))}
                                                >
                                                    <option value="owner">owner</option>
                                                    <option value="admin">admin</option>
                                                    <option value="viewer">viewer</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-lg font-semibold text-slate-900">{m.username}</h3>
                                                <p className="text-sm text-slate-600">Rôle : <span className="font-semibold text-indigo-600">{m.role}</span></p>
                                            </>
                                        )}
                                    </div>
                                    {!isEditing && (
                                        <button
                                          onClick={() => setOpenMenuId(prev => prev === m._id ? null : m._id)}
                                          type="button"
                                          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                        >
                                            <EllipsisVertical />
                                        </button>
                                    )}
                                </div>
                                {!isEditing && (
                                    <OptsMenu
                                      open={isOpen}
                                      onEdit={() => {
                                        setEditingId(m._id)
                                        setEditDraft({ username: m.username, role: m.role })
                                        setOpenMenuId(null)
                                      }}
                                      onDelete={() => setConfirmDeleteId(m._id)}
                                    />
                                )}
                                {isEditing && (
                                    <div className="mt-4 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                setEditingId(null)
                                                setEditDraft({ username: "", role: "" })
                                            }}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                                            onClick={() => setConfirmEditId(m._id)}
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </section>
            </div>

            <ConfirmModal
              open={Boolean(confirmDeleteId)}
              title="Supprimer ce membre ?"
              message="Êtes-vous sûr de vouloir supprimer ce membre du staff ?"
              confirmLabel="Supprimer"
              confirmVariant="danger"
              onCancel={() => setConfirmDeleteId(null)}
              onConfirm={async () => {
                if (!confirmDeleteId) return
                if (!API_URL) {
                    setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
                    return
                }
                try {
                    const res = await fetch(`${API_URL}/staffRoutes/${confirmDeleteId}`, {
                        method: "DELETE",
                        credentials: "include",
                    })
                    if (res.status === 403) {
                        setMsg("Vous ne disposez pas des droits.")
                        return
                    }
                    if (!res.ok) {
                        const data = await res.json().catch(() => null)
                        setMsg(data?.err || "Impossible de supprimer le membre.")
                        return
                    }
                    await fetchMembers()
                } catch (e) {
                    setMsg("Connexion avec le serveur impossible")
                    console.error(e)
                } finally {
                    setConfirmDeleteId(null)
                }
              }}
            />
            <ConfirmModal
              open={Boolean(confirmEditId)}
              title="Confirmer la modification"
              message="Êtes-vous sûr de vouloir enregistrer ces modifications ?"
              confirmLabel="Enregistrer"
              confirmVariant="primary"
              onCancel={() => setConfirmEditId(null)}
              onConfirm={async () => {
                if (!confirmEditId) return
                if (!API_URL) {
                    setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
                    return
                }
                try {
                    const res = await fetch(`${API_URL}/staffRoutes/${confirmEditId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ data: editDraft }),
                    })
                    if (res.status === 403) {
                        setMsg("Vous ne disposez pas des droits.")
                        return
                    }
                    if (!res.ok) {
                        const data = await res.json().catch(() => null)
                        setMsg(data?.err || "Modification impossible.")
                        return
                    }
                    await fetchMembers()
                } catch (e) {
                    setMsg("Connexion avec le serveur impossible")
                    console.error(e)
                } finally {
                    setConfirmEditId(null)
                    setEditingId(null)
                    setEditDraft({ username: "", role: "" })
                }
              }}
            />
            <CreateStaffModal
              open={createOpen}
              loading={creating}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async (payload) => {
                if (!API_URL) {
                    setMsg("Configuration manquante : NEXT_PUBLIC_API_URL")
                    return
                }
                try {
                    setCreating(true)
                    const res = await fetch(`${API_URL}/staffRoutes`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ data: payload }),
                    })
                    if (res.status === 403) {
                        setMsg("Vous ne disposez pas des droits.")
                        return
                    }
                    if (!res.ok) {
                        const data = await res.json().catch(() => null)
                        setMsg(data?.err || "Impossible de créer le membre.")
                        return
                    }
                    await fetchMembers()
                    setCreateOpen(false)
                } catch (e) {
                    setMsg("Connexion avec le serveur impossible")
                    console.error(e)
                } finally {
                    setCreating(false)
                }
              }}
            />

        </main>
    )
}
