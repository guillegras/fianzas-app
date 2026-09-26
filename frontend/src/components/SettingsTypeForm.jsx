const PREDEFINED_COLORS = [
    "#10B981",
    "#059669",
    "#EF4444",
    "#DC2626",
    "#F59E0B",
    "#D97706",
    "#3B82F6",
    "#2563EB",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
];

export default function SettingsTypeForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    editingId,
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="row g-3 mb-4 p-3 bg-secondary bg-opacity-10 rounded"
        >
            <div className="col-md-3">
                <label className="form-label small">Etiqueta</label>
                <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={form.etiqueta}
                    onChange={(e) =>
                        setForm({ ...form, etiqueta: e.target.value })
                    }
                    required
                    placeholder="ej: Ahorro"
                />
            </div>

            <div className="col-md-4">
                <label className="form-label small d-block">
                    Color (Hexadecimal)
                </label>
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary font-monospace text-center"
                        style={{ maxWidth: "110px" }}
                        value={form.color}
                        onChange={(e) =>
                            setForm({ ...form, color: e.target.value })
                        }
                        placeholder="#HEX"
                        required
                    />
                    <div className="d-flex flex-wrap gap-1">
                        {PREDEFINED_COLORS.map((hex) => (
                            <button
                                key={hex}
                                type="button"
                                className="btn p-0 rounded-circle"
                                style={{
                                    width: "22px",
                                    height: "22px",
                                    backgroundColor: hex,
                                    border:
                                        form.color.toLowerCase() ===
                                        hex.toLowerCase()
                                            ? "2px solid #fff"
                                            : "1px solid transparent",
                                    boxShadow:
                                        form.color.toLowerCase() ===
                                        hex.toLowerCase()
                                            ? "0 0 0 2px #3B82F6"
                                            : "none",
                                }}
                                onClick={() => setForm({ ...form, color: hex })}
                                title={hex}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-md-2 d-flex align-items-center pt-4">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="esIngresoCheck"
                        checked={form.es_ingreso}
                        onChange={(e) =>
                            setForm({ ...form, es_ingreso: e.target.checked })
                        }
                    />
                    <label
                        className="form-check-label small"
                        htmlFor="esIngresoCheck"
                    >
                        Es Ingreso
                    </label>
                </div>
            </div>

            <div className="col-md-3 d-flex align-items-end gap-2">
                <button type="submit" className="btn btn-primary w-100">
                    {editingId ? "Actualizar" : "Crear Tipo"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
