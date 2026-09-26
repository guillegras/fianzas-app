export default function SettingsTypesTable({
    types,
    loading,
    onEdit,
    onDelete,
}) {
    if (loading) return <p className="text-muted">Cargando tipos...</p>;

    return (
        <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
                <thead>
                    <tr>
                        <th>Etiqueta</th>
                        <th>Color</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {types.map((t) => (
                        <tr key={t.id}>
                            <td>{t.etiqueta}</td>
                            <td>
                                <span
                                    className="d-inline-block rounded-circle me-2"
                                    style={{
                                        width: "15px",
                                        height: "15px",
                                        backgroundColor: t.color,
                                    }}
                                />
                                {t.color}
                            </td>
                            <td>
                                <span
                                    className={`badge ${t.es_ingreso ? "bg-success" : "bg-danger"}`}
                                >
                                    {t.es_ingreso ? "Ingreso" : "Salida"}
                                </span>
                            </td>
                            <td>
                                <span
                                    className={`badge ${t.activo ? "bg-info" : "bg-secondary"}`}
                                >
                                    {t.activo ? "Activo" : "Inactivo"}
                                </span>
                            </td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-outline-warning me-2"
                                    onClick={() => onEdit(t)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => onDelete(t.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
