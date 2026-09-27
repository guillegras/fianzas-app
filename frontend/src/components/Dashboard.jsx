import { useState, useMemo, useEffect } from "react";
import DashboardKPIs from "./DashboardKPIs";
import DashboardCharts from "./DashboardCharts";
import DashboardTable from "./DashboardTable";

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

const parseMes = (val) => {
    const n = parseInt(val, 10);
    return !isNaN(n) && n >= 1 && n <= 12
        ? String(n).padStart(2, "0")
        : String(new Date().getMonth() + 1).padStart(2, "0");
};

const parseAnio = (val) => {
    const n = parseInt(val, 10);
    return !isNaN(n) && n >= 1900 && n <= 2100
        ? String(n)
        : String(new Date().getFullYear());
};

export default function Dashboard({
    datosDashboard,
    mesGlobal,
    anioGlobal,
    onActualizarPeriodo,
}) {
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const [mesSeleccionado, setMesSeleccionado] = useState(() =>
        parseMes(mesGlobal),
    );
    const [anioSeleccionado, setAnioSeleccionado] = useState(() =>
        parseAnio(anioGlobal),
    );

    const aniosDisponibles = useMemo(() => {
        const lista = [];
        for (let a = anioActual - 5; a <= anioActual + 2; a++) {
            lista.push(String(a));
        }
        return lista;
    }, [anioActual]);

    useEffect(() => {
        if (mesGlobal) setMesSeleccionado(parseMes(mesGlobal));
        if (anioGlobal) setAnioSeleccionado(parseAnio(anioGlobal));
    }, [mesGlobal, anioGlobal]);

    if (!datosDashboard) {
        return (
            <div className="glass-card p-5 text-center text-muted">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                Cargando métricas...
            </div>
        );
    }

    const { kpis, graficos, tablaCategorias } = datosDashboard;
    const mesNum = parseInt(parseMes(mesGlobal || mesSeleccionado), 10);
    const nombreMesTexto = MESES[mesNum - 1] || "";
    const anioTexto = parseAnio(anioGlobal || anioSeleccionado);

    const cambiarMesRelativo = (offset) => {
        let m = parseInt(parseMes(mesSeleccionado), 10) + offset;
        let a = parseInt(parseAnio(anioSeleccionado), 10);
        if (m < 1) {
            m = 12;
            a -= 1;
        } else if (m > 12) {
            m = 1;
            a += 1;
        }
        const nuevoMes = String(m).padStart(2, "0");
        const nuevoAnio = String(a);
        setMesSeleccionado(nuevoMes);
        setAnioSeleccionado(nuevoAnio);
        onActualizarPeriodo(nuevoMes, nuevoAnio);
    };

    const handleMesChange = (nuevoMes) => {
        const m = parseMes(nuevoMes);
        setMesSeleccionado(m);
        onActualizarPeriodo(m, parseAnio(anioSeleccionado));
    };

    const handleAnioChange = (nuevoAnio) => {
        const a = parseAnio(nuevoAnio);
        setAnioSeleccionado(a);
        onActualizarPeriodo(parseMes(mesSeleccionado), a);
    };

    return (
        <div className="d-flex flex-column gap-3">
            {/* Toolbar Minimalista de Periodo */}
            <div className="glass-card px-4 py-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="m-0 fw-bold text-light text-capitalize">
                        {nombreMesTexto} {anioTexto}
                    </h4>

                    {/* Controles de Periodo */}
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-ghost-glass btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            title="Mes anterior"
                            onClick={() => cambiarMesRelativo(-1)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        <div className="d-flex align-items-center gap-1 bg-black bg-opacity-40 p-1 rounded-3 border border-white border-opacity-10">
                            <select
                                className="form-select form-select-sm bg-transparent text-light border-0 shadow-none fw-medium py-1 ps-2 pe-4"
                                style={{ width: "128px", cursor: "pointer" }}
                                value={mesSeleccionado}
                                onChange={(e) => handleMesChange(e.target.value)}
                            >
                                {MESES.map((nombre, index) => {
                                    const val = String(index + 1).padStart(2, "0");
                                    return (
                                        <option key={val} value={val} style={{ backgroundColor: "#161b22", color: "#f0f6fc" }}>
                                            {nombre}
                                        </option>
                                    );
                                })}
                            </select>

                            <span className="text-white opacity-20">/</span>

                            <select
                                className="form-select form-select-sm bg-transparent text-light border-0 shadow-none fw-medium py-1 ps-2 pe-4"
                                style={{ width: "86px", cursor: "pointer" }}
                                value={anioSeleccionado}
                                onChange={(e) => handleAnioChange(e.target.value)}
                            >
                                {aniosDisponibles.map((anio) => (
                                    <option key={anio} value={anio} style={{ backgroundColor: "#161b22", color: "#f0f6fc" }}>
                                        {anio}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="btn btn-ghost-glass btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                            title="Mes siguiente"
                            onClick={() => cambiarMesRelativo(1)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <DashboardKPIs kpis={kpis} />
            <DashboardCharts
                graficos={graficos}
                kpis={kpis}
                tablaCategorias={tablaCategorias}
            />
            <DashboardTable tablaCategorias={tablaCategorias} />
        </div>
    );
}
