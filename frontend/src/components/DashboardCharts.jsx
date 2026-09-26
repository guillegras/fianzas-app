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
import { formatCurrency } from "../utils/transactions";

export default function DashboardCharts({ graficos }) {
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const { dataBarras, dataPastel, desgloses } = graficos;

    const dataDesglose =
        tipoSeleccionado && desgloses[tipoSeleccionado]
            ? desgloses[tipoSeleccionado]
            : [];

    return (
        <div className="row g-3 mb-4">
            <div className="col-md-6">
                <div className="card bg-dark border-0 shadow-sm p-4 h-100">
                    <h5 className="mb-4 text-center text-light">
                        Ingresos vs Gastos
                    </h5>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataBarras}>
                                <XAxis dataKey="nombre" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#16181d",
                                        borderColor: "#374151",
                                        borderRadius: "6px",
                                        color: "#ffffff",
                                    }}
                                    itemStyle={{ color: "#ffffff" }}
                                    labelStyle={{
                                        color: "#9ca3af",
                                        fontWeight: "bold",
                                        marginBottom: "4px",
                                    }}
                                    cursor={{
                                        fill: "rgba(255, 255, 255, 0.05)",
                                    }}
                                    formatter={(value) => [
                                        formatCurrency(value),
                                        "Cantidad",
                                    ]}
                                />
                                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                                    {dataBarras.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card bg-dark border-0 shadow-sm p-4 h-100">
                    <h5 className="mb-2 text-center text-light">
                        Distribución por Tipos
                    </h5>
                    {tipoSeleccionado ? (
                        <p className="text-muted text-center small mb-4">
                            Detalle de categorías
                        </p>
                    ) : (
                        <div className="mb-4" />
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
                            {dataPastel?.length > 0 ? (
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
                                            contentStyle={{
                                                backgroundColor: "#16181d",
                                                borderColor: "#374151",
                                                borderRadius: "6px",
                                                color: "#ffffff",
                                            }}
                                            itemStyle={{ color: "#ffffff" }}
                                            formatter={(value, name, item) => [
                                                formatCurrency(value),
                                                item.payload.name,
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="d-flex h-100 align-items-center justify-content-center text-muted text-center">
                                    No hay registros este mes.
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
                                    className="border-bottom border-secondary pb-2 mb-3 fw-bold"
                                    style={{ color: "#ffffff" }}
                                >
                                    Detalle
                                </h6>
                                <ul className="list-unstyled m-0">
                                    {dataDesglose.map((d) => (
                                        <li
                                            key={d.name}
                                            className="d-flex justify-content-between align-items-center mb-2 small text-light"
                                        >
                                            <span className="text-truncate me-2 text-muted">
                                                {d.name}
                                            </span>
                                            <strong className="font-mono text-nowrap">
                                                {formatCurrency(d.value)}
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
