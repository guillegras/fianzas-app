import { lazy, Suspense, useState, useEffect, useMemo } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FiltersPanel from "./components/FiltersPanel";
import { filterTransactions } from "./utils/transactions";
import useTransactions from "./hooks/useTransactions";

const Dashboard = lazy(() => import("./components/Dashboard"));

export default function App() {
    const {
        transacciones,
        estadoCarga,
        error,
        guardando,
        eliminando,
        cargarDatos,
        guardarTransaccion,
        eliminarTransaccion,
    } = useTransactions();
    const [showModal, setShowModal] = useState(false);
    const [vistaActiva, setVistaActiva] = useState("dashboard");

    // Estados del panel lateral y filtros
    const [showFiltros, setShowFiltros] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroMontoMin, setFiltroMontoMin] = useState("");
    const [filtroMontoMax, setFiltroMontoMax] = useState("");
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroAnio, setFiltroAnio] = useState("");
    const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
    const [filtroFechaFin, setFiltroFechaFin] = useState("");
    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowModal(false);
                setShowFiltros(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const limpiarFiltros = () => {
        setFiltroTipo("");
        setFiltroCategoria("");
        setFiltroMontoMin("");
        setFiltroMontoMax("");
        setFiltroMes("");
        setFiltroAnio("");
        setFiltroFechaInicio("");
        setFiltroFechaFin("");
    };

    const transaccionesFiltradas = useMemo(
        () =>
            filterTransactions(transacciones, {
                tipo: filtroTipo,
                categoria: filtroCategoria,
                montoMin: filtroMontoMin,
                montoMax: filtroMontoMax,
                mes: filtroMes,
                anio: filtroAnio,
                fechaInicio: filtroFechaInicio,
                fechaFin: filtroFechaFin,
            }),
        [
            transacciones,
            filtroTipo,
            filtroCategoria,
            filtroMontoMin,
            filtroMontoMax,
            filtroMes,
            filtroAnio,
            filtroFechaInicio,
            filtroFechaFin,
        ],
    );

    const filtros = {
        tipo: filtroTipo,
        categoria: filtroCategoria,
        montoMin: filtroMontoMin,
        montoMax: filtroMontoMax,
        mes: filtroMes,
        anio: filtroAnio,
        fechaInicio: filtroFechaInicio,
        fechaFin: filtroFechaFin,
    };

    const actualizarFiltro = (nombre, valor) => {
        const setters = {
            tipo: setFiltroTipo,
            categoria: setFiltroCategoria,
            montoMin: setFiltroMontoMin,
            montoMax: setFiltroMontoMax,
            mes: setFiltroMes,
            anio: setFiltroAnio,
            fechaInicio: setFiltroFechaInicio,
            fechaFin: setFiltroFechaFin,
        };
        setters[nombre](valor);
    };

    return (
        <div className="container my-5">
            {/* Cabecera Principal */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold mb-0">Gestor Financiero</h1>
                <div className="d-flex gap-3">
                    <button
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        onClick={() => setShowModal(true)}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                        Registrar Movimiento
                    </button>

                    {vistaActiva === "movimientos" && (
                        <button
                            className="btn btn-secondary d-inline-flex align-items-center gap-2"
                            onClick={() => setShowFiltros(true)}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            Filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Navegación por pestañas */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link d-inline-flex align-items-center gap-2 ${vistaActiva === "dashboard" ? "active fw-bold" : "text-muted"}`}
                        onClick={() => setVistaActiva("dashboard")}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        Resumen General
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link d-inline-flex align-items-center gap-2 ${vistaActiva === "movimientos" ? "active fw-bold" : "text-muted"}`}
                        onClick={() => setVistaActiva("movimientos")}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="5" width="6" height="6" rx="1" />
                            <path d="m3 17 2 2 4-4" />
                            <path d="M13 6h8" />
                            <path d="M13 12h8" />
                            <path d="M13 18h8" />
                        </svg>
                        Historial de Movimientos
                    </button>
                </li>
            </ul>

            {/* Vistas */}
            <div className="row">
                <div className="col-12">
                    {estadoCarga === "loading" ? (
                        <div className="alert alert-secondary" role="status">
                            Cargando movimientos...
                        </div>
                    ) : estadoCarga === "error" ? (
                        <div className="alert alert-danger" role="alert">
                            {error}{" "}
                            <button
                                className="btn btn-sm btn-outline-danger ms-2"
                                onClick={() => cargarDatos()}
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : vistaActiva === "dashboard" ? (
                        <Suspense
                            fallback={
                                <div
                                    className="alert alert-secondary"
                                    role="status"
                                >
                                    Cargando resumen...
                                </div>
                            }
                        >
                            <Dashboard transacciones={transacciones} />
                        </Suspense>
                    ) : (
                        <TransactionList
                            transacciones={transaccionesFiltradas}
                            onEliminar={eliminarTransaccion}
                            eliminando={eliminando}
                        />
                    )}
                </div>
            </div>

            <FiltersPanel
                filters={filtros}
                onChange={actualizarFiltro}
                onClear={limpiarFiltros}
                show={showFiltros}
                onClose={() => setShowFiltros(false)}
            />

            {/* Modal de Nueva Transacción */}
            {showModal && (
                <div
                    className="modal d-block"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(4px)",
                    }}
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="transaction-modal-title"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5
                                    id="transaction-modal-title"
                                    className="modal-title fw-bold"
                                >
                                    Registrar Nuevo Movimiento
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Cerrar diálogo"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <TransactionForm
                                    onGuardar={async (transaccion) => {
                                        await guardarTransaccion(transaccion);
                                        setShowModal(false);
                                    }}
                                    guardando={guardando}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
