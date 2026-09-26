import { formatCurrency } from "../utils/transactions";

export default function DashboardKPIs({ kpis }) {
    if (!kpis) return null;

    const {
        totalIngresos,
        gastosTotales,
        balanceNeto,
        detallesTipos = [],
    } = kpis;

    const ingresosGenerales = detallesTipos.filter((t) => t.es_ingreso);
    const gastosGenerales = detallesTipos.filter((t) => !t.es_ingreso);

    return (
        <div className="card bg-dark border-0 shadow-sm p-4 mb-4">
            <div className="row g-4 align-items-center text-center text-md-start">
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Ingresos
                    </span>
                    <h4 className="font-mono fw-bold mb-0 text-success">
                        {formatCurrency(totalIngresos)}
                    </h4>
                </div>
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Gastos
                    </span>
                    <h4 className="font-mono fw-bold text-danger mb-0">
                        {formatCurrency(gastosTotales)}
                    </h4>
                </div>
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Balance
                    </span>
                    <h4
                        className={`font-mono fw-bold mb-0 ${balanceNeto >= 0 ? "text-success" : "text-danger"}`}
                    >
                        {formatCurrency(balanceNeto)}
                    </h4>
                </div>

                {gastosGenerales.map((tipo) => (
                    <div
                        key={tipo.id}
                        className="col-md col-sm-6 border-end border-secondary border-opacity-25"
                    >
                        <span className="text-muted small text-uppercase fw-semibold d-block mb-1 text-truncate">
                            {tipo.label}
                        </span>
                        <h4
                            className="font-mono fw-bold mb-0"
                            style={{ color: tipo.color }}
                        >
                            {formatCurrency(tipo.total)}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
}
