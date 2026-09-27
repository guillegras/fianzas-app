import { useEffect, useState } from "react";
import { formatCurrency } from "../utils/transactions";
import ConfirmModal from "./ConfirmModal";
import { API_URL } from "../services/api";

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Sin fecha";
    const partes = String(fechaStr).split("-");
    if (partes.length === 3) {
        const [anio, mes, dia] = partes;
        return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${anio}`;
    }
    return fechaStr;
};

export default function TransactionList({
    transacciones = [],
    onEliminar,
    onEditar,
    eliminando = false,
    paginaActual = 1,
    totalPaginas = 1,
    totalItems = 0,
    limite = 25,
    onCambiarPagina,
    onCambiarLimite,
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
                console.error("Error cargando colores de tipos en el historial", err);
            }
        };
        fetchTipos();
    }, []);

    const confirmarEliminacion = (id) => setIdAEliminar(id);
    const ejecutarEliminar = () => {
        if (idAEliminar !== null) {
            onEliminar(idAEliminar);
            setIdAEliminar(null);
        }
    };

    const inicio = totalItems === 0 ? 0 : (paginaActual - 1) * limite + 1;
    const fin = Math.min(paginaActual * limite, totalItems);

    const generarNumerosPagina = () => {
        if (totalPaginas <= 7) {
            return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        }
        const pages = [];
        if (paginaActual <= 4) {
            pages.push(1, 2, 3, 4, 5, "...", totalPaginas);
        } else if (paginaActual >= totalPaginas - 3) {
            pages.push(1, "...", totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas);
        } else {
            pages.push(1, "...", paginaActual - 1, paginaActual, paginaActual + 1, "...", totalPaginas);
        }
        return pages;
    };

    return (
        <div className="glass-card p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                    <h5 className="mb-0 fw-bold text-light fs-6">
                        Movimientos
                    </h5>
                    {totalItems > 0 && (
                        <span
                            className="badge rounded-pill bg-white bg-opacity-10 text-muted font-mono px-2 py-1"
                            style={{ fontSize: "0.75rem" }}
                        >
                            {totalItems} {totalItems === 1 ? "movimiento" : "movimientos"}
                        </span>
                    )}
                </div>

                {/* Controles de página en cabecera: Anterior / Siguiente */}
                {totalPaginas > 1 && (
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small font-mono d-none d-sm-inline">
                            Pág. <strong className="text-light">{paginaActual}</strong> de {totalPaginas}
                        </span>

                        <div className="d-flex align-items-center gap-1">
                            <button
                                type="button"
                                className="btn btn-ghost-glass btn-sm rounded-2 d-flex align-items-center justify-content-center p-0"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => onCambiarPagina((current) => Math.max(1, current - 1))}
                                disabled={paginaActual <= 1}
                                title="Página anterior"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            <span className="small text-muted font-mono px-1 d-sm-none">
                                {paginaActual} / {totalPaginas}
                            </span>

                            <button
                                type="button"
                                className="btn btn-ghost-glass btn-sm rounded-2 d-flex align-items-center justify-content-center p-0"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => onCambiarPagina((current) => Math.min(totalPaginas, current + 1))}
                                disabled={paginaActual >= totalPaginas}
                                title="Página siguiente"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="table-responsive">
                <table className="modern-table align-middle mb-0">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: "125px" }} className="text-nowrap">Fecha</th>
                            <th scope="col" style={{ width: "135px" }} className="text-nowrap">Tipo</th>
                            <th scope="col">Categoría</th>
                            <th scope="col">Descripción</th>
                            <th scope="col" className="text-end text-nowrap" style={{ width: "130px" }}>Monto</th>
                            <th scope="col" className="text-end" style={{ width: "80px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map((t) => {
                            const visual = tiposMap[t.tipo] || {
                                label: t.tipo,
                                color: "#8b949e",
                                es_ingreso: false,
                            };
                            const montoSeguro = Number(t.monto) || 0;

                            return (
                                <tr key={t.id ?? `${t.fecha}-${t.tipo}-${t.monto}-${t.categoria_id}`}>
                                    <td className="text-muted small font-mono text-nowrap">
                                        <div className="d-flex align-items-center gap-2">
                                            <svg
                                                width="13"
                                                height="13"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="text-muted opacity-75 flex-shrink-0"
                                            >
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <span>{formatearFecha(t.fecha)}</span>
                                        </div>
                                    </td>
                                    <td className="text-nowrap">
                                        <span
                                            className="badge-pill-custom text-nowrap"
                                            style={{
                                                backgroundColor: `${visual.color}1a`,
                                                color: visual.color,
                                                border: `1px solid ${visual.color}38`,
                                                fontSize: "0.72rem",
                                                padding: "2px 8px",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {visual.label}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="fw-semibold text-light">
                                            {t.categoria || t.titulo || "Sin categoría"}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="text-muted small text-truncate d-inline-block"
                                            style={{ maxWidth: "240px" }}
                                            title={t.descripcion || ""}
                                        >
                                            {t.descripcion || "—"}
                                        </span>
                                    </td>
                                    <td className="text-end text-nowrap">
                                        <span
                                            className={`font-mono fw-bold fs-6 ${
                                                visual.es_ingreso ? "text-success" : "text-danger"
                                            }`}
                                        >
                                            {visual.es_ingreso ? "+" : "-"}
                                            {formatCurrency(montoSeguro)}
                                        </span>
                                    </td>
                                    <td className="text-end text-nowrap">
                                        <div className="d-inline-flex align-items-center gap-1">
                                            <button
                                                className="btn btn-sm btn-ghost-glass text-light border-0 p-1 rounded-2"
                                                onClick={() => onEditar && onEditar(t)}
                                                aria-label={`Editar ${t.categoria || "movimiento"}`}
                                                title="Modificar movimiento"
                                                style={{ transition: "all 0.15s ease" }}
                                            >
                                                <svg
                                                    width="15"
                                                    height="15"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost-glass text-danger border-0 p-1 rounded-2"
                                                onClick={() => confirmarEliminacion(t.id)}
                                                aria-label={`Eliminar ${t.categoria || "movimiento"}`}
                                                title="Eliminar movimiento"
                                                disabled={eliminando}
                                                style={{
                                                    transition: "all 0.15s ease",
                                                }}
                                            >
                                                <svg
                                                    width="15"
                                                    height="15"
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
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {transacciones.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-5">
                                    <div className="d-flex flex-column align-items-center gap-2">
                                        <svg
                                            width="36"
                                            height="36"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            className="opacity-50"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="8" y1="12" x2="16" y2="12" />
                                        </svg>
                                        <span>No hay movimientos registrados que coincidan con la búsqueda.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 && (
                <div
                    className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 pt-4 border-top border-white border-opacity-10 mt-3"
                    aria-label="Paginación de movimientos"
                >
                    {/* Selector de filas e indicador de rango */}
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted small" style={{ fontSize: "0.8rem" }}>Filas:</span>
                            <div className="nav-pill-container" style={{ padding: "3px", gap: "2px" }}>
                                {[25, 50, 100].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`nav-pill-btn font-mono py-0.5 px-2 ${
                                            limite === size ? "active" : ""
                                        }`}
                                        style={{ fontSize: "0.75rem", minHeight: "auto", borderRadius: "6px" }}
                                        onClick={() => onCambiarLimite && onCambiarLimite(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <span className="text-white opacity-20 d-none d-sm-inline">|</span>

                        <span className="text-muted small font-mono">
                            <strong className="text-light fw-semibold">{inicio}–{fin}</strong>
                            <span className="mx-1">de</span>
                            <strong className="text-light fw-semibold">{totalItems}</strong>
                        </span>
                    </div>

                    {totalPaginas > 1 && (
                        <nav className="d-flex align-items-center gap-1" aria-label="Navegación de páginas">
                            <button
                                type="button"
                                className="btn btn-ghost-glass btn-sm rounded-2 d-flex align-items-center justify-content-center p-0"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => onCambiarPagina((current) => Math.max(1, current - 1))}
                                disabled={paginaActual <= 1}
                                title="Página anterior"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            <div className="d-flex align-items-center gap-1">
                                {generarNumerosPagina().map((p, idx) => {
                                    if (p === "...") {
                                        return (
                                            <span
                                                key={`ellipsis-${idx}`}
                                                className="text-muted px-1 small font-mono user-select-none"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    const isActive = p === paginaActual;
                                    return (
                                        <button
                                            key={`page-${p}`}
                                            type="button"
                                            className={`btn btn-sm font-mono p-0 rounded-2 d-flex align-items-center justify-content-center ${
                                                isActive
                                                    ? "btn-primary-glow text-white fw-bold shadow-sm"
                                                    : "btn-ghost-glass text-muted"
                                            }`}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                fontSize: "0.82rem",
                                                border: isActive ? "1px solid rgba(255, 255, 255, 0.2)" : undefined,
                                            }}
                                            onClick={() => onCambiarPagina(p)}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                className="btn btn-ghost-glass btn-sm rounded-2 d-flex align-items-center justify-content-center p-0"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => onCambiarPagina((current) => Math.min(totalPaginas, current + 1))}
                                disabled={paginaActual >= totalPaginas}
                                title="Página siguiente"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </nav>
                    )}
                </div>
            )}

            <ConfirmModal
                show={idAEliminar !== null}
                title="Eliminar Movimiento"
                message="¿Estás seguro de que quieres eliminar este registro? Esta acción es irreversible."
                onConfirm={ejecutarEliminar}
                onCancel={() => setIdAEliminar(null)}
            />
        </div>
    );
}
