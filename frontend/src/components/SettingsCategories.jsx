import { useState, useEffect } from "react";
import { API_URL } from "../services/api";

export default function SettingsCategories({ types }) {
    const [categories, setCategories] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ nombre: "", activa: true });

    useEffect(() => {
        if (types.length > 0 && !selectedType) {
            setSelectedType(types[0].id);
        }
    }, [types, selectedType]);

    useEffect(() => {
        if (!selectedType) return;

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/transaction-categories/${selectedType}`,
                );
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [selectedType, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `${API_URL}/transaction-categories/${editingId}`
                : `${API_URL}/transaction-categories/`;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, tipo_id: selectedType }),
            });

            if (!res.ok) throw new Error("Error guardando categoría");

            setForm({ nombre: "", activa: true });
            setEditingId(null);

            const refreshRes = await fetch(
                `${API_URL}/transaction-categories/${selectedType}`,
            );
            if (refreshRes.ok) setCategories(await refreshRes.json());
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ nombre: cat.nombre, activa: cat.activa });
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta categoría?")) return;
        try {
            await fetch(`${API_URL}/transaction-categories/${id}`, {
                method: "DELETE",
            });
            setCategories(categories.filter((c) => c.id !== id));
        } catch (err) {
            alert("Error eliminando categoría");
        }
    };

    return (
        <div className="card bg-dark border-0 shadow-sm p-4 text-light">
            <h5 className="mb-4">Configuración de Categorías</h5>

            <div className="mb-4">
                <label className="form-label text-muted">
                    Gestionar categorías para el tipo:
                </label>
                <select
                    className="form-select bg-dark text-light border-secondary"
                    value={selectedType}
                    onChange={(e) => {
                        setSelectedType(e.target.value);
                        setEditingId(null);
                        setForm({ nombre: "", activa: true });
                    }}
                >
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.etiqueta}
                        </option>
                    ))}
                </select>
            </div>

            <form
                onSubmit={handleSubmit}
                className="row g-3 align-items-end mb-4"
            >
                <div className="col-md-6">
                    <label className="form-label">Nombre de Categoría</label>
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        value={form.nombre}
                        onChange={(e) =>
                            setForm({ ...form, nombre: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="col-md-3">
                    <div className="form-check form-switch pb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.activa}
                            onChange={(e) =>
                                setForm({ ...form, activa: e.target.checked })
                            }
                        />
                        <label className="form-check-label">Activa</label>
                    </div>
                </div>
                <div className="col-md-3 d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={!selectedType}
                    >
                        {editingId ? "Actualizar" : "Crear"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary w-100"
                            onClick={() => {
                                setEditingId(null);
                                setForm({ nombre: "", activa: true });
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0 border-secondary">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    Cargando...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="text-center text-muted"
                                >
                                    No hay categorías.
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>{cat.nombre}</td>
                                    <td>
                                        <span
                                            className={`badge ${cat.activa ? "bg-success" : "bg-danger"}`}
                                        >
                                            {cat.activa ? "Activa" : "Inactiva"}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => handleEdit(cat)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
