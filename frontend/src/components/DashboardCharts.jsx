import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { configTipos } from "../utils/constants";

export default function DashboardCharts({
    ingresos,
    gastos,
    transaccionesMes,
}) {
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

    const dataBarras = [
        {
            nombre: "Ingresos",
            cantidad: ingresos,
            fill: configTipos.ingreso.color,
        },
        {
            nombre: "Gastos",
            cantidad: gastos,
            fill: configTipos.gasto_variable.color,
        },
    ];

    const gastosPorTipo = transaccionesMes
        .filter((t) => t.tipo !== "ingreso")
        .reduce((acc, t) => {
            acc[t.tipo] = (acc[t.tipo] || 0) + t.monto;
            return acc;
        }, {});

    const dataPastel = Object.keys(gastosPorTipo).map((tipo) => ({
        name: configTipos[tipo].label,
        tipoId: tipo,
        value: gastosPorTipo[tipo],
        color: configTipos[tipo].color,
    }));

    const desgloseCategoria = tipoSeleccionado
        ? transaccionesMes
              .filter((t) => t.tipo === tipoSeleccionado)
              .reduce((acc, t) => {
                  acc[t.categoria] = (acc[t.categoria] || 0) + t.monto;
                  return acc;
              }, {})
        : {};

    const dataDesglose = Object.keys(desgloseCategoria)
        .map((cat) => ({ name: cat, value: desgloseCategoria[cat] }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="row">
            <div className="col-md-6 mb-4">
                <div className="card p-4 shadow-sm h-100">
                    <h5 className="mb-4 text-center">Ingresos vs Gastos</h5>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataBarras}>
                                <XAxis dataKey="nombre" stroke="#8884d8" />
                                <YAxis />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    formatter={(value) => `${value} €`}
                                />
                                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-6 mb-4">
                <div className="card p-4 shadow-sm h-100">
                    <h5 className="mb-2 text-center">Distribución de Gastos</h5>
                    {tipoSeleccionado && (
                        <p className="text-muted text-center small mb-4">
                            Detalle de categorías
                        </p>
                    )}

                    <div
                        className="row align-items-center"
                        style={{ height: 300 }}
                    >
                        <div
                            className={
                                tipoSeleccionado
                                    ? "col-6 h-100"
                                    : "col-12 h-100"
                            }
                        >
                            {dataPastel.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dataPastel}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={
                                                tipoSeleccionado ? 50 : 70
                                            }
                                            outerRadius={
                                                tipoSeleccionado ? 80 : 100
                                            }
                                            paddingAngle={5}
                                            dataKey="value"
                                            onClick={(data) =>
                                                setTipoSeleccionado(
                                                    data.payload.tipoId,
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            {dataPastel.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `${value} €`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="d-flex h-100 align-items-center justify-content-center text-muted text-center">
                                    No hay gastos este mes.
                                </div>
                            )}
                        </div>

                        {tipoSeleccionado && (
                            <div
                                className="col-6"
                                style={{
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                }}
                            >
                                <h6
                                    className="border-bottom pb-2 mb-3 fw-bold"
                                    style={{
                                        color: configTipos[tipoSeleccionado]
                                            .color,
                                    }}
                                >
                                    {configTipos[tipoSeleccionado].label}
                                </h6>
                                <ul className="list-unstyled m-0">
                                    {dataDesglose.map((d) => (
                                        <li
                                            key={d.name}
                                            className="d-flex justify-content-between align-items-center mb-2 small"
                                        >
                                            <span className="text-truncate me-2">
                                                {d.name}
                                            </span>
                                            <strong className="text-nowrap">
                                                {d.value.toFixed(2)} €
                                            </strong>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="btn btn-sm btn-outline-secondary mt-3 w-100"
                                    onClick={() => setTipoSeleccionado(null)}
                                >
                                    Volver
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
