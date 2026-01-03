export default function OptsMenu({ open, onEdit, onDelete }) {
    if (!open) return null
    return (
        <ul className="absolute z-4 rounded-xl bg-white border rounded shadow">
            <li className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={onEdit}>Modifier</li>
            <li className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={onDelete}>Supprimer</li>
        </ul>
    )
}
