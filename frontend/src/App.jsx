import { lazy, Suspense, useState, useEffect, useMemo } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import FiltersPanel from "./components/FiltersPanel";
import SettingsView from "./components/SettingsView";
import ImportCSVModal from "./components/ImportCSVModal";
import useTransactions from "./hooks/useTransactions";
import { exportarTransaccionesCSV } from "./services/api";

const Dashboard = lazy(() => import("./components/Dashboard"));

export default function App() {
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [vistaActiva, setVistaActiva] = useState("dashboard");
    const [showFiltros, setShowFiltros] = useState(false);
    const [exportandoCSV, setExportandoCSV] = useState(false);
    const [feedback, setFeedback] = useState(null);

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
    const [limite, setLimite] = useState(25);

    const {
        transacciones,
        resumenDashboard,
        totalPaginas,
        totalItems,
        estadoCarga,
        error,
        guardando,
        eliminando,
        cargarDatos,
        guardarTransaccion,
        actualizarTransaccion,
        eliminarTransaccion,
    } = useTransactions();

    useEffect(() => {
        if (vistaActiva !== "ajustes") {
            cargarDatos(filtrosActivos, pagina, vistaActiva, limite);
        }
    }, [filtrosActivos, pagina, vistaActiva, limite, cargarDatos]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowModal(false);
                setShowFiltros(false);
                setShowImportModal(false);
                setEditingTransaction(null);
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

    const handleExportCSV = async () => {
        setExportandoCSV(true);
        try {
            await exportarTransaccionesCSV(filtrosActivos);
            setFeedback({
                type: "success",
                message: "Archivo CSV exportado con éxito.",
            });
            setTimeout(() => setFeedback(null), 3500);
        } catch (err) {
            setFeedback({
                type: "error",
                message: err.message || "Error al exportar los datos a CSV.",
            });
            setTimeout(() => setFeedback(null), 4000);
        } finally {
            setExportandoCSV(false);
        }
    };

    const handleImportSuccess = (resultado) => {
        setFeedback({
            type: "success",
            message: resultado.mensaje || `Se han importado ${resultado.importados} movimientos correctamente.`,
        });
        cargarDatos(filtrosActivos, pagina, vistaActiva, limite);
        setTimeout(() => setFeedback(null), 4000);
    };

    const cambiarLimite = (nuevoLimite) => {
        setLimite(nuevoLimite);
        setPagina(1);
    };

    const handleActualizar = async (transaccionActualizada) => {
        if (!editingTransaction) return;
        try {
            await actualizarTransaccion(editingTransaction.id, transaccionActualizada);
            setEditingTransaction(null);
            setFeedback({
                type: "success",
                message: "Movimiento actualizado con éxito.",
            });
            setTimeout(() => setFeedback(null), 3500);
        } catch {
            // Error feedback is handled by hook
        }
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filtrosActivos.tipo) count++;
        if (filtrosActivos.categoria) count++;
        if (filtrosActivos.montoMin || filtrosActivos.montoMax) count++;
        if (filtrosActivos.fechaInicio || filtrosActivos.fechaFin) count++;
        return count;
    }, [filtrosActivos]);

    return (
        <div className="container py-4 py-md-5">
            {/* Top Navigation & Brand Header */}
            <header className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom border-white border-opacity-10">
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center shadow"
                        style={{
                            width: "44px",
                            height: "44px",
                            background: "linear-gradient(135deg, #2563eb, #10b981)",
                            color: "#fff",
                            boxShadow: "0 0 16px rgba(37, 99, 235, 0.35)",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="h4 fw-bold mb-0 text-light tracking-tight">
                            Gestor Financiero
                        </h1>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {vistaActiva === "movimientos" && (
                        <>
                            <button
                                className="btn btn-ghost-glass d-inline-flex align-items-center gap-2 px-3 py-2 fw-medium rounded-3"
                                onClick={handleExportCSV}
                                disabled={exportandoCSV}
                                title="Descargar todos los movimientos filtrados en un archivo CSV"
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
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span className="d-none d-md-inline">
                                    {exportandoCSV ? "Exportando..." : "Exportar CSV"}
                                </span>
                            </button>

                            <button
                                className="btn btn-ghost-glass d-inline-flex align-items-center gap-2 px-3 py-2 fw-medium rounded-3"
                                onClick={() => setShowImportModal(true)}
                                title="Importar movimientos desde archivo CSV"
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
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span className="d-none d-md-inline">Importar CSV</span>
                            </button>

                            <button
                                className="btn btn-ghost-glass d-inline-flex align-items-center gap-2 px-3 py-2 fw-medium rounded-3 position-relative"
                                onClick={() => setShowFiltros(true)}
                                aria-label="Abrir panel de filtros"
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
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                                <span>Filtros</span>
                                {activeFilterCount > 0 && (
                                    <span
                                        className="badge rounded-pill bg-primary font-mono text-white ms-1"
                                        style={{ fontSize: "0.7rem", padding: "0.25rem 0.45rem" }}
                                    >
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </>
                    )}

                    <button
                        className="btn btn-primary-glow text-white d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3"
                        onClick={() => setShowModal(true)}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Registrar Movimiento</span>
                    </button>
                </div>
            </header>

            {/* Notification / Feedback Banner */}
            {feedback && (
                <div
                    className={`alert alert-${
                        feedback.type === "error" ? "danger" : "success"
                    } alert-dismissible fade show d-flex align-items-center justify-content-between shadow-sm mb-4`}
                    role="alert"
                >
                    <div className="d-flex align-items-center gap-2">
                        <span>{feedback.type === "error" ? "⚠️" : "✅"}</span>
                        <span>{feedback.message}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => setFeedback(null)}
                        aria-label="Cerrar notificación"
                    />
                </div>
            )}

            {/* Modern Segmented Navigation Bar */}
            <div className="d-flex justify-content-start mb-4 overflow-auto pb-1">
                <nav className="nav-pill-container" aria-label="Navegación principal">
                    <button
                        className={`nav-pill-btn ${vistaActiva === "dashboard" ? "active" : ""}`}
                        onClick={() => setVistaActiva("dashboard")}
                        type="button"
                    >
                        <svg
                            width="17"
                            height="17"
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
                        <span>Resumen General</span>
                    </button>

                    <button
                        className={`nav-pill-btn ${vistaActiva === "movimientos" ? "active" : ""}`}
                        onClick={() => setVistaActiva("movimientos")}
                        type="button"
                    >
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>Historial de Movimientos</span>
                    </button>

                    <button
                        className={`nav-pill-btn ${vistaActiva === "ajustes" ? "active" : ""}`}
                        onClick={() => setVistaActiva("ajustes")}
                        type="button"
                    >
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Ajustes</span>
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <main>
                {vistaActiva === "ajustes" ? (
                    <SettingsView />
                ) : estadoCarga === "loading" ? (
                    <div
                        className="glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center gap-3 my-4"
                        role="status"
                    >
                        <div
                            className="spinner-border text-primary"
                            style={{ width: "2.5rem", height: "2.5rem" }}
                            role="status"
                        >
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <span className="text-muted">Cargando información financiera...</span>
                    </div>
                ) : estadoCarga === "error" ? (
                    <div
                        className="glass-card p-4 text-center my-4 border-danger border-opacity-50"
                        role="alert"
                    >
                        <div className="d-flex align-items-center justify-content-center gap-2 text-danger mb-2">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span className="fw-semibold">{error}</span>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={() =>
                                cargarDatos(filtrosActivos, pagina, vistaActiva)
                            }
                        >
                            Reintentar carga
                        </button>
                    </div>
                ) : vistaActiva === "dashboard" ? (
                    <Suspense
                        fallback={
                            <div className="glass-card p-5 text-center text-muted">
                                <div className="spinner-border spinner-border-sm text-primary me-2" />
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
                        onEditar={(t) => setEditingTransaction(t)}
                        eliminando={eliminando}
                        paginaActual={pagina}
                        totalPaginas={totalPaginas}
                        totalItems={totalItems}
                        limite={limite}
                        onCambiarPagina={setPagina}
                        onCambiarLimite={cambiarLimite}
                    />
                )}
            </main>

            {/* Filtros Offcanvas Panel */}
            <FiltersPanel
                filters={filtrosActivos}
                onApply={aplicarFiltros}
                onClear={limpiarFiltros}
                show={showFiltros}
                onClose={() => setShowFiltros(false)}
            />

            {/* Modal para Importar CSV */}
            <ImportCSVModal
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImportSuccess={handleImportSuccess}
            />

            {/* Modal para Registrar Movimiento */}
            {showModal && (
                <div
                    className="modal d-block fade show"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(6px)",
                    }}
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-registro-titulo"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "520px" }}>
                        <div
                            className="modal-content text-light border-0 shadow-2xl"
                            style={{
                                background: "#161b22",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                borderRadius: "18px",
                            }}
                        >
                            <div className="modal-header border-bottom border-white border-opacity-10 px-4 pt-4 pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            background: "rgba(37, 99, 235, 0.2)",
                                            color: "#3b82f6",
                                        }}
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </div>
                                    <h5
                                        id="modal-registro-titulo"
                                        className="modal-title fw-bold text-light mb-0 fs-5"
                                    >
                                        Registrar Movimiento
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Cerrar diálogo"
                                />
                            </div>
                            <div className="modal-body px-4 py-4">
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

            {/* Modal para Modificar Movimiento */}
            {editingTransaction && (
                <div
                    className="modal d-block fade show"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(6px)",
                    }}
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-editar-titulo"
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "520px" }}>
                        <div
                            className="modal-content text-light border-0 shadow-2xl"
                            style={{
                                background: "#161b22",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                borderRadius: "18px",
                            }}
                        >
                            <div className="modal-header border-bottom border-white border-opacity-10 px-4 pt-4 pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            background: "rgba(59, 130, 246, 0.2)",
                                            color: "#60a5fa",
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </div>
                                    <h5
                                        id="modal-editar-titulo"
                                        className="modal-title fw-bold text-light mb-0 fs-5"
                                    >
                                        Modificar Movimiento
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setEditingTransaction(null)}
                                    aria-label="Cerrar diálogo"
                                />
                            </div>
                            <div className="modal-body px-4 py-4">
                                <TransactionForm
                                    initialData={editingTransaction}
                                    onGuardar={handleActualizar}
                                    guardando={guardando}
                                    submitLabel="Guardar Cambios"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
