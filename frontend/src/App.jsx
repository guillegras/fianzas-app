import { useState, useEffect } from "react";
import api from "./services/api";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import CustomDatePicker from "./components/CustomDatePicker";
import { categoriasPorTipo } from "./utils/constants";

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

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const data = await api.getTransacciones();
            setTransacciones(data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    const handleGuardarTransaccion = async (nuevaTransaccion) => {
        try {
            await api.crearTransaccion(nuevaTransaccion);
            setShowModal(false);
            cargarDatos();
        } catch (error) {
            console.error("Error guardando:", error);
        }
    };

    const handleEliminarTransaccion = async (id) => {
        try {
            await api.eliminarTransaccion(id);
            cargarDatos();
        } catch (error) {
            console.error("Error eliminando:", error);
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

    // Lógica de filtrado en tiempo real
    const transaccionesFiltradas = transacciones.filter((t) => {
        const tipoSeguro = t.tipo || "";
        const categoriaSegura = t.categoria || t.titulo || "";
        const montoSeguro = Number(t.monto) || 0;

        const matchTipo = filtroTipo === "" || tipoSeguro === filtroTipo;
        const matchCategoria =
            filtroCategoria === "" || categoriaSegura === filtroCategoria;
        const matchMontoMin =
            filtroMontoMin === "" || montoSeguro >= Number(filtroMontoMin);
        const matchMontoMax =
            filtroMontoMax === "" || montoSeguro <= Number(filtroMontoMax);

        // Filtro rápido por Mes y Año
        const [anioTx, mesTx] = t.fecha ? t.fecha.split("-") : ["", ""];
        const matchAnio = filtroAnio === "" || anioTx === filtroAnio;
        const matchMes = filtroMes === "" || mesTx === filtroMes;

        // Filtro por rango de fechas concretas
        const matchFechaInicio =
            filtroFechaInicio === "" || t.fecha >= filtroFechaInicio;
        const matchFechaFin =
            filtroFechaFin === "" || t.fecha <= filtroFechaFin;

        return (
            matchTipo &&
            matchCategoria &&
            matchMontoMin &&
            matchMontoMax &&
            matchAnio &&
            matchMes &&
            matchFechaInicio &&
            matchFechaFin
        );
    });

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
                    {vistaActiva === "dashboard" ? (
                        <Dashboard transacciones={transaccionesFiltradas} />
                    ) : (
                        <TransactionList
                            transacciones={transaccionesFiltradas}
                            onEliminar={handleEliminarTransaccion}
                        />
                    )}
                </div>
            </div>

            {/* Panel Lateral de Filtros (Offcanvas) */}
            <div
                className={`offcanvas offcanvas-end ${showFiltros ? "show" : ""}`}
                tabIndex="-1"
                style={{ visibility: showFiltros ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold">
                        Filtros de Búsqueda
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowFiltros(false)}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {/* Tipo de Movimiento (Sincronizado con los 5 tipos del formulario) */}
                    <div className="mb-3">
                        <label className="form-label text-muted small">
                            Tipo de movimiento
                        </label>
                        <select
                            className="form-select"
                            value={filtroTipo}
                            onChange={(e) => {
                                setFiltroTipo(e.target.value);
                                setFiltroCategoria(""); // Reseteamos la categoría al cambiar de tipo
                            }}
                        >
                            <option value="">Todos</option>
                            <option value="ingreso">Ingreso</option>
                            <option value="gasto_fijo">Gasto Fijo</option>
                            <option value="gasto_variable">
                                Gasto Variable
                            </option>
                            <option value="inversion">Inversión</option>
                            <option value="deuda">Deuda</option>
                        </select>
                    </div>

                    {/* Categoría (Desplegable dinámico según el tipo seleccionado) */}
                    <div className="mb-3">
                        <label className="form-label text-muted small">
                            Categoría
                        </label>
                        <select
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
                        <label className="form-label text-muted small">
                            Rango de Importe (€)
                        </label>
                        <div className="input-group">
                            <input
                                type="number"
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
                        <label className="form-label text-muted small">
                            Filtro Rápido (Mes y Año)
                        </label>
                        <div className="row g-2">
                            <div className="col-7">
                                <select
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
                        <label className="form-label text-muted small">
                            Rango de Fechas Concretas
                        </label>
                        <div className="mb-2">
                            <CustomDatePicker
                                value={filtroFechaInicio}
                                onChange={setFiltroFechaInicio}
                            />
                        </div>
                        <CustomDatePicker
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
                                ></button>
                            </div>
                            <div className="modal-body">
                                <TransactionForm
                                    onGuardar={handleGuardarTransaccion}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
