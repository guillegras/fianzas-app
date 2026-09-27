export default function SettingsTypesList({
    types = [],
    selectedTypeId,
    onSelectType,
    onEditType,
    onDeleteType,
    onNewType,
    loading = false,
}) {
    return (
        <div className="glass-card p-4 text-light h-100 d-flex flex-column">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <h5 className="fw-bold m-0 fs-6 text-light">
                        Tipos de Movimiento
                    </h5>
                    <span
                        className="badge rounded-pill bg-white bg-opacity-10 text-muted font-mono px-2 py-1"
                        style={{ fontSize: "0.75rem" }}
                    >
                        {types.length}
                    </span>
                </div>
                <button
                    className="btn btn-primary-glow text-white btn-sm px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 rounded-3"
                    onClick={onNewType}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Nuevo Tipo</span>
                </button>
            </div>

            <p className="text-muted small mb-3" style={{ fontSize: "0.8rem" }}>
                Selecciona un tipo para ver y gestionar sus categorías asociadas.
            </p>

            {loading ? (
                <div className="text-center py-5 text-muted small">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                    Cargando tipos...
                </div>
            ) : types.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <p className="mb-2">No hay tipos definidos.</p>
                    <button className="btn btn-sm btn-primary-glow text-white" onClick={onNewType}>
                        Crear primer tipo
                    </button>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: "600px" }}>
                    {types.map((t) => {
                        const isSelected = t.id === selectedTypeId;
                        return (
                            <div
                                key={t.id}
                                className="p-3 rounded-3 d-flex align-items-center justify-content-between text-start position-relative"
                                style={{
                                    backgroundColor: isSelected
                                        ? "rgba(255, 255, 255, 0.06)"
                                        : "rgba(255, 255, 255, 0.02)",
                                    border: isSelected
                                        ? `1px solid ${t.color}`
                                        : "1px solid rgba(255, 255, 255, 0.07)",
                                    boxShadow: isSelected
                                        ? `0 0 16px ${t.color}28`
                                        : "none",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                }}
                                onClick={() => onSelectType(t.id)}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    {/* Indicador de Color */}
                                    <span
                                        className="rounded-circle d-inline-block flex-shrink-0"
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            backgroundColor: t.color,
                                            boxShadow: `0 0 8px ${t.color}88`,
                                        }}
                                    />
                                    <div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-semibold text-light">
                                                {t.etiqueta}
                                            </span>
                                            {!t.activo && (
                                                <span
                                                    className="badge rounded-pill bg-white bg-opacity-10 text-muted font-mono"
                                                    style={{ fontSize: "0.65rem" }}
                                                >
                                                    Inactivo
                                                </span>
                                            )}
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span
                                                className="badge-pill-custom py-0.5 px-2"
                                                style={{
                                                    fontSize: "0.68rem",
                                                    backgroundColor: t.es_ingreso
                                                        ? "rgba(16, 185, 129, 0.15)"
                                                        : "rgba(239, 68, 68, 0.15)",
                                                    color: t.es_ingreso ? "#34d399" : "#f87171",
                                                    border: `1px solid ${
                                                        t.es_ingreso
                                                            ? "rgba(16, 185, 129, 0.3)"
                                                            : "rgba(239, 68, 68, 0.3)"
                                                    }`,
                                                }}
                                            >
                                                {t.es_ingreso ? "Ingreso" : "Gasto"}
                                            </span>
                                            <span className="text-muted font-mono small" style={{ fontSize: "0.72rem" }}>
                                                {t.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="d-flex align-items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-ghost-glass text-light border-0 p-1 rounded-2"
                                        title="Editar Tipo"
                                        onClick={() => onEditType(t)}
                                        style={{ width: "28px", height: "28px" }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-ghost-glass text-danger border-0 p-1 rounded-2"
                                        title="Eliminar Tipo"
                                        onClick={() => onDeleteType(t)}
                                        style={{ width: "28px", height: "28px" }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
