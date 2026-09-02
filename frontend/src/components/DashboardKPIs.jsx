import { configTipos } from "../utils/constants";

export default function DashboardKPIs({ transaccionesMes }) {
    const totalIngresos = transaccionesMes
        .filter((t) => t.tipo === "ingreso")
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const totalGastosFijos = transaccionesMes
        .filter((t) => t.tipo === "gasto_fijo")
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const totalGastosVariables = transaccionesMes
        .filter((t) => t.tipo === "gasto_variable")
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const totalInversiones = transaccionesMes
        .filter((t) => t.tipo === "inversion")
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const totalDeudas = transaccionesMes
        .filter((t) => t.tipo === "deuda")
        .reduce((acc, t) => acc + (Number(t.monto) || 0), 0);

    const gastosTotales =
        totalGastosFijos +
        totalGastosVariables +
        totalInversiones +
        totalDeudas;
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

                {/* Gastos Totales */}
                <div className="col-md col-sm-6 border-end border-secondary border-opacity-25">
                    <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                        Gastos
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
