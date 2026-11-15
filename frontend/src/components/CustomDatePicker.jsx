import { useState, useMemo, useEffect } from "react";

const MESES = [
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

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

const fechaLocal = (value) => {
    if (!value) return new Date();
    const [anio, mes, dia] = value.split("-").map(Number);
    return new Date(anio, mes - 1, dia, 12, 0, 0);
};

const hoyLocal = () => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
};

export default function CustomDatePicker({ id, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const fechaActual = fechaLocal(value);
    const [mesVista, setMesVista] = useState(fechaActual.getMonth());
    const [anioVista, setAnioVista] = useState(fechaActual.getFullYear());

    useEffect(() => {
        const fecha = fechaLocal(value);
        queueMicrotask(() => {
            setMesVista(fecha.getMonth());
            setAnioVista(fecha.getFullYear());
        });
    }, [value]);

    const diasDelMes = useMemo(() => {
        const primerDiaDelMes = new Date(anioVista, mesVista, 1, 12, 0, 0);
        const ultimoDiaDelMes = new Date(anioVista, mesVista + 1, 0, 12, 0, 0);

        let diaInicio = primerDiaDelMes.getDay() - 1;
        if (diaInicio === -1) diaInicio = 6;

        const totalDias = ultimoDiaDelMes.getDate();
        const dias = [];

        const ultimoDiaMesAnterior = new Date(anioVista, mesVista, 0, 12, 0, 0).getDate();
        const prevMes = mesVista === 0 ? 11 : mesVista - 1;
        const prevAnio = mesVista === 0 ? anioVista - 1 : anioVista;
        const prevMesStr = String(prevMes + 1).padStart(2, "0");

        for (let i = diaInicio - 1; i >= 0; i--) {
            const d = ultimoDiaMesAnterior - i;
            const diaStr = String(d).padStart(2, "0");
            dias.push({
                dia: d,
                actualMes: false,
                fechaStr: `${prevAnio}-${prevMesStr}-${diaStr}`,
            });
        }

        for (let i = 1; i <= totalDias; i++) {
            const mesStr = String(mesVista + 1).padStart(2, "0");
            const diaStr = String(i).padStart(2, "0");
            dias.push({
                dia: i,
                actualMes: true,
                fechaStr: `${anioVista}-${mesStr}-${diaStr}`,
            });
        }

        const totalCeldas = Math.ceil(dias.length / 7) * 7;
        const diasRestantes = totalCeldas - dias.length;
        const nextMes = mesVista === 11 ? 0 : mesVista + 1;
        const nextAnio = mesVista === 11 ? anioVista + 1 : anioVista;
        const nextMesStr = String(nextMes + 1).padStart(2, "0");

        for (let i = 1; i <= diasRestantes; i++) {
            const diaStr = String(i).padStart(2, "0");
            dias.push({
                dia: i,
                actualMes: false,
                fechaStr: `${nextAnio}-${nextMesStr}-${diaStr}`,
            });
        }

        return dias;
    }, [mesVista, anioVista]);

    const cambiarMes = (direccion) => {
        if (direccion === "prev") {
            if (mesVista === 0) {
                setMesVista(11);
                setAnioVista(anioVista - 1);
            } else {
                setMesVista(mesVista - 1);
            }
        } else {
            if (mesVista === 11) {
                setMesVista(0);
                setAnioVista(anioVista + 1);
            } else {
                setMesVista(mesVista + 1);
            }
        }
    };

    const fechaFormateadaVisual = useMemo(() => {
        if (!value) return "Seleccionar fecha";
        const [anio, mes, dia] = value.split("-");
        return `${dia} de ${MESES[parseInt(mes, 10) - 1]} de ${anio}`;
    }, [value]);

    const seleccionarHoy = () => {
        const hoy = hoyLocal();
        onChange(hoy);
        setIsOpen(false);
    };

    return (
        <div className="position-relative w-100">
            <div
                className="form-control glass-input d-flex justify-content-between align-items-center py-2 px-3"
                id={id}
                role="button"
                tabIndex="0"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-label={fechaFormateadaVisual}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsOpen((open) => !open);
                    }
                }}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer" }}
            >
                <span className={value ? "text-light fw-medium" : "text-muted"}>
                    {fechaFormateadaVisual}
                </span>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </div>

            {isOpen && (
                <>
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 1040 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="position-absolute start-0 mt-2 p-3 rounded-4 shadow-2xl text-light"
                        style={{
                            zIndex: 1050,
                            width: "min(320px, calc(100vw - 2rem))",
                            backgroundColor: "#161b22",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button
                                aria-label="Mes anterior"
                                type="button"
                                className="btn btn-ghost-glass btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => cambiarMes("prev")}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <span className="fw-bold small text-light text-capitalize">
                                {MESES[mesVista]} {anioVista}
                            </span>
                            <button
                                aria-label="Mes siguiente"
                                type="button"
                                className="btn btn-ghost-glass btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px" }}
                                onClick={() => cambiarMes("next")}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 1fr)",
                                textAlign: "center",
                                marginBottom: "0.5rem",
                            }}
                            className="text-muted small fw-semibold"
                        >
                            {DIAS_SEMANA.map((d, index) => (
                                <div key={index} className="font-mono py-1" style={{ fontSize: "0.75rem" }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 1fr)",
                                gap: "4px 2px",
                                textAlign: "center",
                                marginBottom: "0.5rem",
                            }}
                        >
                            {diasDelMes.map((item, index) => {
                                const esSeleccionado = item.fechaStr === value;
                                const esHoy = item.fechaStr === hoyLocal();

                                return (
                                    <div
                                        key={index}
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-sm p-0 d-flex align-items-center justify-content-center font-mono small fw-medium"
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                backgroundColor: esSeleccionado
                                                    ? "#3b82f6"
                                                    : esHoy
                                                      ? "rgba(59, 130, 246, 0.15)"
                                                      : "transparent",
                                                color: esSeleccionado
                                                    ? "#ffffff"
                                                    : esHoy
                                                      ? "#60a5fa"
                                                      : item.actualMes
                                                        ? "#f0f6fc"
                                                        : "rgba(240, 246, 252, 0.4)",
                                                border: esHoy && !esSeleccionado
                                                    ? "1px solid rgba(59, 130, 246, 0.4)"
                                                    : "1px solid transparent",
                                                boxShadow: esSeleccionado
                                                    ? "0 0 12px rgba(59, 130, 246, 0.5)"
                                                    : "none",
                                                opacity: !item.actualMes && !esSeleccionado ? 0.45 : 1,
                                            }}
                                            onClick={() => {
                                                onChange(item.fechaStr);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {item.dia}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-white border-opacity-10">
                            <button
                                type="button"
                                className="btn btn-link btn-sm text-decoration-none text-muted small p-0"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                            >
                                Borrar
                            </button>
                            <button
                                type="button"
                                className="btn btn-link btn-sm text-decoration-none text-primary small fw-semibold p-0"
                                onClick={seleccionarHoy}
                            >
                                Hoy
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
