import { useState, useEffect } from 'react';
import api from './services/api';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';

export default function App() {
  const [transacciones, setTransacciones] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('dashboard'); // 'dashboard' o 'movimientos'

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const cargarDatos = async () => {
    try {
      const data = await api.getTransacciones();
      setTransacciones(data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleGuardarTransaccion = async (nuevaTransaccion) => {
    try {
      await api.crearTransaccion(nuevaTransaccion);
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const handleEliminarTransaccion = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este movimiento?")) {
      try {
        await api.eliminarTransaccion(id);
        cargarDatos();
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  };

  return (
    <div className="container my-5">
      {/* Cabecera Principal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mi Gestor Financiero Personal</h1>
        <div>
          <button className="btn btn-primary me-3" onClick={() => setShowModal(true)}>
            ➕ Nueva Transacción
          </button>
          <button className={`btn btn-${darkMode ? 'light' : 'dark'}`} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${vistaActiva === 'dashboard' ? 'active font-weight-bold' : ''}`}
            onClick={() => setVistaActiva('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            📊 Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${vistaActiva === 'movimientos' ? 'active font-weight-bold' : ''}`}
            onClick={() => setVistaActiva('movimientos')}
            style={{ cursor: 'pointer' }}
          >
            📝 Movimientos
          </button>
        </li>
      </ul>
      
      {/* Renderizado condicional de la vista */}
      <div className="row">
        <div className="col-12">
          {vistaActiva === 'dashboard' ? (
            <Dashboard transacciones={transacciones} />
          ) : (
            <TransactionList transacciones={transacciones} onEliminar={handleEliminarTransaccion} />
          )}
        </div>
      </div>

      {/* Modal de Nueva Transacción */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Añadir Movimiento</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <TransactionForm onGuardar={handleGuardarTransaccion} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}