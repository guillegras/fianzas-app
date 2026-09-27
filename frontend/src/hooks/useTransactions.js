import { useCallback, useRef, useState } from "react";
import api from "../services/api";

export default function useTransactions() {
    const [transacciones, setTransacciones] = useState([]);
    const [resumenDashboard, setResumenDashboard] = useState(null);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [estadoCarga, setEstadoCarga] = useState("loading");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const currentParamsRef = useRef({
        filtros: {},
        pagina: 1,
        vistaActiva: "dashboard",
        limite: 25,
    });

    const cargarDatos = useCallback(async (filtros, pagina, vistaActiva, limite = 25) => {
        currentParamsRef.current = { filtros, pagina, vistaActiva, limite };
        setEstadoCarga("loading");
        setError("");
        try {
            if (vistaActiva === "dashboard") {
                const data = await api.getResumen(filtros);
                setResumenDashboard(data);
            } else {
                const params = {
                    ...filtros,
                    limit: limite,
                    offset: (pagina - 1) * limite,
                };
                const data = await api.getTransacciones(params);
                setTransacciones(data.items || []);
                setTotalPaginas(data.total_pages || 1);
                setTotalItems(
                    typeof data.total_items === "number"
                        ? data.total_items
                        : (data.items || []).length,
                );
            }
            setEstadoCarga("ready");
        } catch {
            setEstadoCarga("error");
            setError("No se han podido cargar los datos.");
        }
    }, []);

    const recargarDatos = useCallback(() => {
        const { filtros, pagina, vistaActiva, limite } = currentParamsRef.current;
        return cargarDatos(filtros, pagina, vistaActiva, limite);
    }, [cargarDatos]);

    const guardarTransaccion = useCallback(
        async (transaccion) => {
            setGuardando(true);
            setError("");
            try {
                await api.crearTransaccion(transaccion);
                await recargarDatos();
            } catch (requestError) {
                setError("No se ha podido guardar el movimiento.");
                throw requestError;
            } finally {
                setGuardando(false);
            }
        },
        [recargarDatos],
    );

    const actualizarTransaccion = useCallback(
        async (id, transaccion) => {
            setGuardando(true);
            setError("");
            try {
                await api.actualizarTransaccion(id, transaccion);
                await recargarDatos();
            } catch (requestError) {
                setError("No se ha podido actualizar el movimiento.");
                throw requestError;
            } finally {
                setGuardando(false);
            }
        },
        [recargarDatos],
    );

    const eliminarTransaccion = useCallback(
        async (id) => {
            setEliminando(true);
            setError("");
            try {
                await api.eliminarTransaccion(id);
                await recargarDatos();
            } catch {
                setError("No se ha podido eliminar el movimiento.");
            } finally {
                setEliminando(false);
            }
        },
        [recargarDatos],
    );

    return {
        transacciones,
        resumenDashboard,
        totalPaginas,
        totalItems,
        estadoCarga,
        error,
        guardando,
        eliminando,
        cargarDatos,
        guardarTransaccion,
        actualizarTransaccion,
        eliminarTransaccion,
    };
}
