const currencyFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
});

export const formatCurrency = (amount) =>
    currencyFormatter.format(Number(amount) || 0);
