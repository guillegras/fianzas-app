import { useState } from "react";
import { categoriasPorTipo, tiposMovimiento } from "../utils/constants";
import CustomDatePicker from "./CustomDatePicker";

const getInitialForm = () => ({
    fecha: new Date().toLocaleDateString("en-CA"),
    tipo: "ingreso",
    categoria: "Nomina",
    monto: "",
    descripcion: "",
});

export default function TransactionForm({ onGuardar, guardando = false }) {
    const [form, setForm] = useState(getInitialForm);
    const [error, setError] = useState("");

    const handleTipoChange = (e) => {
        const nuevoTipo = e.target.value;
        const primerasCategorias = categoriasPorTipo[nuevoTipo] || [];
        setForm({
            ...form,
            tipo: nuevoTipo,
            categoria: primerasCategorias[0] || "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await onGuardar({
                titulo: form.categoria,
                monto: parseFloat(form.monto),
                tipo: form.tipo,
                categoria: form.categoria,
                fecha: form.fecha,
                descripcion: form.descripcion.trim(),
            });
            setForm(getInitialForm());
        } catch {
            setError("Revisa la conexión e inténtalo de nuevo.");
        }
    };

    const categoriasDisponibles = categoriasPorTipo[form.tipo] || [];

    return (
        <form onSubmit={handleSubmit} aria-busy={guardando}>
            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
            <div className="mb-3">
                <label htmlFor="transaction-date" className="form-label text-muted small uppercase fw-semibold">
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

            <div className="mb-3">
                <label htmlFor="transaction-type" className="form-label">Tipo</label>
                <select
                    className="form-select bg-dark text-light border-secondary border-opacity-50"
                    id="transaction-type"
                    value={form.tipo}
                    onChange={handleTipoChange}
                >
                    {tiposMovimiento.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="transaction-category" className="form-label">Categoría</label>
                <select
                    id="transaction-category"
                    className="form-select bg-dark text-light border-secondary border-opacity-50"
                    value={form.categoria}
                    onChange={(e) =>
                        setForm({ ...form, categoria: e.target.value })
                    }
                    required
                >
                    {categoriasDisponibles.map((cat, i) => (
                        <option key={i} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="transaction-amount" className="form-label">Monto (€)</label>
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
                <label htmlFor="transaction-description" className="form-label">Descripción</label>
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

            <button type="submit" className="btn btn-primary w-100" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
}
