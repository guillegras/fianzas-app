import { useState, useEffect } from "react";
import CustomDatePicker from "./CustomDatePicker";
import { API_URL } from "../services/api";

const getInitialForm = () => ({
    fecha: new Date().toLocaleDateString("en-CA"),
    tipo: "",
    categoria_id: "",
    titulo: "",
    monto: "",
    descripcion: "",
});

export default function TransactionForm({ onGuardar, guardando = false }) {
    const [form, setForm] = useState(getInitialForm);
    const [tiposMovimiento, setTiposMovimiento] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const res = await fetch(`${API_URL}/transaction-types/`);
                if (res.ok) {
                    const data = await res.json();
                    const activos = data.filter((t) => t.activo);
                    setTiposMovimiento(activos);
                    if (activos.length > 0) {
                        setForm((prev) => ({
                            ...prev,
                            tipo: activos[0].id,
                        }));
                    }
                }
            } catch (err) {
                setError("Error cargando tipos de movimiento");
            }
        };
        fetchTipos();
    }, [API_URL]);

    useEffect(() => {
        if (!form.tipo) return;

        const fetchCategorias = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/transaction-categories/${form.tipo}`,
                );
                if (res.ok) {
                    const data = await res.json();
                    const activas = data.filter((c) => c.activa);
                    setCategorias(activas);
                    setForm((prev) => ({
                        ...prev,
                        categoria_id: activas.length > 0 ? activas[0].id : "",
                    }));
                }
            } catch (err) {
                setError("Error cargando categorías");
            }
        };
        fetchCategorias();
    }, [form.tipo, API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.categoria_id) {
            setError("Debes seleccionar una categoría vinculada al tipo.");
            return;
        }

        try {
            const categoriaSeleccionada = categorias.find(
                (c) => c.id === parseInt(form.categoria_id),
            );

            await onGuardar({
                titulo:
                    form.titulo.trim() ||
                    categoriaSeleccionada?.nombre ||
                    "Movimiento",
                monto: parseFloat(form.monto),
                tipo: form.tipo,
                categoria_id: parseInt(form.categoria_id),
                fecha: form.fecha,
                descripcion: form.descripcion.trim(),
            });

            setForm((prev) => ({
                ...getInitialForm(),
                tipo: tiposMovimiento[0]?.id || "",
                categoria_id: categorias[0]?.id || "",
            }));
        } catch {
            setError("Revisa la conexión e inténtalo de nuevo.");
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-busy={guardando}>
            {error && (
                <div className="alert alert-danger py-2" role="alert">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label text-muted small uppercase fw-semibold">
                    Fecha
                </label>
                <CustomDatePicker
                    id="transaction-date"
                    value={form.fecha}
                    onChange={(nuevaFecha) =>
                        setForm({ ...form, fecha: nuevaFecha })
                    }
                />
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="transaction-type" className="form-label">
                        Tipo
                    </label>
                    <select
                        className="form-select bg-dark text-light border-secondary border-opacity-50"
                        id="transaction-type"
                        value={form.tipo}
                        onChange={(e) =>
                            setForm({ ...form, tipo: e.target.value })
                        }
                        required
                    >
                        {tiposMovimiento.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.etiqueta}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label
                        htmlFor="transaction-category"
                        className="form-label"
                    >
                        Categoría
                    </label>
                    <select
                        className="form-select bg-dark text-light border-secondary border-opacity-50"
                        id="transaction-category"
                        value={form.categoria_id}
                        onChange={(e) =>
                            setForm({ ...form, categoria_id: e.target.value })
                        }
                        required
                    >
                        {categorias.length === 0 && (
                            <option value="">Sin categorías...</option>
                        )}
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="transaction-title" className="form-label">
                    Título Personalizado{" "}
                    <span className="text-muted">(Opcional)</span>
                </label>
                <input
                    id="transaction-title"
                    type="text"
                    className="form-control bg-dark text-light border-secondary border-opacity-50"
                    placeholder="Dejar vacío para usar nombre de categoría..."
                    value={form.titulo}
                    onChange={(e) =>
                        setForm({ ...form, titulo: e.target.value })
                    }
                />
            </div>

            <div className="mb-3">
                <label htmlFor="transaction-amount" className="form-label">
                    Monto (€)
                </label>
                <input
                    id="transaction-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control bg-dark text-light border-secondary border-opacity-50"
                    placeholder="0.00"
                    value={form.monto}
                    onKeyDown={(e) => {
                        if (["-", "+", "e", "E"].includes(e.key))
                            e.preventDefault();
                    }}
                    onChange={(e) => {
                        const valor = e.target.value;
                        if (valor === "" || /^\d+(\.\d{0,2})?$/.test(valor)) {
                            setForm({ ...form, monto: valor });
                        }
                    }}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="transaction-description" className="form-label">
                    Descripción
                </label>
                <input
                    id="transaction-description"
                    type="text"
                    className="form-control bg-dark text-light border-secondary border-opacity-50"
                    placeholder="Detalles adicionales..."
                    value={form.descripcion}
                    onChange={(e) =>
                        setForm({ ...form, descripcion: e.target.value })
                    }
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={guardando || categorias.length === 0}
            >
                {guardando ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
}
