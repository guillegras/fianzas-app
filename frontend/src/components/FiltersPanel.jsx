import CustomDatePicker from "./CustomDatePicker";
import { categoriasPorTipo, tiposMovimiento } from "../utils/constants";

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
    onChange,
    onClear,
    show,
    onClose,
}) {
    const categoriasDisponibles = filters.tipo
        ? categoriasPorTipo[filters.tipo] || []
        : [];
    const rangosInvalidos =
        (filters.montoMin !== "" &&
            filters.montoMax !== "" &&
            Number(filters.montoMin) > Number(filters.montoMax)) ||
        (filters.fechaInicio !== "" &&
            filters.fechaFin !== "" &&
            filters.fechaInicio > filters.fechaFin);

    const update = (name) => (event) => onChange(name, event.target.value);

    return (
        <>
            <div
                className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="filters-title"
                aria-hidden={!show}
                style={{ visibility: show ? "visible" : "hidden" }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 id="filters-title" className="offcanvas-title fw-bold">
                        Filtros de Búsqueda
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    />
                </div>
                <div className="offcanvas-body">
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
                            value={filters.tipo}
                            onChange={(event) => {
                                onChange("tipo", event.target.value);
                                onChange("categoria", "");
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
                            value={filters.categoria}
                            onChange={update("categoria")}
                            disabled={!filters.tipo}
                        >
                            <option value="">Todas las categorías</option>
                            {categoriasDisponibles.map((categoria) => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <span className="form-label text-muted small d-block">
                            Rango de Importe (€)
                        </span>
                        {rangosInvalidos && (
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
                                value={filters.montoMin}
                                onChange={update("montoMin")}
                            />
                            <span className="input-group-text">-</span>
                            <input
                                type="number"
                                aria-label="Importe máximo"
                                className="form-control"
                                placeholder="Máximo"
                                value={filters.montoMax}
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
                                    aria-label="Mes"
                                    className="form-select form-select-sm"
                                    value={filters.mes}
                                    onChange={update("mes")}
                                >
                                    <option value="">Mes (Todos)</option>
                                    {meses.map((mes, index) => (
                                        <option
                                            key={mes}
                                            value={String(index + 1).padStart(
                                                2,
                                                "0",
                                            )}
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
                                    aria-label="Año"
                                    className="form-control form-control-sm"
                                    placeholder="Año (Ej: 2026)"
                                    value={filters.anio}
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
                                value={filters.fechaInicio}
                                onChange={(value) =>
                                    onChange("fechaInicio", value)
                                }
                            />
                        </div>
                        <CustomDatePicker
                            id="filter-end-date"
                            value={filters.fechaFin}
                            onChange={(value) => onChange("fechaFin", value)}
                        />
                    </div>

                    <button
                        className="btn btn-outline-danger w-100"
                        onClick={onClear}
                    >
                        Limpiar todos los filtros
                    </button>
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
