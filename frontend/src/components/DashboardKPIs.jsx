import { formatCurrency } from "../utils/transactions";

export default function DashboardKPIs({ kpis }) {
    if (!kpis) return null;

    const {
        totalIngresos,
        gastosTotales,
        balanceNeto,
        detallesTipos = [],
    } = kpis;

    const gastosGenerales = detallesTipos.filter((t) => !t.es_ingreso);
    const esPositivo = balanceNeto >= 0;

    return (
        <div className="d-flex flex-column gap-3">
            {/* 3 KPI Cards Principales */}
            <div className="row g-3">
                {/* Ingresos */}
                <div className="col-12 col-md-4">
                    <div className="kpi-card kpi-card-income h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small text-uppercase fw-semibold">
                                Ingresos
                            </span>
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    background: "rgba(16, 185, 129, 0.15)",
                                    color: "#10b981",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </div>
                        </div>

                        <div className="h3 font-mono fw-bold mb-0" style={{ color: "#10b981" }}>
                            {formatCurrency(totalIngresos)}
                        </div>
                    </div>
                </div>

                {/* Gastos */}
                <div className="col-12 col-md-4">
                    <div className="kpi-card kpi-card-expense h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small text-uppercase fw-semibold">
                                Gastos
                            </span>
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    background: "rgba(244, 63, 94, 0.15)",
                                    color: "#f43f5e",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="17" y1="7" x2="7" y2="17" />
                                    <polyline points="17 17 7 17 7 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="h3 font-mono fw-bold mb-0" style={{ color: "#f43f5e" }}>
                            {formatCurrency(gastosTotales)}
                        </div>
                    </div>
                </div>

                {/* Balance */}
                <div className="col-12 col-md-4">
                    <div
                        className={`kpi-card ${
                            esPositivo ? "kpi-card-balance-pos" : "kpi-card-balance-neg"
                        } h-100`}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small text-uppercase fw-semibold">
                                Balance
                            </span>
                            <span
                                className="badge rounded-pill font-mono"
                                style={{
                                    backgroundColor: esPositivo
                                        ? "rgba(16, 185, 129, 0.15)"
                                        : "rgba(244, 63, 94, 0.15)",
                                    color: esPositivo ? "#10b981" : "#f43f5e",
                                    border: `1px solid ${
                                        esPositivo
                                            ? "rgba(16, 185, 129, 0.3)"
                                            : "rgba(244, 63, 94, 0.3)"
                                    }`,
                                    padding: "3px 8px",
                                    fontSize: "0.72rem",
                                }}
                            >
                                {esPositivo ? "Superávit" : "Déficit"}
                            </span>
                        </div>

                        <div
                            className="h3 font-mono fw-bold mb-0"
                            style={{ color: esPositivo ? "#10b981" : "#f43f5e" }}
                        >
                            {esPositivo ? "+" : ""}
                            {formatCurrency(balanceNeto)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-tipos de gastos (si existen) de forma compacta y minimalista */}
            {gastosGenerales.length > 0 && (
                <div className="row g-2">
                    {gastosGenerales.map((tipo) => {
                        const porcentaje =
                            gastosTotales > 0
                                ? Math.round((tipo.total / gastosTotales) * 100)
                                : 0;

                        return (
                            <div key={tipo.id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                                <div
                                    className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                                    style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                                        border: "1px solid rgba(255, 255, 255, 0.06)",
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                                        <span
                                            className="rounded-circle flex-shrink-0"
                                            style={{
                                                width: "8px",
                                                height: "8px",
                                                backgroundColor: tipo.color || "#8b949e",
                                            }}
                                        />
                                        <span className="text-light small text-truncate fw-medium">
                                            {tipo.label}
                                        </span>
                                    </div>
                                    <div className="font-mono text-light small text-nowrap fw-semibold">
                                        {formatCurrency(tipo.total)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
