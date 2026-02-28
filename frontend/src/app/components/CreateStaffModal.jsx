import { useState } from "react"

export default function CreateStaffModal({ open, loading, onCancel, onSubmit }) {
    const initialForm = {
        username: "",
        email: "",
        role: "viewer",
        password: "",
    }
    const [form, setForm] = useState({
        username: "",
        email: "",
        role: "viewer",
        password: "",
    })

    if (!open) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form)
        setForm(initialForm)
    }

    const handleCancel = () => {
        setForm(initialForm)
        onCancel()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900">Ajouter un membre</h3>
                <p className="mt-1 text-sm text-slate-600">Renseigne les informations du nouveau membre.</p>
                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-700">Username</label>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={form.username}
                            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-700">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-700">Rôle</label>
                        <select
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={form.role}
                            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                        >
                            <option value="owner">owner</option>
                            <option value="admin">admin</option>
                            <option value="viewer">viewer</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-slate-700">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={form.password}
                            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                            placeholder="Mot de passe du compte"
                            required
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Ajout..." : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
