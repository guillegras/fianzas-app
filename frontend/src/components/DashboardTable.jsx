import { configTipos } from "../utils/constants";

export default function DashboardTable({ tablaCategorias }) {
    const renderDiferencia = (item) => {
        if (item.diferencia === 0)
<<<<<<< HEAD
            return <span className="text-muted font-mono">0.00 €</span>;

        const isIngreso = item.tipo === "ingreso";
        const impacto = isIngreso ? item.diferencia : -item.diferencia;
        const colorClass = impacto > 0 ? "text-success" : "text-danger";
        const signo = impacto < 0 ? "-" : "";

        return (
            <span className={`${colorClass} fw-bold font-mono`}>
=======
            return <span className="text-muted">0.00 €</span>;

        const isIngreso = item.tipo === "ingreso";

        const impacto = isIngreso ? item.diferencia : -item.diferencia;

        const colorClass = impacto > 0 ? "text-success" : "text-danger";

        const signo = impacto < 0 ? "-" : "";

        return (
            <span className={`${colorClass} fw-bold`}>
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                {signo}
                {Math.abs(impacto).toFixed(2)} €
            </span>
        );
    };

    return (
        <div className="row mt-2">
            <div className="col-12 mb-4">
<<<<<<< HEAD
                <div className="card bg-dark border-0 shadow-sm p-4">
                    <h5 className="mb-4 text-light">
                        Desglose de Categorías y Comparativa Intermensual
                    </h5>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle m-0">
=======
                <div className="card p-4 shadow-sm border-0">
                    <h5 className="mb-4">
                        Desglose de Categorías y Comparativa Intermensual
                    </h5>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle m-0">
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Tipo</th>
                                    <th className="text-end text-muted">
                                        Mes Anterior
                                    </th>
                                    <th className="text-end">Mes Actual</th>
                                    <th className="text-end">Diferencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablaCategorias.map((item, index) => (
                                    <tr key={index}>
<<<<<<< HEAD
                                        <td className="fw-medium text-light">
=======
                                        <td className="fw-medium">
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                            {item.categoria}
                                        </td>
                                        <td>
                                            <span
<<<<<<< HEAD
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
                                            {item.anterior.toFixed(2)} €
                                        </td>
                                        <td className="text-end fw-bold font-mono text-light">
=======
                                                className="badge"
                                                style={{
                                                    backgroundColor:
                                                        configTipos[item.tipo]
                                                            ?.color,
                                                }}
                                            >
                                                {configTipos[item.tipo]?.label}
                                            </span>
                                        </td>
                                        <td className="text-end text-muted">
                                            {item.anterior.toFixed(2)} €
                                        </td>
                                        <td className="text-end fw-bold">
>>>>>>> f72a14ad696998f1014f58e9f734a0e2abd65476
                                            {item.actual.toFixed(2)} €
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
