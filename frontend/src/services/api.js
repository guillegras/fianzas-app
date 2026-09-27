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
        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "NaN" &&
            value !== "null" &&
            value !== "undefined"
        ) {
            qs.append(key, String(value).trim());
        }
    });
    const string = qs.toString();
    return string ? `?${string}` : "";
};

export const exportarTransaccionesCSV = async (params = {}) => {
    // Exclude pagination params so it exports all filtered results
    const cleanParams = { ...params };
    delete cleanParams.limit;
    delete cleanParams.offset;

    const qs = buildQuery(cleanParams);
    const response = await fetch(`${API_URL}/transacciones/exportar-csv${qs}`);
    if (!response.ok) {
        throw new Error("No se ha podido generar el archivo CSV.");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimientos_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

export const importarTransaccionesCSV = async (file) => {
    const formData = new FormData();
    formData.append("archivo", file);

    const response = await fetch(`${API_URL}/transacciones/importar-csv`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        let message = `Error al importar (${response.status})`;
        try {
            const body = await response.json();
            message = body.detail || message;
        } catch {}
        throw new Error(message);
    }

    return response.json();
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
    actualizarTransaccion: (id, transaccionData) =>
        request(`/transacciones/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaccionData),
        }),
    eliminarTransaccion: (id) =>
        request(`/transacciones/${encodeURIComponent(id)}`, {
            method: "DELETE",
        }),
    exportarCSV: exportarTransaccionesCSV,
    importarCSV: importarTransaccionesCSV,
};

export default api;
