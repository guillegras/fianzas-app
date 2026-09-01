const API_URL = "http://localhost:8000";

const api = {};

// Obtener todas las transacciones
api.getTransacciones = async () => {
    const response = await fetch(`${API_URL}/transacciones/`);
    if (!response.ok) throw new Error("Error al obtener las transacciones");
    return await response.json();
};

// Crear una nueva transacción (Ingreso, Gasto, etc.)
api.crearTransaccion = async (transaccionData) => {
    const response = await fetch(`${API_URL}/transacciones/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transaccionData),
    });
    if (!response.ok) throw new Error("Error al crear la transacción");
    return await response.json();
};

api.eliminarTransaccion = async (id) => {
  const response = await fetch(`http://localhost:8000/transacciones/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error("Error al eliminar");
  return response.json();
}

export default api;