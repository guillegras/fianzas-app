import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { configTipos } from "../utils/constants";
import { formatCurrency } from "../utils/transactions";

export default function TransactionList({
    transacciones = [],
    onEliminar,
    eliminando = false,
}) {
    const [idAEliminar, setIdAEliminar] = useState(null);

    const confirmarEliminacion = (id) => {
        setIdAEliminar(id);
    };

    const ejecutarEliminar = () => {
        if (idAEliminar !== null) {
            onEliminar(idAEliminar);
            setIdAEliminar(null);
        }
    };

    return (
        <div className="card bg-dark border-0 shadow-sm p-4">
            <h5 className="mb-4 text-light">Historial de Movimientos</h5>
            <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Descripción</th>
                            <th scope="col" className="text-end">
                                Monto
                            </th>
                            <th scope="col" className="text-end">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map((t) => {
                            const tipoSeguro = t.tipo || "gasto_fijo";
                            const visual = configTipos[tipoSeguro] || {
                                label: tipoSeguro,
                                color: "#6c757d",
                            };
                            const montoSeguro = Number(t.monto) || 0;
                            const esPositivo = tipoSeguro === "ingreso";

                            return (
                                <tr
                                    key={
                                        t.id ??
                                        `${t.fecha}-${t.tipo}-${t.monto}-${t.categoria}`
                                    }
                                >
                                    <td className="text-muted">
                                        {t.fecha || "Sin fecha"}
                                    </td>
                                    <td>
                                        <span
                                            className="badge text-white"
                                            style={{
                                                backgroundColor: visual.color,
                                            }}
                                        >
                                            {visual.label}
                                        </span>
                                    </td>
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
                                        {formatCurrency(montoSeguro)}
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-danger border-0"
                                            onClick={() =>
                                                confirmarEliminacion(t.id)
                                            }
                                            aria-label={`Eliminar ${t.categoria || t.titulo || "movimiento"}`}
                                            title="Eliminar movimiento"
                                            disabled={eliminando}
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
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {transacciones.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center text-muted py-4"
                                >
                                    No hay movimientos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación personalizado */}
            <ConfirmModal
                show={idAEliminar !== null}
                title="Eliminar Movimiento"
                message="¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer."
                onConfirm={ejecutarEliminar}
                onCancel={() => setIdAEliminar(null)}
            />
        </div>
    );
}
