export function formatCurrency(value) {

    if (value >= 1_000_000_000) {
        return Math.floor((value / 1_000_000_000)).toLocaleString() + 'B';  // Billions
    } else if (value >= 1_000_000) {
        return Math.floor((value / 1_000_000)).toLocaleString() + 'M';      // Millions
    } else if (value >= 1_000) {
        return (value).toLocaleString('en-US', 
            { minimumFractionDigits: 2, maximumFractionDigits: 2}
        ); 
    } else if (value < 1 && value > 0) {
        return value.toFixed(10).replace(/\.?0+$/, '');
    } else {
        return value.toLocaleString();
    }

}