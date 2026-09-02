import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export default function useTransactions() {
    const [transacciones, setTransacciones] = useState([]);
    const [estadoCarga, setEstadoCarga] = useState("loading");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const cargarDatos = useCallback(async (signal) => {
        setEstadoCarga("loading");
        setError("");
        try {
            const data = await api.getTransacciones({ signal });
            setTransacciones(data);
            setEstadoCarga("ready");
        } catch (requestError) {
            if (requestError.name === "AbortError") return;
            setEstadoCarga("error");
            setError("No se han podido cargar los movimientos.");
            console.error("Error cargando datos:", requestError);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        queueMicrotask(() => cargarDatos(controller.signal));
        return () => controller.abort();
    }, [cargarDatos]);

    const guardarTransaccion = useCallback(async (transaccion) => {
        setGuardando(true);
        setError("");
        try {
            await api.crearTransaccion(transaccion);
            await cargarDatos();
        } catch (requestError) {
            setError("No se ha podido guardar el movimiento.");
            console.error("Error guardando:", requestError);
            throw requestError;
        } finally {
            setGuardando(false);
        }
    }, [cargarDatos]);

    const eliminarTransaccion = useCallback(async (id) => {
        setEliminando(true);
        setError("");
        try {
            await api.eliminarTransaccion(id);
            await cargarDatos();
        } catch (requestError) {
            setError("No se ha podido eliminar el movimiento.");
            console.error("Error eliminando:", requestError);
        } finally {
            setEliminando(false);
        }
    }, [cargarDatos]);

    return {
        transacciones,
        estadoCarga,
        error,
        guardando,
        eliminando,
        cargarDatos,
        guardarTransaccion,
        eliminarTransaccion,
    };
}
