import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/transactions";
import ConfirmModal from "./ConfirmModal";
import { API_URL } from "../services/api";

export default function TransactionList({
    transacciones = [],
    onEliminar,
    eliminando = false,
    paginaActual,
    totalPaginas,
    onCambiarPagina,
}) {
    const [idAEliminar, setIdAEliminar] = useState(null);
    const [tiposMap, setTiposMap] = useState({});

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const res = await fetch(`${API_URL}/transaction-types/`);
                if (res.ok) {
                    const data = await res.json();
                    const mapa = {};
                    data.forEach((t) => {
                        mapa[t.id] = {
                            label: t.etiqueta,
                            color: t.color,
                            es_ingreso: t.es_ingreso,
                        };
                    });
                    setTiposMap(mapa);
                }
            } catch (err) {
                console.error(
                    "Error cargando colores de tipos en el historial",
                    err,
                );
            }
        };
        fetchTipos();
    }, [API_URL]);

    const confirmarEliminacion = (id) => setIdAEliminar(id);
    const ejecutarEliminar = () => {
        if (idAEliminar !== null) {
            onEliminar(idAEliminar);
            setIdAEliminar(null);
        }
    };

    return (
        <div className="card bg-dark border-0 shadow-sm p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                <h5 className="mb-0 text-light">Historial de Movimientos</h5>
                {totalPaginas > 0 && (
                    <span className="text-muted small" aria-live="polite">
                        Página {paginaActual} de {totalPaginas}
                    </span>
                )}
            </div>
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
                            const visual = tiposMap[t.tipo] || {
                                label: t.tipo,
                                color: "#6c757d",
                                es_ingreso: false,
                            };
                            const montoSeguro = Number(t.monto) || 0;

                            return (
                                <tr
                                    key={
                                        t.id ??
                                        `${t.fecha}-${t.tipo}-${t.monto}-${t.categoria_id}`
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
                                        <div className="d-flex flex-column">
                                            <span>
                                                {t.titulo || "Sin título"}
                                            </span>
                                            <span className="text-muted small fw-normal">
                                                {t.categoria}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="text-muted text-truncate"
                                        style={{ maxWidth: "200px" }}
                                    >
                                        {t.descripcion || "-"}
                                    </td>
                                    <td
                                        className={`font-mono fw-bold text-end ${visual.es_ingreso ? "text-success" : "text-danger"}`}
                                    >
                                        {formatCurrency(montoSeguro)}
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-danger border-0"
                                            onClick={() =>
                                                confirmarEliminacion(t.id)
                                            }
                                            aria-label={`Eliminar ${t.titulo || "movimiento"}`}
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
            {totalPaginas > 1 && (
                <nav
                    className="d-flex justify-content-center align-items-center gap-3 mt-4"
                    aria-label="Paginación de movimientos"
                >
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                            onCambiarPagina((current) =>
                                Math.max(1, current - 1),
                            )
                        }
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </button>
                    <span className="small text-muted" aria-current="page">
                        {paginaActual} / {totalPaginas}
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                            onCambiarPagina((current) =>
                                Math.min(totalPaginas, current + 1),
                            )
                        }
                        disabled={paginaActual === totalPaginas}
                    >
                        Siguiente
                    </button>
                </nav>
            )}
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
