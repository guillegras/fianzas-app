export const getTransactionAmount = (transaction) => Number(transaction.monto) || 0;

export const getTransactionCategory = (transaction) =>
    transaction.categoria || transaction.titulo || "Sin categoría";

export const filterTransactions = (transactions, filters) => {
    const {
        tipo = "",
        categoria = "",
        montoMin = "",
        montoMax = "",
        mes = "",
        anio = "",
        fechaInicio = "",
        fechaFin = "",
    } = filters;

    const rangosInvalidos =
        montoMin !== "" && montoMax !== "" && Number(montoMin) > Number(montoMax) ||
        fechaInicio !== "" && fechaFin !== "" && fechaInicio > fechaFin;

    if (rangosInvalidos) return [];

    return transactions.filter((transaction) => {
        const transactionType = transaction.tipo || "";
        const transactionDate = transaction.fecha || "";
        const [transactionYear, transactionMonth] = transactionDate.split("-");
        const amount = getTransactionAmount(transaction);
        const category = transaction.categoria || transaction.titulo || "";

        return (
            (!tipo || transactionType === tipo) &&
            (!categoria || category === categoria) &&
            (montoMin === "" || amount >= Number(montoMin)) &&
            (montoMax === "" || amount <= Number(montoMax)) &&
            (!anio || transactionYear === anio) &&
            (!mes || transactionMonth === mes) &&
            (!fechaInicio || transactionDate >= fechaInicio) &&
            (!fechaFin || transactionDate <= fechaFin)
        );
    });
};

export const summarizeTransactions = (transactions) =>
    transactions.reduce(
        (summary, transaction) => {
            const amount = getTransactionAmount(transaction);
            const type = transaction.tipo;

            if (type === "ingreso") summary.ingresos += amount;
            if (type === "gasto_fijo") summary.gastosFijos += amount;
            if (type === "gasto_variable") summary.gastosVariables += amount;
            if (type === "inversion") summary.inversiones += amount;
            if (type === "deuda") summary.deudas += amount;

            return summary;
        },
        {
            ingresos: 0,
            gastosFijos: 0,
            gastosVariables: 0,
            inversiones: 0,
            deudas: 0,
        },
    );

export const getTotalExpenses = (summary) =>
    summary.gastosFijos +
    summary.gastosVariables +
    summary.inversiones +
    summary.deudas;
