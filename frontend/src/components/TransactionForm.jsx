import { useState, useEffect } from "react";
import CustomDatePicker from "./CustomDatePicker";
import { API_URL } from "../services/api";

const getInitialForm = (initialData = null) => {
    if (initialData) {
        return {
            fecha: initialData.fecha ? String(initialData.fecha).slice(0, 10) : new Date().toLocaleDateString("en-CA"),
            tipo: initialData.tipo || "",
            categoria_id: initialData.categoria_id ? String(initialData.categoria_id) : "",
            monto: initialData.monto !== undefined && initialData.monto !== null ? String(initialData.monto) : "",
            descripcion: initialData.descripcion || "",
        };
    }
    return {
        fecha: new Date().toLocaleDateString("en-CA"),
        tipo: "",
        categoria_id: "",
        monto: "",
        descripcion: "",
    };
};

export default function TransactionForm({
    onGuardar,
    guardando = false,
    initialData = null,
    submitLabel = null,
}) {
    const [form, setForm] = useState(() => getInitialForm(initialData));
    const [tiposMovimiento, setTiposMovimiento] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setForm(getInitialForm(initialData));
        }
    }, [initialData]);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const res = await fetch(`${API_URL}/transaction-types/`);
                if (res.ok) {
                    const data = await res.json();
                    const activos = data.filter((t) => t.activo);
                    setTiposMovimiento(activos);
                    setForm((prev) => {
                        if (prev.tipo) return prev;
                        return {
                            ...prev,
                            tipo: activos.length > 0 ? activos[0].id : "",
                        };
                    });
                }
            } catch {
                setError("Error cargando tipos de movimiento");
            }
        };
        fetchTipos();
    }, []);

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
                    setForm((prev) => {
                        const currentId = parseInt(prev.categoria_id);
                        const exists = activas.some((c) => c.id === currentId);
                        return {
                            ...prev,
                            categoria_id: exists
                                ? prev.categoria_id
                                : (activas.length > 0 ? String(activas[0].id) : ""),
                        };
                    });
                }
            } catch {
                setError("Error cargando categorías");
            }
        };
        fetchCategorias();
    }, [form.tipo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.categoria_id) {
            setError("Debes seleccionar una categoría para continuar.");
            return;
        }

        try {
            const categoriaSeleccionada = categorias.find(
                (c) => c.id === parseInt(form.categoria_id),
            );

            await onGuardar({
                titulo: categoriaSeleccionada?.nombre || "Movimiento",
                monto: parseFloat(form.monto),
                tipo: form.tipo,
                categoria_id: parseInt(form.categoria_id),
                fecha: form.fecha,
                descripcion: form.descripcion.trim(),
            });

            if (!initialData) {
                setForm((prev) => ({
                    ...getInitialForm(null),
                    tipo: tiposMovimiento[0]?.id || "",
                    categoria_id: categorias[0]?.id ? String(categorias[0].id) : "",
                }));
            }
        } catch {
            setError("Revisa la conexión e inténtalo de nuevo.");
        }
    };

    return (
        <form onSubmit={handleSubmit} aria-busy={guardando} className="d-flex flex-column gap-3">
            {error && (
                <div
                    className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-0"
                    role="alert"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Fecha */}
            <div>
                <label className="form-label text-muted small text-uppercase fw-bold mb-1">
                    Fecha del Movimiento
                </label>
                <CustomDatePicker
                    id="transaction-date"
                    value={form.fecha}
                    onChange={(nuevaFecha) => setForm({ ...form, fecha: nuevaFecha })}
                />
            </div>

            {/* Tipo y Categoría en 2 columnas */}
            <div className="row g-3">
                <div className="col-12 col-sm-6">
                    <label htmlFor="transaction-type" className="form-label text-muted small text-uppercase fw-bold mb-1">
                        Tipo
                    </label>
                    <select
                        className="form-select glass-input text-light"
                        id="transaction-type"
                        value={form.tipo}
                        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                        required
                    >
                        {tiposMovimiento.map((tipo) => (
                            <option
                                key={tipo.id}
                                value={tipo.id}
                                style={{ backgroundColor: "#161b22" }}
                            >
                                {tipo.etiqueta}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-sm-6">
                    <label htmlFor="transaction-category" className="form-label text-muted small text-uppercase fw-bold mb-1">
                        Categoría
                    </label>
                    <select
                        className="form-select glass-input text-light"
                        id="transaction-category"
                        value={form.categoria_id}
                        onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                        required
                    >
                        {categorias.length === 0 && (
                            <option value="" style={{ backgroundColor: "#161b22" }}>
                                Sin categorías disponibles
                            </option>
                        )}
                        {categorias.map((cat) => (
                            <option
                                key={cat.id}
                                value={cat.id}
                                style={{ backgroundColor: "#161b22" }}
                            >
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Monto (€) */}
            <div>
                <label htmlFor="transaction-amount" className="form-label text-muted small text-uppercase fw-bold mb-1">
                    Importe (€)
                </label>
                <div className="position-relative">
                    <span
                        className="position-absolute top-50 translate-middle-y text-muted fw-bold user-select-none"
                        style={{
                            left: "14px",
                            pointerEvents: "none",
                            fontSize: "1.1rem",
                        }}
                    >
                        €
                    </span>
                    <input
                        id="transaction-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="form-control glass-input font-mono fw-bold fs-5 text-light"
                        style={{ paddingLeft: "40px" }}
                        placeholder="0.00"
                        value={form.monto}
                        onKeyDown={(e) => {
                            if (["-", "+", "e", "E"].includes(e.key)) {
                                e.preventDefault();
                            }
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
            </div>

            {/* Descripción */}
            <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="transaction-description" className="form-label text-muted small text-uppercase fw-bold mb-0">
                        Notas o detalles
                    </label>
                    <span className="text-muted small">Opcional</span>
                </div>
                <input
                    id="transaction-description"
                    type="text"
                    className="form-control glass-input text-light"
                    placeholder="Detalles adicionales del movimiento..."
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
            </div>

            {/* Submit CTA */}
            <button
                type="submit"
                className="btn btn-primary-glow text-white w-100 py-2 mt-2 fw-semibold rounded-3 d-inline-flex align-items-center justify-content-center gap-2"
                disabled={guardando || categorias.length === 0}
            >
                {guardando ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" />
                        <span>{initialData ? "Guardando cambios..." : "Guardando movimiento..."}</span>
                    </>
                ) : (
                    <>
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{submitLabel || (initialData ? "Guardar Cambios" : "Guardar Movimiento")}</span>
                    </>
                )}
            </button>
        </form>
    );
}
