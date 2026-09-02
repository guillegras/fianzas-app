import { describe, expect, it } from "vitest";
import {
    filterTransactions,
    getTotalExpenses,
    getTransactionCategory,
    summarizeTransactions,
} from "./transactions";

const transactions = [
    { id: 1, tipo: "ingreso", categoria: "Nomina", monto: 2000, fecha: "2026-01-05" },
    { id: 2, tipo: "gasto_fijo", categoria: "Alquiler", monto: 800, fecha: "2026-01-10" },
    { id: 3, tipo: "gasto_variable", titulo: "Ocio", monto: 120.5, fecha: "2026-02-02" },
    { id: 4, tipo: "inversion", categoria: "Cartera inversión", monto: 300, fecha: "2026-01-20" },
];

describe("filterTransactions", () => {
    it("filtra por tipo, categoria, importe y fecha", () => {
        const result = filterTransactions(transactions, {
            tipo: "gasto_fijo",
            categoria: "Alquiler",
            montoMin: "500",
            montoMax: "900",
            fechaInicio: "2026-01-01",
            fechaFin: "2026-01-31",
        });

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(2);
    });

    it("acepta el mes y año sin convertir la fecha a Date", () => {
        const result = filterTransactions(transactions, { mes: "02", anio: "2026" });
        expect(result.map((transaction) => transaction.id)).toEqual([3]);
    });

    it("devuelve vacío para rangos imposibles", () => {
        expect(filterTransactions(transactions, { montoMin: "900", montoMax: "100" })).toEqual([]);
        expect(filterTransactions(transactions, { fechaInicio: "2026-03-01", fechaFin: "2026-02-01" })).toEqual([]);
    });
});

describe("resumen financiero", () => {
    it("agrupa los importes por tipo y calcula los gastos", () => {
        const summary = summarizeTransactions(transactions);

        expect(summary).toEqual({
            ingresos: 2000,
            gastosFijos: 800,
            gastosVariables: 120.5,
            inversiones: 300,
            deudas: 0,
        });
        expect(getTotalExpenses(summary)).toBe(1220.5);
    });

    it("usa titulo como fallback de categoria", () => {
        expect(getTransactionCategory({ titulo: "Ocio" })).toBe("Ocio");
        expect(getTransactionCategory({})).toBe("Sin categoría");
    });
});