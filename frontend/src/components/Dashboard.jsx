import { useState, useMemo } from "react";
import DashboardKPIs from "./DashboardKPIs";
import DashboardCharts from "./DashboardCharts";
import DashboardTable from "./DashboardTable";

const MESES = [
<<<<<<< HEAD
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

export default function Dashboard({ transacciones = [] }) {
=======
    { valor: "01", nombre: "Enero" },
    { valor: "02", nombre: "Febrero" },
    { valor: "03", nombre: "Marzo" },
    { valor: "04", nombre: "Abril" },
    { valor: "05", nombre: "Mayo" },
    { valor: "06", nombre: "Junio" },
    { valor: "07", nombre: "Julio" },
    { valor: "08", nombre: "Agosto" },
    { valor: "09", nombre: "Septiembre" },
    { valor: "10", nombre: "Octubre" },
    { valor: "11", nombre: "Noviembre" },
    { valor: "12", nombre: "Diciembre" },
];

export default function Dashboard({ transacciones }) {
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
    const hoy = new Date();
    const [mesSeleccionado, setMesSeleccionado] = useState(
        String(hoy.getMonth() + 1).padStart(2, "0"),
    );
    const [anioSeleccionado, setAnioSeleccionado] = useState(
        String(hoy.getFullYear()),
    );

    const aniosDisponibles = useMemo(() => {
        const anioActual = hoy.getFullYear();
        const lista = [];
        for (let a = anioActual - 5; a <= anioActual + 2; a++)
            lista.push(String(a));
        return lista;
    }, []);

    const periodoActual = `${anioSeleccionado}-${mesSeleccionado}`;
    const periodoAnterior = useMemo(() => {
        let mes = parseInt(mesSeleccionado, 10) - 1;
        let anio = parseInt(anioSeleccionado, 10);
        if (mes === 0) {
            mes = 12;
            anio -= 1;
        }
        return `${anio}-${String(mes).padStart(2, "0")}`;
    }, [mesSeleccionado, anioSeleccionado]);

    const transaccionesMes = useMemo(
<<<<<<< HEAD
        () =>
            transacciones.filter(
                (t) => t.fecha && t.fecha.startsWith(periodoActual),
            ),
        [transacciones, periodoActual],
    );
    const transaccionesAnterior = useMemo(
        () =>
            transacciones.filter(
                (t) => t.fecha && t.fecha.startsWith(periodoAnterior),
            ),
=======
        () => transacciones.filter((t) => t.fecha.startsWith(periodoActual)),
        [transacciones, periodoActual],
    );
    const transaccionesAnterior = useMemo(
        () => transacciones.filter((t) => t.fecha.startsWith(periodoAnterior)),
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
        [transacciones, periodoAnterior],
    );

    const ingresos = transaccionesMes
        .filter((t) => t.tipo === "ingreso")
<<<<<<< HEAD
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const gastos = transaccionesMes
        .filter((t) => t.tipo !== "ingreso")
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const tablaCategorias = useMemo(() => {
        const mapa = {};
        transaccionesMes.forEach((t) => {
            const cat = t.categoria || t.titulo || "Sin categoría";
            if (!mapa[cat])
                mapa[cat] = { tipo: t.tipo, actual: 0, anterior: 0 };
            mapa[cat].actual += Number(t.monto) || 0;
        });
        transaccionesAnterior.forEach((t) => {
            const cat = t.categoria || t.titulo || "Sin categoría";
            if (!mapa[cat])
                mapa[cat] = { tipo: t.tipo, actual: 0, anterior: 0 };
            mapa[cat].anterior += Number(t.monto) || 0;
        });
        return Object.entries(mapa)
            .map(([categoria, data]) => ({
                categoria,
                tipo: data.tipo,
                actual: data.actual,
                anterior: data.anterior,
                diferencia: data.actual - data.anterior,
            }))
            .sort((a, b) => b.actual - a.actual);
    }, [transaccionesMes, transaccionesAnterior]);

    const nombreMesTexto = MESES[parseInt(mesSeleccionado, 10) - 1];

    return (
        <div className="dashboard-container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 card bg-dark border-0 p-4 shadow-sm">
                <div>
                    <h4 className="m-0 fw-bold text-light">Resumen General</h4>
                    <span className="text-muted small">
                        Visualizando periodo:{" "}
                        <strong className="text-light text-capitalize">
                            {nombreMesTexto} {anioSeleccionado}
                        </strong>
                    </span>
                </div>

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
                        onChange={(e) => setAnioSeleccionado(e.target.value)}
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
            </div>

            <DashboardKPIs transaccionesMes={transaccionesMes} />
=======
        .reduce((acc, t) => acc + t.monto, 0);
    const gastos = transaccionesMes
        .filter((t) => t.tipo !== "ingreso")
        .reduce((acc, t) => acc + t.monto, 0);
    const balance = ingresos - gastos;

    const tablaCategorias = useMemo(() => {
        const mapa = {};
        transaccionesMes.forEach((t) => {
            if (!mapa[t.categoria])
                mapa[t.categoria] = { tipo: t.tipo, actual: 0, anterior: 0 };
            mapa[t.categoria].actual += t.monto;
        });
        transaccionesAnterior.forEach((t) => {
            if (!mapa[t.categoria])
                mapa[t.categoria] = { tipo: t.tipo, actual: 0, anterior: 0 };
            mapa[t.categoria].anterior += t.monto;
        });
        return Object.entries(mapa)
            .map(([categoria, data]) => ({
                categoria,
                tipo: data.tipo,
                actual: data.actual,
                anterior: data.anterior,
                diferencia: data.actual - data.anterior,
            }))
            .sort((a, b) => b.actual - a.actual);
    }, [transaccionesMes, transaccionesAnterior]);

    const nombreMesTexto = MESES.find(
        (m) => m.valor === mesSeleccionado,
    )?.nombre;

    return (
        <div className="dashboard-container">
            {/* Selector de Periodo */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-body-tertiary p-3 rounded shadow-sm">
                <h4 className="m-0 text-capitalize">
                    Resumen de {nombreMesTexto} {anioSeleccionado}
                </h4>
                <div className="d-flex align-items-center gap-2">
                    <select
                        className="form-select form-select-sm w-auto"
                        value={mesSeleccionado}
                        onChange={(e) => setMesSeleccionado(e.target.value)}
                    >
                        {MESES.map((m) => (
                            <option key={m.valor} value={m.valor}>
                                {m.nombre}
                            </option>
                        ))}
                    </select>
                    <select
                        className="form-select form-select-sm w-auto"
                        value={anioSeleccionado}
                        onChange={(e) => setAnioSeleccionado(e.target.value)}
                    >
                        {aniosDisponibles.map((anio) => (
                            <option key={anio} value={anio}>
                                {anio}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <DashboardKPIs
                ingresos={ingresos}
                gastos={gastos}
                balance={balance}
            />
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
            <DashboardCharts
                ingresos={ingresos}
                gastos={gastos}
                transaccionesMes={transaccionesMes}
            />
            <DashboardTable tablaCategorias={tablaCategorias} />
        </div>
    );
}
