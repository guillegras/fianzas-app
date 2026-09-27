import { useState, useEffect } from "react";

const PALETTE = [
    "#10B981", // Emerald
    "#059669", // Dark green
    "#14B8A6", // Teal
    "#06B6D4", // Cyan
    "#3B82F6", // Blue
    "#2563EB", // Royal Blue
    "#6366F1", // Indigo
    "#8B5CF6", // Violet
    "#A855F7", // Purple
    "#EC4899", // Pink
    "#F43F5E", // Rose
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#F97316", // Orange
    "#64748B", // Slate
    "#475569", // Dark Slate
];

export default function SettingsTypeModal({
    show,
    onClose,
    onSave,
    initialData = null,
    saving = false,
}) {
    const [etiqueta, setEtiqueta] = useState("");
    const [color, setColor] = useState("#3B82F6");
    const [esIngreso, setEsIngreso] = useState(false);
    const [activo, setActivo] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setEtiqueta(initialData.etiqueta || "");
            setColor(initialData.color || "#3B82F6");
            setEsIngreso(Boolean(initialData.es_ingreso));
            setActivo(initialData.activo !== undefined ? Boolean(initialData.activo) : true);
        } else {
            setEtiqueta("");
            setColor("#3B82F6");
            setEsIngreso(false);
            setActivo(true);
        }
        setError("");
    }, [initialData, show]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!etiqueta.trim()) {
            setError("El nombre del tipo es obligatorio.");
            return;
        }
        setError("");
        try {
            await onSave({
                etiqueta: etiqueta.trim(),
                color,
                es_ingreso: esIngreso,
                activo,
            });
            onClose();
        } catch (err) {
            setError(err.message || "Error al guardar el tipo.");
        }
    };

    return (
        <div
            className="modal d-block fade show"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: "520px" }}
                onClick={(e) => e.stopPropagation()}
            >
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
                                    background: `${color}22`,
                                    color: color,
                                    border: `1px solid ${color}44`,
                                }}
                            >
                                <span
                                    className="rounded-circle"
                                    style={{ width: "10px", height: "10px", backgroundColor: color }}
                                />
                            </div>
                            <h5 className="modal-title fw-bold text-light mb-0 fs-5">
                                {initialData ? "Editar Tipo de Movimiento" : "Nuevo Tipo de Movimiento"}
                            </h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Cerrar modal"
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4 py-3">
                            {error && (
                                <div className="alert alert-danger py-2 small mb-3" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Nombre del Tipo */}
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold text-uppercase mb-1">
                                    Nombre / Etiqueta
                                </label>
                                <input
                                    type="text"
                                    className="form-control glass-input text-light"
                                    placeholder="ej: Suscripciones, Ocio, Ahorro..."
                                    value={etiqueta}
                                    onChange={(e) => setEtiqueta(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            {/* Naturaleza: Ingreso vs Gasto con nav-pill */}
                            <div className="mb-3">
                                <label className="form-label text-muted small fw-semibold text-uppercase mb-1 d-block">
                                    Naturaleza del Movimiento
                                </label>
                                <div className="nav-pill-container p-1 w-100" style={{ gap: "4px" }}>
                                    <button
                                        type="button"
                                        className={`nav-pill-btn flex-fill justify-content-center ${
                                            !esIngreso ? "active" : ""
                                        }`}
                                        style={{
                                            color: !esIngreso ? "#f87171" : undefined,
                                        }}
                                        onClick={() => setEsIngreso(false)}
                                    >
                                        📉 Gasto / Salida
                                    </button>
                                    <button
                                        type="button"
                                        className={`nav-pill-btn flex-fill justify-content-center ${
                                            esIngreso ? "active" : ""
                                        }`}
                                        style={{
                                            color: esIngreso ? "#34d399" : undefined,
                                        }}
                                        onClick={() => setEsIngreso(true)}
                                    >
                                        📈 Ingreso
                                    </button>
                                </div>
                                <span className="text-muted d-block mt-1.5" style={{ fontSize: "0.78rem" }}>
                                    {esIngreso
                                        ? "Suma a los ingresos y balance total del periodo."
                                        : "Resta de tu balance como salida o consumo de dinero."}
                                </span>
                            </div>

                            {/* Paleta de Color */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label text-muted small fw-semibold text-uppercase mb-0">
                                        Color Identificativo
                                    </label>
                                    <div className="d-flex align-items-center gap-2">
                                        <span
                                            className="rounded-circle border border-white border-opacity-25"
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                backgroundColor: color,
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm glass-input font-mono text-center py-0"
                                            style={{ width: "90px" }}
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            placeholder="#HEX"
                                        />
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap gap-2 p-2 rounded-3 bg-black bg-opacity-30 border border-white border-opacity-10">
                                    {PALETTE.map((hex) => {
                                        const isSelected = color.toLowerCase() === hex.toLowerCase();
                                        return (
                                            <button
                                                key={hex}
                                                type="button"
                                                className="btn p-0 rounded-circle position-relative"
                                                style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    backgroundColor: hex,
                                                    border: isSelected
                                                        ? "2px solid #ffffff"
                                                        : "2px solid transparent",
                                                    boxShadow: isSelected
                                                        ? `0 0 10px ${hex}`
                                                        : "none",
                                                    transition: "transform 0.15s ease",
                                                    transform: isSelected ? "scale(1.15)" : "scale(1)",
                                                }}
                                                onClick={() => setColor(hex)}
                                                title={hex}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Estado Activo */}
                            <div className="form-check form-switch pt-1">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="modalTipoActivo"
                                    checked={activo}
                                    onChange={(e) => setActivo(e.target.checked)}
                                    style={{ cursor: "pointer" }}
                                />
                                <label className="form-check-label small text-muted ms-1" htmlFor="modalTipoActivo">
                                    Tipo activo (disponible al registrar nuevos movimientos)
                                </label>
                            </div>
                        </div>

                        <div className="modal-footer border-top border-white border-opacity-10 px-4 py-3 gap-2">
                            <button
                                type="button"
                                className="btn btn-ghost-glass px-4 py-2 rounded-3 text-light"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary-glow text-white px-4 py-2 fw-semibold rounded-3"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" />
                                        <span>Guardando...</span>
                                    </>
                                ) : initialData ? (
                                    "Actualizar Tipo"
                                ) : (
                                    "Crear Tipo"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
