import { configTipos } from '../utils/constants';

export default function TransactionList({ transacciones, onEliminar }) {
  return (
    <div className="card p-4 shadow-sm">
      <div className="table-responsive">
        <table className="table table-striped align-middle mt-2">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map(t => {
              const visual = configTipos[t.tipo] || { label: t.tipo, color: "#6c757d" };
              return (
                <tr key={t.id}>
                  <td>{t.fecha}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: visual.color }}>
                      {visual.label}
                    </span>
                  </td>
                  <td><strong>{t.categoria || t.titulo}</strong></td>
                  <td>{t.monto} €</td>
                  <td>{t.descripcion || '-'}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-outline-danger border-0" 
                      onClick={() => onEliminar(t.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
            {transacciones.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">No hay registros todavía.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}