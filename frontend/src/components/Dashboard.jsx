import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { configTipos } from '../utils/constants';

const MESES = [
  { valor: '01', nombre: 'Enero' }, { valor: '02', nombre: 'Febrero' },
  { valor: '03', nombre: 'Marzo' }, { valor: '04', nombre: 'Abril' },
  { valor: '05', nombre: 'Mayo' }, { valor: '06', nombre: 'Junio' },
  { valor: '07', nombre: 'Julio' }, { valor: '08', nombre: 'Agosto' },
  { valor: '09', nombre: 'Septiembre' }, { valor: '10', nombre: 'Octubre' },
  { valor: '11', nombre: 'Noviembre' }, { valor: '12', nombre: 'Diciembre' }
];

export default function Dashboard({ transacciones }) {
  const hoy = new Date();
  
  const [mesSeleccionado, setMesSeleccionado] = useState(String(hoy.getMonth() + 1).padStart(2, '0'));
  const [anioSeleccionado, setAnioSeleccionado] = useState(String(hoy.getFullYear()));
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const aniosDisponibles = useMemo(() => {
    const anioActual = hoy.getFullYear();
    const lista = [];
    for (let a = anioActual - 5; a <= anioActual + 2; a++) {
      lista.push(String(a));
    }
    return lista;
  }, []);

  // 1. Determinar Periodo Actual y Periodo Anterior
  const periodoActual = `${anioSeleccionado}-${mesSeleccionado}`;
  
  const periodoAnterior = useMemo(() => {
    let mes = parseInt(mesSeleccionado, 10) - 1;
    let anio = parseInt(anioSeleccionado, 10);
    if (mes === 0) {
      mes = 12;
      anio -= 1;
    }
    return `${anio}-${String(mes).padStart(2, '0')}`;
  }, [mesSeleccionado, anioSeleccionado]);

  // 2. Filtrar transacciones por ambos periodos
  const transaccionesMes = useMemo(() => {
    return transacciones.filter(t => t.fecha.startsWith(periodoActual));
  }, [transacciones, periodoActual]);

  const transaccionesAnterior = useMemo(() => {
    return transacciones.filter(t => t.fecha.startsWith(periodoAnterior));
  }, [transacciones, periodoAnterior]);

  // KPIs del mes actual
  const ingresos = transaccionesMes.filter(t => t.tipo === 'ingreso').reduce((acc, t) => acc + t.monto, 0);
  const gastos = transaccionesMes.filter(t => t.tipo !== 'ingreso').reduce((acc, t) => acc + t.monto, 0);
  const balance = ingresos - gastos;

  const dataBarras = [
    { nombre: 'Ingresos', cantidad: ingresos, fill: configTipos.ingreso.color },
    { nombre: 'Gastos', cantidad: gastos, fill: configTipos.gasto_variable.color }
  ];

  // Gráficos (Solo mes actual y excluyendo ingresos)
  const gastosPorTipo = transaccionesMes
    .filter(t => t.tipo !== 'ingreso')
    .reduce((acc, t) => {
      acc[t.tipo] = (acc[t.tipo] || 0) + t.monto;
      return acc;
    }, {});

  const dataPastel = Object.keys(gastosPorTipo).map(tipo => ({
    name: configTipos[tipo].label,
    tipoId: tipo,
    value: gastosPorTipo[tipo],
    color: configTipos[tipo].color
  }));

  const desgloseCategoria = tipoSeleccionado 
    ? transaccionesMes
        .filter(t => t.tipo === tipoSeleccionado)
        .reduce((acc, t) => {
          acc[t.categoria] = (acc[t.categoria] || 0) + t.monto;
          return acc;
        }, {})
    : {};

  const dataDesglose = Object.keys(desgloseCategoria)
    .map(cat => ({ name: cat, value: desgloseCategoria[cat] }))
    .sort((a, b) => b.value - a.value);

  // 3. Crear tabla comparativa cruzando Mes Actual y Mes Anterior (Incluyendo Ingresos)
  const tablaCategorias = useMemo(() => {
    const mapa = {};

    // Procesar mes actual
    transaccionesMes.forEach(t => {
      if (!mapa[t.categoria]) mapa[t.categoria] = { tipo: t.tipo, actual: 0, anterior: 0 };
      mapa[t.categoria].actual += t.monto;
    });

    // Procesar mes anterior
    transaccionesAnterior.forEach(t => {
      if (!mapa[t.categoria]) mapa[t.categoria] = { tipo: t.tipo, actual: 0, anterior: 0 };
      mapa[t.categoria].anterior += t.monto;
    });

    return Object.entries(mapa)
      .map(([categoria, data]) => {
        const diferencia = data.actual - data.anterior;
        return {
          categoria,
          tipo: data.tipo,
          actual: data.actual,
          anterior: data.anterior,
          diferencia
        };
      })
      .sort((a, b) => b.actual - a.actual); // Ordenar por mayor volumen en el mes actual
  }, [transaccionesMes, transaccionesAnterior]);

  const nombreMesTexto = MESES.find(m => m.valor === mesSeleccionado)?.nombre;

  // Renderizador condicional para la diferencia con colores lógicos
  const renderDiferencia = (item) => {
    if (item.diferencia === 0) return <span className="text-muted">0.00 €</span>;
    
    const isIngreso = item.tipo === 'ingreso';
    const sube = item.diferencia > 0;
    
    // Lógica de color: 
    // + Ingresos = Verde | - Ingresos = Rojo
    // + Gastos = Rojo    | - Gastos = Verde
    const isPositiveBehavior = isIngreso ? sube : !sube;
    const colorClass = isPositiveBehavior ? 'text-success' : 'text-danger';
    const signo = sube ? '+' : '';

    return (
      <span className={`${colorClass} fw-bold`}>
        {signo}{item.diferencia.toFixed(2)} €
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Selector de Periodo */}
      <div className="d-flex justify-content-between align-items-center mb-4 bg-body-tertiary p-3 rounded shadow-sm">
        <h4 className="m-0 text-capitalize">Resumen de {nombreMesTexto} {anioSeleccionado}</h4>
        <div className="d-flex align-items-center gap-2">
          <select 
            className="form-select form-select-sm w-auto"
            value={mesSeleccionado}
            onChange={(e) => { setMesSeleccionado(e.target.value); setTipoSeleccionado(null); }}
          >
            {MESES.map(m => <option key={m.valor} value={m.valor}>{m.nombre}</option>)}
          </select>
          <select 
            className="form-select form-select-sm w-auto"
            value={anioSeleccionado}
            onChange={(e) => { setAnioSeleccionado(e.target.value); setTipoSeleccionado(null); }}
          >
            {aniosDisponibles.map(anio => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center p-4 shadow-sm border-0 border-start border-5" style={{ borderColor: configTipos.ingreso.color }}>
            <h5 className="text-muted mb-2">Total Ingresos</h5>
            <h2 style={{ color: configTipos.ingreso.color }}>{ingresos.toFixed(2)} €</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-4 shadow-sm border-0 border-start border-5" style={{ borderColor: configTipos.gasto_variable.color }}>
            <h5 className="text-muted mb-2">Total Gastos</h5>
            <h2 style={{ color: configTipos.gasto_variable.color }}>{gastos.toFixed(2)} €</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-4 shadow-sm border-0 border-start border-5 border-primary">
            <h5 className="text-muted mb-2">Balance Mensual</h5>
            <h2 className={balance >= 0 ? 'text-primary' : 'text-danger'}>{balance.toFixed(2)} €</h2>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm h-100">
            <h5 className="mb-4 text-center">Ingresos vs Gastos</h5>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataBarras}>
                  <XAxis dataKey="nombre" stroke="#8884d8" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => `${value} €`} />
                  <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm h-100">
            <h5 className="mb-2 text-center">Distribución de Gastos</h5>
            {tipoSeleccionado && (
                <p className="text-muted text-center small mb-4">Detalle de categorías</p>
            )}
            <div className="row align-items-center" style={{ height: 300 }}>
              <div className={tipoSeleccionado ? "col-6 h-100" : "col-12 h-100"}>
                {dataPastel.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={dataPastel} cx="50%" cy="50%" 
                        innerRadius={tipoSeleccionado ? 50 : 70} outerRadius={tipoSeleccionado ? 80 : 100} 
                        paddingAngle={5} dataKey="value"
                        onClick={(data) => setTipoSeleccionado(data.payload.tipoId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {dataPastel.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} €`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex h-100 align-items-center justify-content-center text-muted text-center">
                    No hay gastos este mes.
                  </div>
                )}
              </div>

              {tipoSeleccionado && (
                <div className="col-6" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <h6 className="border-bottom pb-2 mb-3 fw-bold" style={{ color: configTipos[tipoSeleccionado].color }}>
                    {configTipos[tipoSeleccionado].label}
                  </h6>
                  <ul className="list-unstyled m-0">
                    {dataDesglose.map(d => (
                      <li key={d.name} className="d-flex justify-content-between align-items-center mb-2 small">
                        <span className="text-truncate me-2">{d.name}</span>
                        <strong className="text-nowrap">{d.value.toFixed(2)} €</strong>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-sm btn-outline-secondary mt-3 w-100" onClick={() => setTipoSeleccionado(null)}>
                    Volver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Comparativa de Desglose */}
      <div className="row mt-2">
        <div className="col-12 mb-4">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="mb-4">Desglose de Categorías y Comparativa Intermensual</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th className="text-end text-muted">Mes Anterior</th>
                    <th className="text-end">Mes Actual</th>
                    <th className="text-end">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaCategorias.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-medium">{item.categoria}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: configTipos[item.tipo]?.color }}>
                          {configTipos[item.tipo]?.label}
                        </span>
                      </td>
                      <td className="text-end text-muted">{item.anterior.toFixed(2)} €</td>
                      <td className="text-end fw-bold">{item.actual.toFixed(2)} €</td>
                      <td className="text-end">
                        {renderDiferencia(item)}
                      </td>
                    </tr>
                  ))}
                  {tablaCategorias.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No hay datos para comparar en estos periodos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}