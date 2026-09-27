import { useState, useRef } from "react";
import { importarTransaccionesCSV } from "../services/api";

export default function ImportCSVModal({ show, onClose, onImportSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    if (!show) return null;

    const handleFileChange = (e) => {
        setError(null);
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.toLowerCase().endsWith(".csv")) {
                setError("Por favor, selecciona un archivo con extensión .csv");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError(null);

        const file = e.dataTransfer?.files?.[0];
        if (file) {
            if (!file.name.toLowerCase().endsWith(".csv")) {
                setError("Por favor, sube un archivo con extensión .csv");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setError(null);

        try {
            const res = await importarTransaccionesCSV(selectedFile);
            onImportSuccess(res);
            onClose();
        } catch (err) {
            setError(err.message || "Error al procesar el archivo CSV.");
        } finally {
            setLoading(false);
        }
    };

    const descargarPlantilla = () => {
        const contenido = "fecha,tipo,categoria,monto,descripcion\n2026-09-27,gasto_fijo,Alquiler,750.00,Alquiler mensual\n2026-09-28,ingreso,Nomina,1800.00,Nomina mes\n2026-09-29,gasto_variable,Supermercado,65.40,Compra semanal\n";
        const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "plantilla_movimientos.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div
            className="modal d-block fade show"
            style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(6px)",
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
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
                    {/* Header */}
                    <div className="modal-header border-bottom border-white border-opacity-10 px-4 pt-4 pb-3">
                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    background: "rgba(59, 130, 246, 0.2)",
                                    color: "#3b82f6",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <h5 className="modal-title fw-bold text-light mb-0 fs-5">
                                Importar Movimientos (CSV)
                            </h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Cerrar"
                            disabled={loading}
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body px-4 py-4 d-flex flex-column gap-3">
                        {error && (
                            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-0" role="alert">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Dropzone */}
                        <div
                            className={`p-4 rounded-3 text-center border border-dashed transition ${
                                dragActive ? "border-primary bg-primary bg-opacity-10" : "border-secondary border-opacity-50"
                            }`}
                            style={{
                                cursor: "pointer",
                                backgroundColor: "rgba(255, 255, 255, 0.02)",
                            }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="d-none"
                                onChange={handleFileChange}
                            />

                            <div className="mb-2">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="12" y1="18" x2="12" y2="12" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                            </div>

                            {selectedFile ? (
                                <div>
                                    <span className="fw-semibold text-light d-block mb-1">
                                        {selectedFile.name}
                                    </span>
                                    <span className="text-muted small">
                                        {(selectedFile.size / 1024).toFixed(1)} KB — Haz clic para cambiar
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <span className="text-light fw-medium d-block mb-1">
                                        Arrastra tu archivo CSV aquí
                                    </span>
                                    <span className="text-muted small">
                                        o haz clic para examinar tu ordenador
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Formato y plantilla */}
                        <div
                            className="p-3 rounded-3"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="small text-muted fw-semibold">
                                    Columnas esperadas:
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-link btn-sm text-primary text-decoration-none p-0 small fw-semibold"
                                    onClick={descargarPlantilla}
                                >
                                    Descargar plantilla CSV
                                </button>
                            </div>
                            <code className="small font-mono text-light d-block">
                                fecha, tipo, categoria, monto, descripcion
                            </code>
                        </div>

                        {/* Botones */}
                        <div className="d-flex gap-2 justify-content-end mt-2">
                            <button
                                type="button"
                                className="btn btn-ghost-glass px-4"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary-glow text-white px-4 fw-semibold d-inline-flex align-items-center gap-2"
                                onClick={handleImport}
                                disabled={!selectedFile || loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" />
                                        <span>Importando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Importar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
