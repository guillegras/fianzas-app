import { useState, useEffect } from "react";
import { formatCurrency } from "../utils/transactions";
import { API_URL } from "../services/api";

export default function DashboardTable({ tablaCategorias = [] }) {
    const [tiposMap, setTiposMap] = useState({});

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const res = await fetch(`${API_URL}/transaction-types/`);
                if (res.ok) {
                    const data = await res.json();
                    const mapa = {};
                    data.forEach((t) => {
                        mapa[t.id] = {
                            label: t.etiqueta,
                            color: t.color,
                            es_ingreso: t.es_ingreso,
                        };
                    });
                    setTiposMap(mapa);
                }
            } catch (err) {
                console.error("Error cargando colores de tipos en la tabla", err);
            }
        };
        fetchTipos();
    }, []);

    const renderDiferencia = (item) => {
        if (item.diferencia === 0) {
            return (
                <span className="text-muted font-mono small">
                    {formatCurrency(0)}
                </span>
            );
        }

        const tipoInfo = tiposMap[item.tipo] || { es_ingreso: false };
        const isIngreso = tipoInfo.es_ingreso;
        const impacto = isIngreso ? item.diferencia : -item.diferencia;
        const esPositivo = impacto > 0;
        const colorClass = esPositivo ? "text-success" : "text-danger";
        const signo = esPositivo ? "+" : "";

        return (
            <span
                className={`font-mono fw-bold d-inline-flex align-items-center gap-1 ${colorClass}`}
                style={{ fontSize: "0.88rem" }}
            >
                {esPositivo ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                )}
                {signo}{formatCurrency(impacto)}
            </span>
        );
    };

    return (
        <div className="glass-card p-4">
            <div className="mb-3">
                <h5 className="m-0 fw-bold text-light fs-6">
                    Comparativa por Categoría
                </h5>
            </div>

            <div className="table-responsive">
                <table className="modern-table align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Categoría</th>
                            <th scope="col">Tipo</th>
                            <th scope="col" className="text-end">Mes Anterior</th>
                            <th scope="col" className="text-end">Mes Actual</th>
                            <th scope="col" className="text-end">Diferencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tablaCategorias.map((item) => {
                            const tipoVisual = tiposMap[item.tipo] || {
                                label: item.tipo,
                                color: "#6c757d",
                            };

                            return (
                                <tr key={`${item.tipo}-${item.categoria}`}>
                                    <td>
                                        <span className="fw-semibold text-light">
                                            {item.categoria}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="badge-pill-custom"
                                            style={{
                                                backgroundColor: `${tipoVisual.color}22`,
                                                color: tipoVisual.color,
                                                border: `1px solid ${tipoVisual.color}44`,
                                            }}
                                        >
                                            <span
                                                className="rounded-circle"
                                                style={{
                                                    width: "6px",
                                                    height: "6px",
                                                    backgroundColor: tipoVisual.color,
                                                }}
                                            />
                                            {tipoVisual.label}
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
                            );
                        })}
                        {tablaCategorias.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">
                                    <span className="small">No hay datos en este periodo</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
