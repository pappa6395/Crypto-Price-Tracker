'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'  // coingecko demo
// myKey = 'CG-UJWEPzo8LFVLy9Gsb1RcKKE8' // coingecko

import { displayCrypto } from "./ranking.js";

export function cryptoHomeData() {

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
    
        if (cryptoSearch) {
            await fetchCryptoData(cryptoSearch)
        } else {
            document.querySelector('.crypto-list-onload').innerHTML = '';
        }
        formEle.reset()
        document.querySelector('.js-crypto-list-onload').innerHTML = '';
        document.querySelector('.js-top-coin-onload').innerHTML = '';
        document.querySelector('.js-crypto-high-low').innerHTML = '';
        
    })

}

document.addEventListener('DOMContentLoader', () => {
    const dropDownBtn = document.querySelector('.js-drop-down-btn');
    const dropDownContents = document.querySelector('.js-drop-down-contents');
    const homeNav = document.querySelector('#js-home');
    const topPrice = document.querySelector('#js-top-price');
    const highLowPrice = document.querySelector('#js-crypto-high-low');
    const livePrice = document.querySelector('#js-live');

    dropDownBtn.addEventListener('mouseover', (event) => {
        event.preventDefault();
        dropDownContents.classList.toggle('show')
    })
    
    homeNav.addEventListener('click',(e) => {
        e.preventDefault()
        window.location.href = 'index.html'
    })

    topPrice.addEventListener('click',(e) => {
        e.preventDefault()
        window.location.href = 'TopPrice.html'
    })

    highLowPrice.addEventListener('click',(e) => {
        e.preventDefault()
        window.location.href = 'highLowPrice.html'
    })

    livePrice.addEventListener('click',(e) => {
        e.preventDefault()
        window.location.href = 'live.html'
    })

})