<<<<<<< HEAD
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { configTipos } from "../utils/constants";

export default function TransactionList({ transacciones = [], onEliminar }) {
    const [idAEliminar, setIdAEliminar] = useState(null);

    const confirmarEliminacion = (id) => {
        setIdAEliminar(id);
    };

    const ejecutarEliminar = () => {
        if (idAEliminar) {
            onEliminar(idAEliminar);
            setIdAEliminar(null);
=======
import { configTipos } from "../utils/constants";

export default function TransactionList({ transacciones = [], onEliminar }) {
    const handleEliminar = (id) => {
        if (
            window.confirm(
                "¿Seguro que quieres eliminar este movimiento? Esta acción no se puede deshacer.",
            )
        ) {
            onEliminar(id);
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
        }
    };

    return (
<<<<<<< HEAD
        <div className="card bg-dark border-0 shadow-sm p-4">
            <h5 className="mb-4 text-light">Historial de Movimientos</h5>
            <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th className="text-end">Monto</th>
                            <th className="text-end">Acciones</th>
=======
        <div className="card p-0 shadow-sm border-0 bg-dark">
            <div className="table-responsive">
                {/* Cambiado a table-dark para eliminar la franja blanca y hacerla coherente */}
                <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="py-3">Tipo</th>
                            <th className="py-3">Categoría</th>
                            <th className="py-3">Monto</th>
                            <th className="py-3">Descripción</th>
                            <th className="text-center px-4 py-3">Acciones</th>
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map((t) => {
<<<<<<< HEAD
                            const tipoSeguro = t.tipo || "gasto_fijo";
=======
                            const tipoSeguro = t.tipo || "Gasto";
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                            const visual = configTipos[tipoSeguro] || {
                                label: tipoSeguro,
                                color: "#6c757d",
                            };
<<<<<<< HEAD
                            const montoSeguro = Number(t.monto) || 0;
                            const esPositivo =
                                tipoSeguro === "ingreso" ||
                                tipoSeguro === "inversion";

                            return (
                                <tr key={t.id || Math.random()}>
                                    <td className="text-muted">
                                        {t.fecha || "Sin fecha"}
                                    </td>
                                    <td>
                                        <span
                                            className="badge text-white"
                                            style={{
                                                backgroundColor: visual.color,
                                            }}
=======
                            
                            const montoSeguro = Number(t.monto) || 0;

                            return (
                                <tr key={t.id || Math.random()}>
                                    <td className="px-4 text-muted">{t.fecha || "Sin fecha"}</td>
                                    <td>
                                        <span
                                            className="badge text-white"
                                            style={{ backgroundColor: visual.color }}
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                        >
                                            {visual.label}
                                        </span>
                                    </td>
<<<<<<< HEAD
                                    <td className="fw-medium text-light">
                                        {t.categoria ||
                                            t.titulo ||
                                            "Sin título"}
                                    </td>
                                    <td
                                        className="text-muted text-truncate"
                                        style={{ maxWidth: "200px" }}
                                    >
                                        {t.descripcion || "-"}
                                    </td>
                                    <td
                                        className={`font-mono fw-bold text-end ${esPositivo ? "text-success" : "text-danger"}`}
                                    >
                                        {montoSeguro.toFixed(2)} €
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-danger border-0"
                                            onClick={() =>
                                                confirmarEliminacion(t.id)
                                            }
                                            title="Eliminar movimiento"
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 6h18" />
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
=======
                                    <td>
                                        <strong className="text-body">{t.categoria || t.titulo || "Sin título"}</strong>
                                    </td>
                                    <td
                                        className={`font-mono fw-bold ${tipoSeguro === "ingreso" ? "text-success" : "text-danger"}`}
                                    >
                                        {montoSeguro.toFixed(2)} €
                                    </td>
                                    <td className="text-muted small">
                                        {t.descripcion || "-"}
                                    </td>
                                    <td className="text-center px-4">
                                        <button
                                            className="btn btn-sm btn-outline-danger border-0 d-inline-flex align-items-center justify-content-center"
                                            onClick={() => handleEliminar(t.id)}
                                            title="Eliminar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18"></path>
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {transacciones.length === 0 && (
                            <tr>
<<<<<<< HEAD
                                <td
                                    colSpan="6"
                                    className="text-center text-muted py-4"
                                >
                                    No hay movimientos registrados.
=======
                                <td colSpan="6" className="text-center text-muted py-5">
                                    No se encontraron movimientos.
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
<<<<<<< HEAD

            {/* Modal de confirmación personalizado */}
            <ConfirmModal
                show={Boolean(idAEliminar)}
                title="Eliminar Movimiento"
                message="¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer."
                onConfirm={ejecutarEliminar}
                onCancel={() => setIdAEliminar(null)}
            />
        </div>
    );
}
=======
        </div>
    );
}
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
