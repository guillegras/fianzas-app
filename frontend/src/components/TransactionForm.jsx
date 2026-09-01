import { useState } from 'react';
import { categoriasPorTipo } from '../utils/constants';

export default function TransactionForm({ onGuardar }) {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'ingreso',
    categoria: 'Nomina',
    monto: '',
    descripcion: ''
  });

  const handleTipoChange = (e) => {
    const nuevoTipo = e.target.value;
    const primerasCategorias = categoriasPorTipo[nuevoTipo] || [];
    setForm({ ...form, tipo: nuevoTipo, categoria: primerasCategorias[0] || '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      titulo: form.categoria,
      monto: parseFloat(form.monto),
      tipo: form.tipo,
      categoria: form.categoria,
      fecha: form.fecha,
      descripcion: form.descripcion
    });
    setForm({
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'ingreso',
      categoria: 'Nomina',
      monto: '',
      descripcion: ''
    });
  };

  const categoriasDisponibles = categoriasPorTipo[form.tipo] || [];

return (
    <form onSubmit={handleSubmit}>
      {/* 1. Fecha */}
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input type="date" className="form-control" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required />
      </div>

      {/* 2. Tipo */}
      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select className="form-select" value={form.tipo} onChange={handleTipoChange}>
          <option value="ingreso">Ingreso</option>
          <option value="gasto_fijo">Gasto Fijo</option>
          <option value="gasto_variable">Gasto Variable</option>
          <option value="inversion">Inversión</option>
          <option value="deuda">Deuda</option>
        </select>
      </div>

      {/* 3. Categoría */}
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select className="form-select" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required>
          {categoriasDisponibles.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 4. Monto */}
      <div className="mb-3">
        <label className="form-label">Monto (€)</label>
        <input type="number" step="0.01" className="form-control" placeholder="0.00" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} required />
      </div>

      {/* 5. Descripción */}
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input type="text" className="form-control" placeholder="Detalles adicionales..." value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
      </div>

      <button type="submit" className="btn btn-primary w-100">Guardar</button>
    </form>
  );
}