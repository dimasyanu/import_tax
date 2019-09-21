import currency from 'currency.js';

export default function (number, code = null) {
    switch (code) {
        case 'usd':
            return currency(number, {
                separator: ",",
                decimal: ".",
                symbol: "$",
                precision: 2,
                formatWithSymbol: true
            }).format(true);
        case 'idr':
            return currency(number, {
                separator: ".",
                decimal: ",",
                symbol: "Rp.",
                precision: 2,
                formatWithSymbol: true
            }).format(true);
        default:
            return currency(number, {
                separator: ",",
                decimal: ".",
                precision: 2,
            }).format(true);
    }
}