import { useState, useEffect } from "react";
import CustomDatePicker from "./CustomDatePicker";
import { API_URL } from "../services/api";

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export default function FiltersPanel({
    filters,
    onApply,
    onClear,
    show,
    onClose,
}) {
    const [draftFilters, setDraftFilters] = useState(filters);
    const [tiposMovimiento, setTiposMovimiento] = useState([]);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    useEffect(() => {
        if (show) setDraftFilters(filters);
    }, [show, filters]);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const res = await fetch(`${API_URL}/transaction-types/`);
                if (res.ok) {
                    const data = await res.json();
                    setTiposMovimiento(data.filter((t) => t.activo));
                }
            } catch (err) {
                console.error("Error cargando tipos para el filtro", err);
            }
        };
        fetchTipos();
    }, []);

    useEffect(() => {
        if (!draftFilters.tipo) {
            setCategoriasDisponibles([]);
            return;
        }

        const fetchCategorias = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/transaction-categories/${draftFilters.tipo}`,
                );
                if (res.ok) {
                    const data = await res.json();
                    setCategoriasDisponibles(data.filter((c) => c.activa));
                }
            } catch (err) {
                console.error("Error cargando categorías para el filtro", err);
            }
        };
        fetchCategorias();
    }, [draftFilters.tipo]);

    const rangosInvalidos =
        (draftFilters.montoMin !== "" &&
            draftFilters.montoMax !== "" &&
            Number(draftFilters.montoMin) > Number(draftFilters.montoMax)) ||
        (draftFilters.fechaInicio !== "" &&
            draftFilters.fechaFin !== "" &&
            draftFilters.fechaInicio > draftFilters.fechaFin);

    const update = (name) => (event) => {
        const val = event.target.value;
        setDraftFilters((prev) => {
            const updated = { ...prev, [name]: val };
            if (name === "tipo") updated.categoria_id = "";
            return updated;
        });
    };

    const updateDate = (name, value) =>
        setDraftFilters((prev) => ({ ...prev, [name]: value }));

    return (
        <>
            <div
                className={`offcanvas offcanvas-end text-light border-start ${show ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-hidden={!show}
                style={{
                    visibility: show ? "visible" : "hidden",
                    backgroundColor: "#161b22",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    width: "min(380px, 100vw)",
                    boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.5)",
                }}
            >
                {/* Header */}
                <div className="offcanvas-header border-bottom border-white border-opacity-10 px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "rgba(59, 130, 246, 0.15)",
                                color: "#3b82f6",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </div>
                        <h5 className="offcanvas-title fw-bold fs-6 m-0 text-light">
                            Filtros de Búsqueda
                        </h5>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    />
                </div>

                {/* Body */}
                <div className="offcanvas-body d-flex flex-column px-4 py-3 gap-3 overflow-auto">
                    {/* 1. Tipo de Movimiento */}
                    <div>
                        <label className="form-label text-muted small text-uppercase fw-bold mb-1">
                            Tipo de Movimiento
                        </label>
                        <select
                            className="form-select glass-input text-light"
                            value={draftFilters.tipo}
                            onChange={update("tipo")}
                        >
                            <option value="" style={{ backgroundColor: "#161b22" }}>Todos los tipos</option>
                            {tiposMovimiento.map((tipo) => (
                                <option
                                    key={tipo.id}
                                    value={tipo.id}
                                    style={{ backgroundColor: "#161b22" }}
                                >
                                    {tipo.etiqueta}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Categoría */}
                    <div>
                        <label className="form-label text-muted small text-uppercase fw-bold mb-1">
                            Categoría
                        </label>
                        <select
                            className="form-select glass-input text-light"
                            value={draftFilters.categoria_id || ""}
                            onChange={update("categoria_id")}
                            disabled={!draftFilters.tipo}
                        >
                            <option value="" style={{ backgroundColor: "#161b22" }}>
                                {draftFilters.tipo
                                    ? "Todas las categorías"
                                    : "Selecciona un tipo primero"}
                            </option>
                            {categoriasDisponibles.map((cat) => (
                                <option
                                    key={cat.id}
                                    value={cat.id}
                                    style={{ backgroundColor: "#161b22" }}
                                >
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Rango de Importe */}
                    <div>
                        <label className="form-label text-muted small text-uppercase fw-bold mb-1">
                            Rango de Importe (€)
                        </label>
                        {rangosInvalidos && (
                            <div className="text-danger small mb-1">
                                Rango o fechas no válidos.
                            </div>
                        )}
                        <div className="row g-2">
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control glass-input font-mono text-light"
                                    placeholder="Mínimo"
                                    value={draftFilters.montoMin}
                                    onChange={update("montoMin")}
                                />
                            </div>
                            <div className="col-6">
                                <input
                                    type="number"
                                    className="form-control glass-input font-mono text-light"
                                    placeholder="Máximo"
                                    value={draftFilters.montoMax}
                                    onChange={update("montoMax")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-top border-white border-opacity-10 my-1" />

                    {/* 4. Filtro por Mes / Año */}
                    <div>
                        <label className="form-label text-muted small text-uppercase fw-bold mb-1">
                            Filtro Rápido (Mes / Año)
                        </label>
                        <div className="row g-2">
                            <div className="col-7">
                                <select
                                    className="form-select form-select-sm glass-input text-light"
                                    value={draftFilters.mes}
                                    onChange={update("mes")}
                                >
                                    <option value="" style={{ backgroundColor: "#161b22" }}>Mes (Todos)</option>
                                    {meses.map((mes, index) => (
                                        <option
                                            key={mes}
                                            value={String(index + 1).padStart(2, "0")}
                                            style={{ backgroundColor: "#161b22" }}
                                        >
                                            {mes}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-5">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength="4"
                                    className="form-control form-control-sm glass-input font-mono text-light"
                                    placeholder="Año (Ej: 2026)"
                                    value={draftFilters.anio}
                                    onChange={update("anio")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Rango de Fechas Concretas */}
                    <div>
                        <label className="form-label text-muted small text-uppercase fw-bold mb-1">
                            Rango de Fechas
                        </label>
                        <div className="d-flex flex-column gap-2">
                            <div>
                                <span className="text-muted small d-block mb-1">Desde:</span>
                                <CustomDatePicker
                                    id="filter-start-date"
                                    value={draftFilters.fechaInicio}
                                    onChange={(value) => updateDate("fechaInicio", value)}
                                />
                            </div>
                            <div>
                                <span className="text-muted small d-block mb-1">Hasta:</span>
                                <CustomDatePicker
                                    id="filter-end-date"
                                    value={draftFilters.fechaFin}
                                    onChange={(value) => updateDate("fechaFin", value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Pinned Buttons */}
                <div className="border-top border-white border-opacity-10 p-4 d-flex flex-column gap-2 bg-black bg-opacity-20">
                    <button
                        className="btn btn-primary-glow text-white w-100 py-2 fw-semibold rounded-3"
                        onClick={() => onApply(draftFilters)}
                        disabled={rangosInvalidos}
                    >
                        Aplicar Filtros
                    </button>
                    <button
                        className="btn btn-ghost-glass w-100 py-2 text-muted fw-medium rounded-3"
                        onClick={onClear}
                    >
                        Limpiar todos los filtros
                    </button>
                </div>
            </div>

            {show && (
                <div
                    className="offcanvas-backdrop fade show"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(4px)",
                    }}
                    role="presentation"
                    onClick={onClose}
                />
            )}
        </>
    );
}
