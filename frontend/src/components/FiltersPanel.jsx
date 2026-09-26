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
    }, [API_URL]);

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
    }, [draftFilters.tipo, API_URL]);

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
                className={`offcanvas offcanvas-end bg-dark text-light border-secondary ${show ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-hidden={!show}
                style={{ visibility: show ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom border-secondary">
                    <h5 className="offcanvas-title fw-bold">
                        Filtros de Búsqueda
                    </h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    />
                </div>
                <div className="offcanvas-body d-flex flex-column">
                    <div className="flex-grow-1">
                        <div className="mb-3">
                            <label className="form-label text-muted small">
                                Tipo de movimiento
                            </label>
                            <select
                                className="form-select bg-dark text-light border-secondary"
                                value={draftFilters.tipo}
                                onChange={update("tipo")}
                            >
                                <option value="">Todos</option>
                                {tiposMovimiento.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.etiqueta}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted small">
                                Categoría
                            </label>
                            <select
                                className="form-select bg-dark text-light border-secondary"
                                value={draftFilters.categoria_id}
                                onChange={update("categoria_id")}
                                disabled={!draftFilters.tipo}
                            >
                                <option value="">Todas las categorías</option>
                                {categoriasDisponibles.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <span className="form-label text-muted small d-block">
                                Rango de Importe (€)
                            </span>
                            {rangosInvalidos && (
                                <div className="text-danger small mb-2">
                                    El rango indicado no es válido.
                                </div>
                            )}
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control bg-dark text-light border-secondary"
                                    placeholder="Mínimo"
                                    value={draftFilters.montoMin}
                                    onChange={update("montoMin")}
                                />
                                <span className="input-group-text bg-dark text-light border-secondary">
                                    -
                                </span>
                                <input
                                    type="number"
                                    className="form-control bg-dark text-light border-secondary"
                                    placeholder="Máximo"
                                    value={draftFilters.montoMax}
                                    onChange={update("montoMax")}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <span className="form-label text-muted small d-block">
                                Filtro Rápido (Mes y Año)
                            </span>
                            <div className="row g-2">
                                <div className="col-7">
                                    <select
                                        className="form-select form-select-sm bg-dark text-light border-secondary"
                                        value={draftFilters.mes}
                                        onChange={update("mes")}
                                    >
                                        <option value="">Mes (Todos)</option>
                                        {meses.map((mes, index) => (
                                            <option
                                                key={mes}
                                                value={String(
                                                    index + 1,
                                                ).padStart(2, "0")}
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
                                        className="form-control form-control-sm bg-dark text-light border-secondary"
                                        placeholder="Año (Ej: 2026)"
                                        value={draftFilters.anio}
                                        onChange={update("anio")}
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
                                    value={draftFilters.fechaInicio}
                                    onChange={(value) =>
                                        updateDate("fechaInicio", value)
                                    }
                                />
                            </div>
                            <CustomDatePicker
                                id="filter-end-date"
                                value={draftFilters.fechaFin}
                                onChange={(value) =>
                                    updateDate("fechaFin", value)
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <button
                            className="btn btn-primary w-100 mb-2"
                            onClick={() => onApply(draftFilters)}
                            disabled={rangosInvalidos}
                        >
                            Aplicar Filtros
                        </button>
                        <button
                            className="btn btn-outline-danger w-100"
                            onClick={onClear}
                        >
                            Limpiar todos los filtros
                        </button>
                    </div>
                </div>
            </div>
            {show && (
                <div
                    className="offcanvas-backdrop fade show"
                    role="presentation"
                    onClick={onClose}
                />
            )}
        </>
    );
}
