import { configTipos } from "../utils/constants";
import { getTotalExpenses, summarizeTransactions } from "../utils/transactions";

export default function DashboardKPIs({ transaccionesMes }) {
    const resumen = summarizeTransactions(transaccionesMes);
    const totalIngresos = resumen.ingresos;
    const totalGastosFijos = resumen.gastosFijos;
    const totalGastosVariables = resumen.gastosVariables;
    const totalInversiones = resumen.inversiones;
    const gastosTotales = getTotalExpenses(resumen);
    const balanceNeto = totalIngresos - gastosTotales;

    return (
        <div className="card bg-dark border-0 shadow-sm p-4 mb-4">
            <div className="row g-4 align-items-center text-center text-md-start">
                {/* Ingresos */}
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Ingresos
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.ingreso?.color }}
                    >
                        {totalIngresos.toFixed(2)} €
                    </h4>
                </div>

                {/* Salidas Totales */}
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Salidas
                    </span>
                    <h4 className="font-mono fw-bold text-danger mb-0">
                        {gastosTotales.toFixed(2)} €
                    </h4>
                </div>

                {/* Balance */}
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Balance
                    </span>
                    <h4
                        className={`font-mono fw-bold mb-0 ${balanceNeto >= 0 ? "text-success" : "text-danger"}`}
                    >
                        {balanceNeto.toFixed(2)} €
                    </h4>
                </div>

                {/* Gastos Fijos */}
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Gastos Fijos
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.gasto_fijo?.color }}
                    >
                        {totalGastosFijos.toFixed(2)} €
                    </h4>
                </div>

                {/* Gastos Variables */}
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Gastos Variables
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.gasto_variable?.color }}
                    >
                        {totalGastosVariables.toFixed(2)} €
                    </h4>
                </div>

                {/* Inversiones */}
                <div className="col-md col-sm-6">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Inversiones
                    </span>
                    <h4
                        className="font-mono fw-bold mb-0"
                        style={{ color: configTipos.inversion?.color }}
                    >
                        {totalInversiones.toFixed(2)} €
                    </h4>
                </div>
            </div>
        </div>
    );
}
