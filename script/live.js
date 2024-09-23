// https://api.binance.com/api/v3/ticker/price  // Binance REST API
// https://api.coingecko.com/api/v3/coins/markets // Coingecko API

import { displayCrypto } from "./ranking.js";

const fetchCryptoData = async (query) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1
            }
        })
        const allCoins = response.data
        
        const filteredCoins = allCoins.filter(coin => coin.name.toLowerCase().
            includes(query.toLowerCase()) || coin.symbol.toLowerCase().includes(query.toLowerCase()));
            
        displayCrypto(filteredCoins, 'Search Results', '.js-crypto-list-search')

            
    } catch(err) {
        console.log('Error fetching crypto data', err);
    }
}
const formEle = document.querySelector('.js-search-form');
        
    formEle.addEventListener('submit', async (event) => {
        event.preventDefault()
        const cryptoSearch = formEle.elements.query.value.trim();

        const displaySearch = document.querySelector('.crypto-list-search');
    
        if (cryptoSearch) {
            await fetchCryptoData(cryptoSearch)
        } else {
            document.querySelector('.crypto-list-onload').innerHTML = '';
        }
        formEle.reset()
        displaySearch.style.display = 'flex'
        document.querySelector('.js-crypto-live-price').innerHTML = '';
        document.querySelector('.js-live-coin-image').innerHTML = '';

    })


async function fetchCryptoLiveData() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,ethereum,solana,binancecoin,ripple',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1
            }
        });
    
        const cryptoData = response.data;
    
        cryptoData.forEach((coin) => {
            createCryptoImage(coin);
        })
    } catch(err) {
        console.log('Error fetching crypto data:', err);
    }
    
};

function createCryptoElement(symbol) {
    const container = document.querySelector('.js-crypto-live-price');

    const cryptoItem = document.createElement('div');
    cryptoItem.classList.add('crypto-live-item');
    cryptoItem.id = `crypto-${symbol}`;

    cryptoItem.innerHTML = `
        <h3 class="real-time-name">${symbol}</h3>
        <p class="real-time-price">Price: US$<span id="price-${symbol}" class="price-neutral">
        Loading...</span></p>`;
    
    container.appendChild(cryptoItem);
}

function createCryptoImage(coin) {
    const container = document.querySelector('.live-coin-image');

    const cryptoItem = document.createElement('div');
    cryptoItem.classList.add('crypto-image-item');

    cryptoItem.innerHTML = `
        <img src="${coin.image}" alt="${coin.name} logo">`;
    
    container.appendChild(cryptoItem);
}

function updateCryptoPrice(symbol, newPrice) {

    const priceEle = document.getElementById(`price-${symbol}`);

    if (!priceEle) return;

    const currentPrice = parseFloat(priceEle.innerText);

    if (newPrice > currentPrice) {
        priceEle.classList.remove('price-neutral');
        priceEle.classList.add('price-up');
    } else if (newPrice < currentPrice) {
        priceEle.classList.remove('price-up');
        priceEle.classList.add('price-down');
    }

    priceEle.innerText = newPrice
}

function connectWebSocket() {
    const symbols = ['btcusdt','ethusdt','bnbusdt','solusdt','xrpusdt']

    symbols.forEach((symbol) => {
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
    
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const price = parseFloat(data.p).toFixed(4).replace(/\.?0+$/, '');
    
            updateCryptoPrice(symbol.toUpperCase(), price);
        };
        createCryptoElement(symbol.toUpperCase());
    });
}

connectWebSocket();
fetchCryptoLiveData();
