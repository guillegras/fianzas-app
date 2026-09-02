import { configTipos } from "../utils/constants";

export default function DashboardKPIs({ ingresos, gastos, balance }) {
    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <div
                    className="card text-center p-4 shadow-sm border-0 border-start border-5"
                    style={{ borderColor: configTipos.ingreso.color }}
                >
                    <h5 className="text-muted mb-2">Total Ingresos</h5>
                    <h2 style={{ color: configTipos.ingreso.color }}>
                        {ingresos.toFixed(2)} €
                    </h2>
                </div>
            </div>
            <div className="col-md-4">
                <div
                    className="card text-center p-4 shadow-sm border-0 border-start border-5"
                    style={{ borderColor: configTipos.gasto_variable.color }}
                >
                    <h5 className="text-muted mb-2">Total Gastos</h5>
                    <h2 style={{ color: configTipos.gasto_variable.color }}>
                        {gastos.toFixed(2)} €
                    </h2>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-center p-4 shadow-sm border-0 border-start border-5 border-primary">
                    <h5 className="text-muted mb-2">Balance Mensual</h5>
                    <h2
                        className={
                            balance >= 0 ? "text-primary" : "text-danger"
                        }
                    >
                        {balance.toFixed(2)} €
                    </h2>
                </div>
            </div>
        </div>
    );
}
