export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 rounded border border-gray-300"
                        onClick={onCancel}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-red-600 text-white"
                        onClick={onConfirm}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}
