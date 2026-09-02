import { useState } from "react";
import { categoriasPorTipo } from "../utils/constants";
<<<<<<< HEAD
import CustomDatePicker from "./CustomDatePicker";
=======
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476

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
<<<<<<< HEAD
=======
            // Aplicamos trim() para limpiar espacios vacíos accidentales al inicio o final
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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
<<<<<<< HEAD
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
=======
            {/* 1. Fecha */}
            <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input
                    type="date"
                    className="form-control"
                    value={form.fecha}
                    onChange={(e) =>
                        setForm({ ...form, fecha: e.target.value })
                    }
                    required
                />
            </div>

            {/* 2. Tipo */}
            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select
                    className="form-select"
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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

<<<<<<< HEAD
            <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                    className="form-select bg-dark text-light border-secondary border-opacity-50"
=======
            {/* 3. Categoría */}
            <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                    className="form-select"
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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

<<<<<<< HEAD
=======
            {/* 4. Monto */}
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
            <div className="mb-3">
                <label className="form-label">Monto (€)</label>
                <input
                    type="number"
                    min="0.01"
                    step="0.01"
<<<<<<< HEAD
                    className="form-control bg-dark text-light border-secondary border-opacity-50"
=======
                    className="form-control"
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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

<<<<<<< HEAD
=======
            {/* 5. Descripción */}
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
<<<<<<< HEAD
                    className="form-control bg-dark text-light border-secondary border-opacity-50"
=======
                    className="form-control"
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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
