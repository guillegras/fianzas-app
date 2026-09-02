import { useEffect, useRef } from "react";

export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
}) {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        if (!show) return undefined;
        cancelButtonRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [show, onCancel]);

    if (!show) return null;

    return (
        <div
            className="modal d-block fade show"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(4px)",
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div className="modal-dialog modal-dialog-centered" onClick={(event) => event.stopPropagation()}>
                <div className="modal-content bg-dark border border-secondary border-opacity-25 shadow-lg text-light p-3">
                    <div className="modal-header border-0 pb-0">
                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="p-2 bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "36px", height: "36px" }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </div>
                            <h5 id="confirm-modal-title" className="modal-title fw-bold fs-5 mb-0">
                                {title || "¿Estás seguro?"}
                            </h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onCancel}
                            aria-label="Cerrar diálogo"
                        ></button>
                    </div>
                    <div className="modal-body py-3 text-muted">
                        <p className="mb-0">
                            {message || "Esta acción no se puede deshacer."}
                        </p>
                    </div>
                    <div className="modal-footer border-0 pt-0 gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            onClick={onCancel}
                            ref={cancelButtonRef}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger px-4"
                            onClick={onConfirm}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
