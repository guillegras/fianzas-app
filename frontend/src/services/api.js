const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, options);
    if (!response.ok) {
        let message = `Error HTTP ${response.status}`;
        try {
            const body = await response.json();
            message = body.detail || message;
        } catch {
            // Mantener el mensaje HTTP cuando la respuesta no es JSON.
        }
        throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
};

const api = {
    getTransacciones: (options) => request("/transacciones/", options),
    crearTransaccion: (transaccionData) =>
        request("/transacciones/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transaccionData),
        }),
    eliminarTransaccion: (id) =>
        request(`/transacciones/${encodeURIComponent(id)}`, {
            method: "DELETE",
        }),
};

export default api;
