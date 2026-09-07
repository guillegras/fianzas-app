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

export default function Dashboard({
    datosDashboard,
    mesGlobal,
    anioGlobal,
    onActualizarPeriodo,
}) {
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const [mesSeleccionado, setMesSeleccionado] = useState(
        mesGlobal || String(hoy.getMonth() + 1).padStart(2, "0"),
    );
    const [anioSeleccionado, setAnioSeleccionado] = useState(
        anioGlobal || String(hoy.getFullYear()),
    );

    const aniosDisponibles = useMemo(() => {
        const lista = [];
        for (let a = anioActual - 5; a <= anioActual + 2; a++)
            lista.push(String(a));
        return lista;
    }, [anioActual]);

    useEffect(() => {
        setMesSeleccionado(mesGlobal);
        setAnioSeleccionado(anioGlobal);
    }, [mesGlobal, anioGlobal]);

    if (!datosDashboard)
        return (
            <div className="text-muted text-center py-5">
                Cargando métricas...
            </div>
        );

    const { kpis, graficos, tablaCategorias } = datosDashboard;
    const nombreMesTexto = MESES[parseInt(mesGlobal, 10) - 1] || "";

    return (
        <div className="dashboard-container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 card bg-dark border-0 p-4 shadow-sm">
                <div>
                    <h4 className="m-0 fw-bold text-light">Resumen General</h4>
                    <span className="text-muted small">
                        Visualizando periodo:{" "}
                        <strong className="text-light text-capitalize">
                            {nombreMesTexto} {anioGlobal}
                        </strong>
                    </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2 bg-black bg-opacity-40 p-2 rounded-3 border border-secondary border-opacity-25 shadow-inner">
                        <select
                            className="form-select form-select-sm bg-transparent text-light border-0 shadow-none fw-medium"
                            style={{ width: "130px", cursor: "pointer" }}
                            value={mesSeleccionado}
                            onChange={(e) => setMesSeleccionado(e.target.value)}
                        >
                            {MESES.map((nombre, index) => {
                                const val = String(index + 1).padStart(2, "0");
                                return (
                                    <option
                                        key={val}
                                        value={val}
                                        style={{
                                            backgroundColor: "#1f2028",
                                            color: "#fff",
                                        }}
                                    >
                                        {nombre}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="text-secondary opacity-50">/</div>
                        <select
                            className="form-select form-select-sm bg-transparent text-light border-0 shadow-none fw-medium"
                            style={{ width: "90px", cursor: "pointer" }}
                            value={anioSeleccionado}
                            onChange={(e) =>
                                setAnioSeleccionado(e.target.value)
                            }
                        >
                            {aniosDisponibles.map((anio) => (
                                <option
                                    key={anio}
                                    value={anio}
                                    style={{
                                        backgroundColor: "#1f2028",
                                        color: "#fff",
                                    }}
                                >
                                    {anio}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="btn btn-sm btn-primary px-3 fw-bold"
                        onClick={() =>
                            onActualizarPeriodo(
                                mesSeleccionado,
                                anioSeleccionado,
                            )
                        }
                    >
                        Buscar
                    </button>
                </div>
            </div>

            <DashboardKPIs kpis={kpis} />
            <DashboardCharts graficos={graficos} />
            <DashboardTable tablaCategorias={tablaCategorias} />
        </div>
    );
}
