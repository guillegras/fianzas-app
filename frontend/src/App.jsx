import { lazy, Suspense, useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FiltersPanel from "./components/FiltersPanel";
import useTransactions from "./hooks/useTransactions";

const Dashboard = lazy(() => import("./components/Dashboard"));

export default function App() {
    const [showModal, setShowModal] = useState(false);
    const [vistaActiva, setVistaActiva] = useState("dashboard");
    const [showFiltros, setShowFiltros] = useState(false);

    const fechaActual = new Date();
    const [filtrosActivos, setFiltrosActivos] = useState({
        tipo: "",
        categoria: "",
        montoMin: "",
        montoMax: "",
        mes: String(fechaActual.getMonth() + 1).padStart(2, "0"),
        anio: String(fechaActual.getFullYear()),
        fechaInicio: "",
        fechaFin: "",
    });

    const [pagina, setPagina] = useState(1);

    const {
        transacciones,
        resumenDashboard,
        totalPaginas,
        estadoCarga,
        error,
        guardando,
        eliminando,
        cargarDatos,
        guardarTransaccion,
        eliminarTransaccion,
    } = useTransactions();

    useEffect(() => {
        cargarDatos(filtrosActivos, pagina, vistaActiva);
    }, [filtrosActivos, pagina, vistaActiva, cargarDatos]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowModal(false);
                setShowFiltros(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltrosActivos(nuevosFiltros);
        setPagina(1);
        setShowFiltros(false);
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            tipo: "",
            categoria: "",
            montoMin: "",
            montoMax: "",
            mes: "",
            anio: "",
            fechaInicio: "",
            fechaFin: "",
        };
        setFiltrosActivos(filtrosVacios);
        setPagina(1);
        setShowFiltros(false);
    };

    const actualizarPeriodoDashboard = (mes, anio) => {
        setFiltrosActivos((prev) => ({ ...prev, mes, anio }));
    };

    return (
        <div className="container my-5">
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

            <div className="row">
                <div className="col-12">
                    {estadoCarga === "loading" ? (
                        <div className="alert alert-secondary" role="status">
                            Cargando datos...
                        </div>
                    ) : estadoCarga === "error" ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                            <button
                                className="btn btn-sm btn-outline-danger ms-2"
                                onClick={() =>
                                    cargarDatos(
                                        filtrosActivos,
                                        pagina,
                                        vistaActiva,
                                    )
                                }
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
                            <Dashboard
                                datosDashboard={resumenDashboard}
                                mesGlobal={filtrosActivos.mes}
                                anioGlobal={filtrosActivos.anio}
                                onActualizarPeriodo={actualizarPeriodoDashboard}
                            />
                        </Suspense>
                    ) : (
                        <TransactionList
                            transacciones={transacciones}
                            onEliminar={eliminarTransaccion}
                            eliminando={eliminando}
                            paginaActual={pagina}
                            totalPaginas={totalPaginas}
                            onCambiarPagina={setPagina}
                        />
                    )}
                </div>
            </div>

            <FiltersPanel
                filters={filtrosActivos}
                onApply={aplicarFiltros}
                onClear={limpiarFiltros}
                show={showFiltros}
                onClose={() => setShowFiltros(false)}
            />

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
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">
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
