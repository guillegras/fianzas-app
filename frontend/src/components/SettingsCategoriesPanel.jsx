import { useState } from "react";

export default function SettingsCategoriesPanel({
    selectedType,
    categories = [],
    loading = false,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    savingCategory = false,
}) {
    const [newCatName, setNewCatName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    if (!selectedType) {
        return (
            <div className="glass-card p-5 text-center text-muted h-100 d-flex flex-column align-items-center justify-content-center">
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mb-3 opacity-40"
                >
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
                <h6 className="fw-semibold text-light mb-1">Ningún tipo seleccionado</h6>
                <p className="small mb-0 text-muted">
                    Selecciona un tipo en la columna izquierda para ver y editar sus categorías.
                </p>
            </div>
        );
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        await onAddCategory(newCatName.trim());
        setNewCatName("");
    };

    const handleStartEdit = (cat) => {
        setEditingId(cat.id);
        setEditingName(cat.nombre);
    };

    const handleSaveEdit = async (cat) => {
        if (!editingName.trim()) return;
        await onUpdateCategory(cat.id, {
            nombre: editingName.trim(),
            activa: cat.activa,
            tipo_id: selectedType.id,
        });
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName("");
    };

    const handleToggleActive = async (cat) => {
        setTogglingId(cat.id);
        try {
            await onUpdateCategory(cat.id, {
                nombre: cat.nombre,
                activa: !cat.activa,
                tipo_id: selectedType.id,
            });
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="glass-card p-4 text-light h-100 d-flex flex-column">
            {/* Header del tipo activo */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4 pb-3 border-bottom border-white border-opacity-10">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <span
                            className="rounded-circle d-inline-block"
                            style={{
                                width: "12px",
                                height: "12px",
                                backgroundColor: selectedType.color,
                                boxShadow: `0 0 8px ${selectedType.color}88`,
                            }}
                        />
                        <h5 className="fw-bold m-0 text-light fs-6">
                            Categorías de {selectedType.etiqueta}
                        </h5>
                        <span
                            className="badge rounded-pill bg-white bg-opacity-10 text-muted font-mono px-2 py-1"
                            style={{ fontSize: "0.75rem" }}
                        >
                            {categories.length}
                        </span>
                    </div>
                    <span className="text-muted small" style={{ fontSize: "0.8rem" }}>
                        Gestiona las subcategorías asignadas a{" "}
                        <strong className="text-light">{selectedType.etiqueta}</strong>.
                    </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <span
                        className="badge-pill-custom py-0.5 px-2.5"
                        style={{
                            fontSize: "0.72rem",
                            backgroundColor: selectedType.es_ingreso
                                ? "rgba(16, 185, 129, 0.15)"
                                : "rgba(239, 68, 68, 0.15)",
                            color: selectedType.es_ingreso ? "#34d399" : "#f87171",
                            border: `1px solid ${
                                selectedType.es_ingreso
                                    ? "rgba(16, 185, 129, 0.3)"
                                    : "rgba(239, 68, 68, 0.3)"
                            }`,
                        }}
                    >
                        {selectedType.es_ingreso ? "Suma como Ingreso" : "Resta como Gasto"}
                    </span>
                </div>
            </div>

            {/* Quick Add Bar */}
            <form onSubmit={handleCreate} className="mb-4">
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control glass-input text-light"
                        placeholder={`Nueva categoría para ${selectedType.etiqueta}...`}
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        disabled={savingCategory}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary-glow text-white px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 rounded-3 text-nowrap"
                        disabled={!newCatName.trim() || savingCategory}
                    >
                        {savingCategory ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
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
                        )}
                        <span>Añadir</span>
                    </button>
                </div>
            </form>

            {/* Listado de Categorías */}
            {loading ? (
                <div className="text-center py-5 text-muted small">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                    Cargando categorías...
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-5 text-muted border border-white border-opacity-10 rounded-3 p-4">
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="mb-2 opacity-40"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="mb-1 text-light fw-medium">No hay categorías registradas</p>
                    <p className="small text-muted mb-0">
                        Escribe un nombre arriba y pulsa &quot;Añadir&quot; para crear la primera categoría de este tipo.
                    </p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: "500px" }}>
                    {categories.map((cat) => {
                        const isEditing = editingId === cat.id;
                        return (
                            <div
                                key={cat.id}
                                className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                                    border: "1px solid rgba(255, 255, 255, 0.06)",
                                    opacity: cat.activa ? 1 : 0.6,
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {isEditing ? (
                                    <div className="d-flex align-items-center gap-2 w-100 me-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm glass-input text-light"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSaveEdit(cat);
                                                if (e.key === "Escape") handleCancelEdit();
                                            }}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary-glow text-white px-3"
                                            onClick={() => handleSaveEdit(cat)}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost-glass px-2 text-muted"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center gap-2">
                                            <span
                                                className="rounded-circle d-inline-block"
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    backgroundColor: cat.activa ? selectedType.color : "#64748b",
                                                }}
                                            />
                                            <span
                                                className={`fw-medium ${
                                                    cat.activa ? "text-light" : "text-muted text-decoration-line-through"
                                                }`}
                                            >
                                                {cat.nombre}
                                            </span>
                                            {!cat.activa && (
                                                <span
                                                    className="badge rounded-pill bg-white bg-opacity-10 text-muted font-mono"
                                                    style={{ fontSize: "0.65rem" }}
                                                >
                                                    Inactiva
                                                </span>
                                            )}
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            {/* Toggle Activa/Inactiva */}
                                            <div
                                                className="form-check form-switch m-0"
                                                title={cat.activa ? "Categoría activa" : "Categoría inactiva"}
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={cat.activa}
                                                    disabled={togglingId === cat.id}
                                                    onChange={() => handleToggleActive(cat)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>

                                            {/* Botón Editar */}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost-glass text-light border-0 p-1 rounded-2"
                                                title="Editar nombre"
                                                onClick={() => handleStartEdit(cat)}
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

                                            {/* Botón Borrar */}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost-glass text-danger border-0 p-1 rounded-2"
                                                title="Eliminar categoría"
                                                onClick={() => onDeleteCategory(cat)}
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
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
