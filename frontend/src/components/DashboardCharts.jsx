import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/transactions";

const CustomStackedTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        if (label === "Ingresos") {
            const ingresoItem = payload.find((p) => p.dataKey === "ingresos");
            const val = Number(ingresoItem?.value) || 0;
            return (
                <div
                    className="p-3 rounded-3 shadow-lg"
                    style={{
                        backgroundColor: "rgba(22, 27, 34, 0.96)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        minWidth: "170px",
                    }}
                >
                    <div className="fw-semibold small text-muted mb-2 pb-1 border-bottom border-white border-opacity-10">
                        Total Ingresos
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span
                                className="rounded-circle d-inline-block"
                                style={{ width: "8px", height: "8px", backgroundColor: "#10b981" }}
                            />
                            <span className="small text-light">Ingresos:</span>
                        </div>
                        <span className="font-mono fw-bold text-success">
                            {formatCurrency(val)}
                        </span>
                    </div>
                </div>
            );
        }

        // label === "Gastos"
        const activeSegments = payload.filter(
            (p) => p.dataKey !== "ingresos" && Number(p.value) > 0,
        );
        const totalGastos = activeSegments.reduce((sum, p) => sum + Number(p.value), 0);

        return (
            <div
                className="p-3 rounded-3 shadow-lg"
                style={{
                    backgroundColor: "rgba(22, 27, 34, 0.96)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    minWidth: "210px",
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-white border-opacity-10">
                    <span className="fw-semibold small text-muted">Total Gastos</span>
                    <span className="font-mono fw-bold text-danger">{formatCurrency(totalGastos)}</span>
                </div>
                <div className="d-flex flex-column gap-2">
                    {activeSegments.map((seg) => {
                        const pct = totalGastos > 0 ? ((Number(seg.value) / totalGastos) * 100).toFixed(1) : 0;
                        return (
                            <div key={seg.dataKey} className="d-flex align-items-center justify-content-between gap-3 small">
                                <div className="d-flex align-items-center gap-2 text-truncate">
                                    <span
                                        className="rounded-circle d-inline-block flex-shrink-0"
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: seg.fill || seg.color,
                                        }}
                                    />
                                    <span className="text-light text-truncate">{seg.name}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                    <span className="text-muted font-mono" style={{ fontSize: "0.72rem" }}>
                                        {pct}%
                                    </span>
                                    <span className="font-mono fw-semibold text-light">
                                        {formatCurrency(Number(seg.value))}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

export default function DashboardCharts({ graficos = {}, kpis = {}, tablaCategorias = [] }) {
    const tiposGasto = useMemo(() => {
        return (kpis?.detallesTipos || []).filter((t) => !t.es_ingreso);
    }, [kpis?.detallesTipos]);

    const tiposMap = useMemo(() => {
        const mapa = {};
        (kpis?.detallesTipos || []).forEach((t) => {
            mapa[t.id] = t;
        });
        return mapa;
    }, [kpis?.detallesTipos]);

    const totalIngresos = Number(kpis?.totalIngresos) || 0;
    const totalGastos = Number(kpis?.gastosTotales) || 0;

    // Stacked data for BarChart
    const stackedBarData = useMemo(() => {
        const rowIngresos = {
            nombre: "Ingresos",
            ingresos: totalIngresos,
        };
        const rowGastos = {
            nombre: "Gastos",
            ingresos: 0,
        };

        tiposGasto.forEach((t) => {
            rowIngresos[t.id] = 0;
            rowGastos[t.id] = Number(t.total) || 0;
        });

        return [rowIngresos, rowGastos];
    }, [totalIngresos, tiposGasto]);

    // Determine the last non-zero expense type to apply top rounded corners
    const lastActiveExpenseId = useMemo(() => {
        const active = tiposGasto.filter((t) => Number(t.total) > 0);
        return active.length > 0 ? active[active.length - 1].id : null;
    }, [tiposGasto]);

    // Top 5 expense categories
    const topCategoriasGasto = useMemo(() => {
        if (!tablaCategorias || !Array.isArray(tablaCategorias)) return [];

        return tablaCategorias
            .filter((cat) => {
                const tipoInfo = tiposMap[cat.tipo];
                // Only consider non-income categories with positive spend
                return (!tipoInfo || !tipoInfo.es_ingreso) && Number(cat.actual) > 0;
            })
            .sort((a, b) => Number(b.actual) - Number(a.actual))
            .slice(0, 5);
    }, [tablaCategorias, tiposMap]);

    return (
        <div className="row g-3">
            {/* Gráfico 1: Ingresos vs Gastos con desglose apilado */}
            <div className="col-12 col-lg-6">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h5 className="m-0 fw-bold text-light fs-6">
                                Ingresos vs Gastos
                            </h5>
                            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                Gastos divididos por tipo de movimiento
                            </span>
                        </div>
                    </div>

                    <div className="flex-grow-1" style={{ minHeight: 270, width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stackedBarData}
                                margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="nombre"
                                    stroke="#6e7681"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                                />
                                <YAxis
                                    stroke="#6e7681"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                                    tickFormatter={(val) => `${val}€`}
                                />
                                <Tooltip
                                    content={<CustomStackedTooltip />}
                                    cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                                />
                                <Bar
                                    dataKey="ingresos"
                                    name="Ingresos"
                                    stackId="comparativa"
                                    fill="#10b981"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={56}
                                />
                                {tiposGasto.map((tipo) => (
                                    <Bar
                                        key={tipo.id}
                                        dataKey={tipo.id}
                                        name={tipo.label}
                                        stackId="comparativa"
                                        fill={tipo.color}
                                        radius={tipo.id === lastActiveExpenseId ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                                        maxBarSize={56}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gráfico 2: Top Categorías con mayor gasto */}
            <div className="col-12 col-lg-6">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h5 className="m-0 fw-bold text-light fs-6">
                                Top Categorías de Gasto
                            </h5>
                            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                Dónde se ha concentrado el gasto este mes
                            </span>
                        </div>
                        {topCategoriasGasto.length > 0 && (
                            <span
                                className="badge rounded-pill bg-white bg-opacity-10 text-muted font-mono px-2 py-1"
                                style={{ fontSize: "0.75rem" }}
                            >
                                Top {topCategoriasGasto.length}
                            </span>
                        )}
                    </div>

                    <div className="d-flex flex-column justify-content-center flex-grow-1 gap-3 py-1">
                        {topCategoriasGasto.length === 0 ? (
                            <div className="d-flex flex-column align-items-center justify-content-center text-muted text-center py-4 my-auto">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="opacity-50 mb-2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span className="small">Sin gastos registrados en este periodo</span>
                            </div>
                        ) : (
                            topCategoriasGasto.map((cat, idx) => {
                                const tipoInfo = tiposMap[cat.tipo] || {
                                    label: cat.tipo,
                                    color: "#ef4444",
                                };
                                const pct =
                                    totalGastos > 0
                                        ? ((Number(cat.actual) / totalGastos) * 100).toFixed(1)
                                        : 0;

                                return (
                                    <div key={cat.categoria || idx} className="d-flex flex-column gap-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2 text-truncate me-2">
                                                <span
                                                    className="rounded-circle flex-shrink-0"
                                                    style={{
                                                        width: "7px",
                                                        height: "7px",
                                                        backgroundColor: tipoInfo.color,
                                                    }}
                                                />
                                                <span className="fw-semibold text-light text-truncate small">
                                                    {cat.categoria}
                                                </span>
                                                <span
                                                    className="badge-pill-custom py-0 px-2 d-none d-sm-inline-flex"
                                                    style={{
                                                        fontSize: "0.68rem",
                                                        backgroundColor: `${tipoInfo.color}18`,
                                                        color: tipoInfo.color,
                                                        border: `1px solid ${tipoInfo.color}33`,
                                                    }}
                                                >
                                                    {tipoInfo.label}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-baseline gap-2 flex-shrink-0">
                                                <span
                                                    className="text-muted small font-mono"
                                                    style={{ fontSize: "0.75rem" }}
                                                >
                                                    {pct}%
                                                </span>
                                                <span className="font-mono fw-bold text-light small">
                                                    {formatCurrency(Number(cat.actual))}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="progress"
                                            style={{
                                                height: "6px",
                                                backgroundColor: "rgba(255, 255, 255, 0.06)",
                                                borderRadius: "999px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${pct}%`,
                                                    backgroundColor: tipoInfo.color,
                                                    borderRadius: "999px",
                                                    transition: "width 0.4s ease",
                                                }}
                                                aria-valuenow={pct}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Resumen inferior del bloque derecho */}
                    <div className="pt-3 border-top border-white border-opacity-10 mt-3 d-flex justify-content-between align-items-center">
                        <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                            Total gastos del periodo
                        </span>
                        <span className="font-mono fw-bold text-light small">
                            {formatCurrency(totalGastos)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
