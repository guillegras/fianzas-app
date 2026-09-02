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
    return new Date(anio, mes - 1, dia);
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
        const primerDiaDelMes = new Date(anioVista, mesVista, 1);
        const ultimoDiaDelMes = new Date(anioVista, mesVista + 1, 0);

        let diaInicio = primerDiaDelMes.getDay() - 1;
        if (diaInicio === -1) diaInicio = 6;

        const totalDias = ultimoDiaDelMes.getDate();
        const dias = [];

        const ultimoDiaMesAnterior = new Date(anioVista, mesVista, 0).getDate();
        for (let i = diaInicio - 1; i >= 0; i--) {
            dias.push({
                dia: ultimoDiaMesAnterior - i,
                actualMes: false,
                fechaStr: null,
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
        for (let i = 1; i <= diasRestantes; i++) {
            dias.push({
                dia: i,
                actualMes: false,
                fechaStr: null,
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

    return (
        <div className="position-relative w-100">
            <div
                className="form-control bg-dark text-light border-secondary border-opacity-50 d-flex justify-content-between align-items-center py-2 px-3"
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
            >
                <span className={value ? "text-light" : "text-muted"}>
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
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            </div>

            {isOpen && (
                <div
                    className="position-absolute start-0 mt-2 p-3 bg-dark border border-secondary border-opacity-50 rounded-4 shadow-lg text-light"
                    style={{
                        zIndex: 1050,
                        width: "min(310px, calc(100vw - 2rem))",
                        backgroundColor: "#16181d",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            aria-label="Mes anterior"
                            type="button"
                            className="btn btn-sm btn-outline-secondary border-0 text-light p-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            onClick={() => cambiarMes("prev")}
                        >
                            ❮
                        </button>
                        <span className="fw-bold fs-6 text-capitalize">
                            {MESES[mesVista]} {anioVista}
                        </span>
                        <button
                            aria-label="Mes siguiente"
                            type="button"
                            className="btn btn-sm btn-outline-secondary border-0 text-light p-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            onClick={() => cambiarMes("next")}
                        >
                            ❯
                        </button>
                    </div>

                    <div className="row text-center text-muted small fw-semibold g-0 mb-2">
                        {DIAS_SEMANA.map((d, index) => (
                            <div key={index} className="col">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="row text-center g-1">
                        {diasDelMes.map((item, index) => {
                            const esSeleccionado = item.fechaStr === value;
                            const esHoy =
                                item.fechaStr ===
                                hoyLocal();

                            return (
                                <div
                                    key={index}
                                    className="col p-1 d-flex justify-content-center"
                                >
                                    {item.fechaStr ? (
                                        <button
                                            type="button"
                                            className={`btn btn-sm p-0 d-flex align-items-center justify-content-center fw-medium ${
                                                esSeleccionado
                                                    ? "btn-light text-dark fw-bold shadow"
                                                    : esHoy
                                                      ? "border border-secondary text-light"
                                                      : "btn-dark text-light border-0"
                                            }`}
                                            style={{
                                                width: "34px",
                                                height: "34px",
                                                borderRadius: "50%",
                                                backgroundColor: esSeleccionado
                                                    ? "#f3f4f6"
                                                    : "transparent",
                                            }}
                                            onClick={() => {
                                                onChange(item.fechaStr);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {item.dia}
                                        </button>
                                    ) : (
                                        <span
                                            className="text-muted opacity-25 small d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "34px",
                                                height: "34px",
                                            }}
                                        >
                                            {item.dia}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
