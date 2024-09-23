import { cryptoHomeData } from "./app.js";
import { formatCurrency } from "./money.js";

cryptoHomeData()


const fetchHighLowCrypto = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 20,
                page: 1
            }
        });
        const hiLowData = response.data

        displayHiLow(hiLowData, 'Top 20 today high and low prices.', '.js-crypto-high-low')
    } catch(error) {
        console.log('Error fetching crypto data', error);
    }
    
}
const displayHiLow = (cryptoList, sectionTitle, containerClass) => {

    const cryptoContainer = document.querySelector(containerClass);
    cryptoContainer.innerHTML = `
    <h3 class="section-title js-section-title">${sectionTitle}</h3>`;

    if (cryptoList.length === 0) {
        cryptoContainer.innerHTML = '<p>No crypto currency found</p>';
    }

    cryptoList.forEach((coin) => {
        const highLowEle = createHighLowElement(coin);
        cryptoContainer.appendChild(highLowEle);
    });


}
const createHighLowElement = (coin) => {
    const highLowEle = document.createElement('div');
    highLowEle.classList.add('crypto-item');

    let priceClass = 'no-change';
    const priceChange = coin.price_change_percentage_24h;
    if (priceChange > 0) {
        priceClass = 'price-up';
    } else if (priceChange < 0) {
        priceClass = 'price-down';
    }

    highLowEle.innerHTML = `
    <img src="${coin.image}" alt="${coin.name} logo" style="width: 50px; height: 50px;">
    <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>

    <div class="crypto-info-high">
    <p class="${priceClass}">High: US$${formatCurrency(coin.high_24h)}</p>
    </div>
    <div class="crypto-info-low">
    <p class="${priceClass}">Low: US$${formatCurrency(coin.low_24h)}</p>
    </div>
    <div class="crypto-info-change">
    <p class="${priceClass}">Change : ${(priceChange ?? 0).toFixed(2)}%</p>
    </div>
    `;
    return highLowEle
}

fetchHighLowCrypto()
