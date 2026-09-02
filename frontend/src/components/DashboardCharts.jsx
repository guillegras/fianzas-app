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
<<<<<<< HEAD
            fill: configTipos.ingreso?.color || "#198754",
        },
        {
            nombre: "Gastos",
            cantidad: gastos, // Usa el total unificado de salidas (fijos, variables, inversiones, deudas)
            fill: configTipos.gasto_variable?.color || "#dc3545",
        },
    ];

    const salidasPorTipo = transaccionesMes
        .filter((t) => t.tipo !== "ingreso")
        .reduce((acc, t) => {
            if (t.tipo) {
                acc[t.tipo] = (acc[t.tipo] || 0) + (Number(t.monto) || 0);
            }
            return acc;
        }, {});

    const dataPastel = Object.keys(salidasPorTipo).map((tipo) => ({
        name: configTipos[tipo]?.label || tipo,
        tipoId: tipo,
        value: salidasPorTipo[tipo],
        color: configTipos[tipo]?.color || "#6c757d",
=======
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
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
    }));

    const desgloseCategoria = tipoSeleccionado
        ? transaccionesMes
              .filter((t) => t.tipo === tipoSeleccionado)
              .reduce((acc, t) => {
<<<<<<< HEAD
                  const cat = t.categoria || t.titulo || "Sin categoría";
                  acc[cat] = (acc[cat] || 0) + (Number(t.monto) || 0);
=======
                  acc[t.categoria] = (acc[t.categoria] || 0) + t.monto;
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                  return acc;
              }, {})
        : {};

    const dataDesglose = Object.keys(desgloseCategoria)
        .map((cat) => ({ name: cat, value: desgloseCategoria[cat] }))
        .sort((a, b) => b.value - a.value);

    return (
<<<<<<< HEAD
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
                                        `${Number(value).toFixed(2)} €`,
                                        "Cantidad",
                                    ]}
=======
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
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                />
                                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

<<<<<<< HEAD
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
                        <p className="text-muted text-center small mb-4">
                            Gastos Fijos, Variables, Inversiones y Deudas
                        </p>
=======
            <div className="col-md-6 mb-4">
                <div className="card p-4 shadow-sm h-100">
                    <h5 className="mb-2 text-center">Distribución de Gastos</h5>
                    {tipoSeleccionado && (
                        <p className="text-muted text-center small mb-4">
                            Detalle de categorías
                        </p>
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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
<<<<<<< HEAD
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
                                            formatter={(value) => [
                                                `${Number(value).toFixed(2)} €`,
                                                "Monto",
                                            ]}
=======
                                            formatter={(value) => `${value} €`}
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="d-flex h-100 align-items-center justify-content-center text-muted text-center">
<<<<<<< HEAD
                                    No hay registros este mes.
=======
                                    No hay gastos este mes.
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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
<<<<<<< HEAD
                                    className="border-bottom border-secondary pb-2 mb-3 fw-bold"
                                    style={{
                                        color: configTipos[tipoSeleccionado]
                                            ?.color,
                                    }}
                                >
                                    {configTipos[tipoSeleccionado]?.label}
=======
                                    className="border-bottom pb-2 mb-3 fw-bold"
                                    style={{
                                        color: configTipos[tipoSeleccionado]
                                            .color,
                                    }}
                                >
                                    {configTipos[tipoSeleccionado].label}
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                </h6>
                                <ul className="list-unstyled m-0">
                                    {dataDesglose.map((d) => (
                                        <li
                                            key={d.name}
<<<<<<< HEAD
                                            className="d-flex justify-content-between align-items-center mb-2 small text-light"
                                        >
                                            <span className="text-truncate me-2 text-muted">
                                                {d.name}
                                            </span>
                                            <strong className="font-mono text-nowrap">
=======
                                            className="d-flex justify-content-between align-items-center mb-2 small"
                                        >
                                            <span className="text-truncate me-2">
                                                {d.name}
                                            </span>
                                            <strong className="text-nowrap">
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
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
