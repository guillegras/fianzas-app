export const API_URL = (
    import.meta.env.VITE_API_URL !== undefined
        ? import.meta.env.VITE_API_URL
        : (import.meta.env.DEV ? "http://localhost:8001" : "")
).replace(/\/$/, "");

const request = async (path, options = {}) => {
    const config = { ...options };

    if (!config.method || config.method === "GET") {
        config.cache = "no-store";
        config.headers = {
            ...config.headers,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
        };
    }

    const response = await fetch(`${API_URL}${path}`, config);
    if (!response.ok) {
        let message = `Error HTTP ${response.status}`;
        try {
            const body = await response.json();
            message = body.detail || message;
        } catch {}
        throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
};

const buildQuery = (params) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) qs.append(key, value);
    });
    const string = qs.toString();
    return string ? `?${string}` : "";
};

const api = {
    getTransacciones: (params = {}, options = {}) =>
        request(`/transacciones/${buildQuery(params)}`, options),
    getResumen: (params = {}, options = {}) =>
        request(`/transacciones/resumen${buildQuery(params)}`, options),
    crearTransaccion: (transaccionData) =>
        request("/transacciones/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaccionData),
        }),
    eliminarTransaccion: (id) =>
        request(`/transacciones/${encodeURIComponent(id)}`, {
            method: "DELETE",
        }),
};

export default api;
