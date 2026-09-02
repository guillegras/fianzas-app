import { useState } from "react";
import { categoriasPorTipo } from "../utils/constants";
import CustomDatePicker from "./CustomDatePicker";

export default function TransactionForm({ onGuardar }) {
    const [form, setForm] = useState({
        fecha: new Date().toISOString().split("T")[0],
        tipo: "ingreso",
        categoria: "Nomina",
        monto: "",
        descripcion: "",
    });

    const handleTipoChange = (e) => {
        const nuevoTipo = e.target.value;
        const primerasCategorias = categoriasPorTipo[nuevoTipo] || [];
        setForm({
            ...form,
            tipo: nuevoTipo,
            categoria: primerasCategorias[0] || "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardar({
            titulo: form.categoria,
            monto: parseFloat(form.monto),
            tipo: form.tipo,
            categoria: form.categoria,
            fecha: form.fecha,
            descripcion: form.descripcion.trim(),
        });
        setForm({
            fecha: new Date().toISOString().split("T")[0],
            tipo: "ingreso",
            categoria: "Nomina",
            monto: "",
            descripcion: "",
        });
    };

    const categoriasDisponibles = categoriasPorTipo[form.tipo] || [];

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label text-muted small uppercase fw-semibold">
                    Fecha
                </label>
                <CustomDatePicker
                    value={form.fecha}
                    onChange={(nuevaFecha) =>
                        setForm({ ...form, fecha: nuevaFecha })
                    }
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select
                    className="form-select bg-dark text-light border-secondary border-opacity-50"
                    value={form.tipo}
                    onChange={handleTipoChange}
                >
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto_fijo">Gasto Fijo</option>
                    <option value="gasto_variable">Gasto Variable</option>
                    <option value="inversion">Inversión</option>
                    <option value="deuda">Deuda</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
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
                <label className="form-label">Monto (€)</label>
                <input
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
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary border-opacity-50"
                    placeholder="Detalles adicionales..."
                    value={form.descripcion}
                    onChange={(e) =>
                        setForm({ ...form, descripcion: e.target.value })
                    }
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Guardar
            </button>
        </form>
    );
}
