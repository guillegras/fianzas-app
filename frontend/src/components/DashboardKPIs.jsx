import { configTipos } from "../utils/constants";
import { formatCurrency } from "../utils/transactions";

export default function DashboardKPIs({ kpis }) {
    if (!kpis) return null;

    const {
        totalIngresos,
        totalGastosFijos,
        totalGastosVariables,
        totalInversiones,
        gastosTotales,
        balanceNeto,
    } = kpis;

    return (
        <div className="card bg-dark border-0 shadow-sm p-4 mb-4">
            <div className="row g-4 align-items-center text-center text-md-start">
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Ingresos
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.ingreso?.color }}
                    >
                        {formatCurrency(totalIngresos)}
                    </h4>
                </div>
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Salidas
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
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Gastos Fijos
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.gasto_fijo?.color }}
                    >
                        {formatCurrency(totalGastosFijos)}
                    </h4>
                </div>
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Gastos Variables
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.gasto_variable?.color }}
                    >
                        {formatCurrency(totalGastosVariables)}
                    </h4>
                </div>
                <div className="col-md col-sm-6">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Inversiones
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.inversion?.color }}
                    >
                        {formatCurrency(totalInversiones)}
                    </h4>
                </div>
            </div>
        </div>
    );
}
