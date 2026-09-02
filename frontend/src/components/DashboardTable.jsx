import { configTipos } from "../utils/constants";
import { formatCurrency } from "../utils/transactions";

export default function DashboardTable({ tablaCategorias }) {
    const renderDiferencia = (item) => {
        if (item.diferencia === 0)
            return (
                <span className="text-muted font-mono">
                    {formatCurrency(0)}
                </span>
            );

        const isIngreso = item.tipo === "ingreso";
        const impacto = isIngreso ? item.diferencia : -item.diferencia;
        const colorClass = impacto > 0 ? "text-success" : "text-danger";
        const signo = impacto < 0 ? "-" : "";

        return (
            <span className={`${colorClass} fw-bold font-mono`}>
                {signo}
                {formatCurrency(Math.abs(impacto))}
            </span>
        );
    };

    return (
        <div className="row mt-2">
            <div className="col-12 mb-4">
                <div className="card bg-dark border-0 shadow-sm p-4">
                    <h5 className="mb-4 text-light">
                        Desglose de Categorías y Comparativa Intermensual
                    </h5>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle m-0">
                            <thead>
                                <tr>
                                    <th scope="col">Categoría</th>
                                    <th scope="col">Tipo</th>
                                    <th
                                        scope="col"
                                        className="text-end text-muted"
                                    >
                                        Mes Anterior
                                    </th>
                                    <th scope="col" className="text-end">
                                        Mes Actual
                                    </th>
                                    <th scope="col" className="text-end">
                                        Diferencia
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablaCategorias.map((item) => (
                                    <tr key={`${item.tipo}-${item.categoria}`}>
                                        <td className="fw-medium text-light">
                                            {item.categoria}
                                        </td>
                                        <td>
                                            <span
                                                className="badge text-white"
                                                style={{
                                                    backgroundColor:
                                                        configTipos[item.tipo]
                                                            ?.color ||
                                                        "#6c757d",
                                                }}
                                            >
                                                {configTipos[item.tipo]
                                                    ?.label || item.tipo}
                                            </span>
                                        </td>
                                        <td className="text-end text-muted font-mono">
                                            {formatCurrency(item.anterior)}
                                        </td>
                                        <td className="text-end fw-bold font-mono text-light">
                                            {formatCurrency(item.actual)}
                                        </td>
                                        <td className="text-end">
                                            {renderDiferencia(item)}
                                        </td>
                                    </tr>
                                ))}
                                {tablaCategorias.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center text-muted py-4"
                                        >
                                            No hay datos para comparar en estos
                                            periodos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
