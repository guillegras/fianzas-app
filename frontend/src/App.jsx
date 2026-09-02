import {
    lazy,
    Suspense,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import api from "./services/api";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import CustomDatePicker from "./components/CustomDatePicker";
import { categoriasPorTipo, tiposMovimiento } from "./utils/constants";
import { filterTransactions } from "./utils/transactions";

const Dashboard = lazy(() => import("./components/Dashboard"));

export default function App() {
    const [transacciones, setTransacciones] = useState([]);
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
    const [estadoCarga, setEstadoCarga] = useState("loading");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const cargarDatos = useCallback(async (signal) => {
        setEstadoCarga("loading");
        setError("");
        try {
            const data = await api.getTransacciones({ signal });
            setTransacciones(data);
            setEstadoCarga("ready");
        } catch (error) {
            if (error.name === "AbortError") return;
            setEstadoCarga("error");
            setError("No se han podido cargar los movimientos.");
            console.error("Error cargando datos:", error);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowModal(false);
                setShowFiltros(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        const controller = new AbortController();
        queueMicrotask(() => cargarDatos(controller.signal));
        return () => {
            controller.abort();
            document.removeEventListener("keydown", handleEscape);
        };
    }, [cargarDatos]);

    const handleGuardarTransaccion = async (nuevaTransaccion) => {
        setGuardando(true);
        setError("");
        try {
            await api.crearTransaccion(nuevaTransaccion);
            setShowModal(false);
            cargarDatos();
        } catch (error) {
            setError("No se ha podido guardar el movimiento.");
            console.error("Error guardando:", error);
            throw error;
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminarTransaccion = async (id) => {
        setEliminando(true);
        setError("");
        try {
            await api.eliminarTransaccion(id);
            cargarDatos();
        } catch (error) {
            setError("No se ha podido eliminar el movimiento.");
            console.error("Error eliminando:", error);
        } finally {
            setEliminando(false);
        }
    };

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

    // Categorías dinámicas basadas en el tipo seleccionado utilizando categoriasPorTipo
    const categoriasDisponibles = filtroTipo
        ? categoriasPorTipo[filtroTipo] || []
        : [];
    const filtrosInvalidos =
        (filtroMontoMin !== "" &&
            filtroMontoMax !== "" &&
            Number(filtroMontoMin) > Number(filtroMontoMax)) ||
        (filtroFechaInicio !== "" &&
            filtroFechaFin !== "" &&
            filtroFechaInicio > filtroFechaFin);

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
                            onEliminar={handleEliminarTransaccion}
                            eliminando={eliminando}
                        />
                    )}
                </div>
            </div>

            {/* Panel Lateral de Filtros (Offcanvas) */}
            <div
                className={`offcanvas offcanvas-end ${showFiltros ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="filters-title"
                aria-hidden={!showFiltros}
                style={{ visibility: showFiltros ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 id="filters-title" className="offcanvas-title fw-bold">
                        Filtros de Búsqueda
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowFiltros(false)}
                        aria-label="Cerrar filtros"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {/* Tipo de Movimiento (Sincronizado con los 5 tipos del formulario) */}
                    <div className="mb-3">
                        <label
                            htmlFor="filter-type"
                            className="form-label text-muted small"
                        >
                            Tipo de movimiento
                        </label>
                        <select
                            id="filter-type"
                            className="form-select"
                            value={filtroTipo}
                            onChange={(e) => {
                                setFiltroTipo(e.target.value);
                                setFiltroCategoria(""); // Reseteamos la categoría al cambiar de tipo
                            }}
                        >
                            <option value="">Todos</option>
                            {tiposMovimiento.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Categoría (Desplegable dinámico según el tipo seleccionado) */}
                    <div className="mb-3">
                        <label
                            htmlFor="filter-category"
                            className="form-label text-muted small"
                        >
                            Categoría
                        </label>
                        <select
                            id="filter-category"
                            className="form-select"
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            disabled={!filtroTipo}
                        >
                            <option value="">Todas las categorías</option>
                            {categoriasDisponibles.map((cat, i) => (
                                <option key={i} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <span className="form-label text-muted small d-block">
                            Rango de Importe (€)
                        </span>
                        {filtrosInvalidos && (
                            <div
                                className="text-danger small mb-2"
                                role="alert"
                            >
                                El rango indicado no es válido.
                            </div>
                        )}
                        <div className="input-group">
                            <input
                                type="number"
                                aria-label="Importe mínimo"
                                className="form-control"
                                placeholder="Mínimo"
                                value={filtroMontoMin}
                                onChange={(e) =>
                                    setFiltroMontoMin(e.target.value)
                                }
                            />
                            <span className="input-group-text">-</span>
                            <input
                                type="number"
                                aria-label="Importe máximo"
                                className="form-control"
                                placeholder="Máximo"
                                value={filtroMontoMax}
                                onChange={(e) =>
                                    setFiltroMontoMax(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Filtro Rápido por Mes y Año */}
                    <div className="mb-3">
                        <span className="form-label text-muted small d-block">
                            Filtro Rápido (Mes y Año)
                        </span>
                        <div className="row g-2">
                            <div className="col-7">
                                <select
                                    aria-label="Mes"
                                    className="form-select form-select-sm"
                                    value={filtroMes}
                                    onChange={(e) =>
                                        setFiltroMes(e.target.value)
                                    }
                                >
                                    <option value="">Mes (Todos)</option>
                                    <option value="01">Enero</option>
                                    <option value="02">Febrero</option>
                                    <option value="03">Marzo</option>
                                    <option value="04">Abril</option>
                                    <option value="05">Mayo</option>
                                    <option value="06">Junio</option>
                                    <option value="07">Julio</option>
                                    <option value="08">Agosto</option>
                                    <option value="09">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>
                            <div className="col-5">
                                <input
                                    type="text"
                                    aria-label="Año"
                                    className="form-control form-control-sm"
                                    placeholder="Año (Ej: 2026)"
                                    value={filtroAnio}
                                    onChange={(e) =>
                                        setFiltroAnio(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <span className="form-label text-muted small d-block">
                            Rango de Fechas Concretas
                        </span>
                        <div className="mb-2">
                            <CustomDatePicker
                                id="filter-start-date"
                                value={filtroFechaInicio}
                                onChange={setFiltroFechaInicio}
                            />
                        </div>
                        <CustomDatePicker
                            id="filter-end-date"
                            value={filtroFechaFin}
                            onChange={setFiltroFechaFin}
                        />
                    </div>

                    <button
                        className="btn btn-outline-danger w-100"
                        onClick={limpiarFiltros}
                    >
                        Limpiar todos los filtros
                    </button>
                </div>
            </div>

            {showFiltros && (
                <div
                    className="offcanvas-backdrop fade show"
                    role="presentation"
                    onClick={() => setShowFiltros(false)}
                ></div>
            )}

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
                                    onGuardar={handleGuardarTransaccion}
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
