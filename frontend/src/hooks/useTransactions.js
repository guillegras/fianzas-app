import { useCallback, useRef, useState } from "react";
import api from "../services/api";

export default function useTransactions() {
    const [transacciones, setTransacciones] = useState([]);
    const [resumenDashboard, setResumenDashboard] = useState(null);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [estadoCarga, setEstadoCarga] = useState("loading");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const currentParamsRef = useRef({
        filtros: {},
        pagina: 1,
        vistaActiva: "dashboard",
    });

    const cargarDatos = useCallback(async (filtros, pagina, vistaActiva) => {
        currentParamsRef.current = { filtros, pagina, vistaActiva };
        setEstadoCarga("loading");
        setError("");
        try {
            if (vistaActiva === "dashboard") {
                const data = await api.getResumen(filtros);
                setResumenDashboard(data);
            } else {
                const params = {
                    ...filtros,
                    limit: 100,
                    offset: (pagina - 1) * 100,
                };
                const data = await api.getTransacciones(params);
                setTransacciones(data.items || []);
                setTotalPaginas(data.total_pages || 1);
            }
            setEstadoCarga("ready");
        } catch {
            setEstadoCarga("error");
            setError("No se han podido cargar los datos.");
        }
    }, []);

    const recargarDatos = useCallback(() => {
        const { filtros, pagina, vistaActiva } = currentParamsRef.current;
        return cargarDatos(filtros, pagina, vistaActiva);
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
        estadoCarga,
        error,
        guardando,
        eliminando,
        cargarDatos,
        guardarTransaccion,
        eliminarTransaccion,
    };
}
