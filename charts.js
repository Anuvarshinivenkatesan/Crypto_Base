// CryptoHub - Markets Page JavaScript

let marketsData = [];
let currentFilter = 'all';
let currentSort = 'market_cap_desc';
let currentPage = 1;
const itemsPerPage = 50;

// Initialize markets page
document.addEventListener('DOMContentLoaded', function() {
    initializeMarkets();
    setupMarketEventListeners();
    fetchMarketsData();
    setInterval(fetchMarketsData, 30000); // Update every 30 seconds
});

// Initialize markets components
function initializeMarkets() {
    setupFilters();
    setupSorting();
    setupPagination();
}

// Setup event listeners for markets page
function setupMarketEventListeners() {
    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            updateActiveFilter(this);
            filterAndDisplayMarkets();
        });
    });

    // Sort dropdown
    const sortSelect = document.querySelector('select[data-sort]');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortAndDisplayMarkets();
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleMarketSearch);
    }

    // Watchlist buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.watchlist-btn')) {
            const coinId = e.target.dataset.coinId;
            toggleWatchlist(coinId);
        }
    });
}

// Fetch markets data
async function fetchMarketsData() {
    try {
        marketsData = generateMockMarketsData();
        displayMarkets();
        updateMarketFilters();
    } catch (error) {
        console.error('Error fetching markets data:', error);
        showErrorMessage('Failed to fetch market data');
    }
}

// Generate comprehensive mock markets data
function generateMockMarketsData() {
    const cryptos = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', category: 'layer-1' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', category: 'layer-1' },
        { id: 'binancecoin', name: 'BNB', symbol: 'BNB', category: 'exchange' },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', category: 'layer-1' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', category: 'layer-1' },
        { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', category: 'layer-1' },
        { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', category: 'meme' },
        { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', category: 'layer-1' },
        { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', category: 'oracle' },
        { id: 'polygon', name: 'Polygon', symbol: 'MATIC', category: 'layer-2' },
        { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', category: 'defi' },
        { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', category: 'layer-1' },
        { id: 'algorand', name: 'Algorand', symbol: 'ALGO', category: 'layer-1' },
        { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM', category: 'layer-1' },
        { id: 'filecoin', name: 'Filecoin', symbol: 'FIL', category: 'storage' },
        { id: 'aave', name: 'Aave', symbol: 'AAVE', category: 'defi' },
        { id: 'compound', name: 'Compound', symbol: 'COMP', category: 'defi' },
        { id: 'maker', name: 'Maker', symbol: 'MKR', category: 'defi' },
        { id: 'sushi', name: 'SushiSwap', symbol: 'SUSHI', category: 'defi' },
        { id: 'pancakeswap', name: 'PancakeSwap', symbol: 'CAKE', category: 'defi' },
        { id: 'axie-infinity', name: 'Axie Infinity', symbol: 'AXS', category: 'gaming' },
        { id: 'sandbox', name: 'The Sandbox', symbol: 'SAND', category: 'gaming' },
        { id: 'decentraland', name: 'Decentraland', symbol: 'MANA', category: 'gaming' },
        { id: 'enjin', name: 'Enjin Coin', symbol: 'ENJ', category: 'gaming' },
        { id: 'chiliz', name: 'Chiliz', symbol: 'CHZ', category: 'fan-token' }
    ];

    return cryptos.map((crypto, index) => ({
        ...crypto,
        rank: index + 1,
        price: generateRandomPrice(crypto.symbol),
        change1h: generateRandomChange(2),
        change24h: generateRandomChange(5),
        change7d: generateRandomChange(15),
        marketCap: generateRandomMarketCap(index),
        volume24h: generateRandomVolume(),
        circulatingSupply: generateRandomSupply(),
        totalSupply: generateRandomSupply() * 1.2,
        maxSupply: crypto.symbol === 'BTC' ? 21000000 : null,
        sparklineData: generateSparklineData(),
        isWatchlisted: Math.random() > 0.8
    }));
}

// Display markets data in table
function displayMarkets() {
    const tableBody = document.getElementById('marketsTableBody');
    if (!tableBody) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = marketsData.slice(startIndex, endIndex);

    tableBody.innerHTML = pageData.map(crypto => `
        <tr class="fade-in-up" onclick="viewCoinDetails('${crypto.id}')">
            <td>
                <button class="btn btn-sm watchlist-btn ${crypto.isWatchlisted ? 'text-warning' : 'text-muted'}" 
                        data-coin-id="${crypto.id}" onclick="event.stopPropagation();">
                    <i class="fas fa-star"></i>
                </button>
            </td>
            <td class="fw-bold">${crypto.rank}</td>
            <td>
                <div class="coin-info">
                    <div class="coin-logo">${crypto.symbol.charAt(0)}</div>
                    <div>
                        <div class="coin-name">${crypto.name}</div>
                        <div class="coin-symbol">${crypto.symbol}</div>
                    </div>
                </div>
            </td>
            <td class="fw-bold">$${formatPrice(crypto.price)}</td>
            <td class="${crypto.change1h >= 0 ? 'price-positive' : 'price-negative'}">
                <i class="fas fa-arrow-${crypto.change1h >= 0 ? 'up' : 'down'}"></i>
                ${Math.abs(crypto.change1h).toFixed(2)}%
            </td>
            <td class="${crypto.change24h >= 0 ? 'price-positive' : 'price-negative'}">
                <i class="fas fa-arrow-${crypto.change24h >= 0 ? 'up' : 'down'}"></i>
                ${Math.abs(crypto.change24h).toFixed(2)}%
            </td>
            <td class="${crypto.change7d >= 0 ? 'price-positive' : 'price-negative'}">
                <i class="fas fa-arrow-${crypto.change7d >= 0 ? 'up' : 'down'}"></i>
                ${Math.abs(crypto.change7d).toFixed(2)}%
            </td>
            <td>$${formatLargeNumber(crypto.marketCap)}</td>
            <td>$${formatLargeNumber(crypto.volume24h)}</td>
            <td>${formatLargeNumber(crypto.circulatingSupply)} ${crypto.symbol}</td>
            <td>
                <canvas class="sparkline" width="100" height="40" data-sparkline='${JSON.stringify(crypto.sparklineData)}'></canvas>
            </td>
        </tr>
    `).join('');

    // Draw sparklines
    drawSparklines();
    updatePaginationInfo();
}

// Filter and display markets
function filterAndDisplayMarkets() {
    let filteredData = marketsData;

    if (currentFilter === 'gainers') {
        filteredData = marketsData.filter(crypto => crypto.change24h > 0)
                                 .sort((a, b) => b.change24h - a.change24h);
    } else if (currentFilter === 'losers') {
        filteredData = marketsData.filter(crypto => crypto.change24h < 0)
                                 .sort((a, b) => a.change24h - b.change24h);
    }

    marketsData = filteredData;
    currentPage = 1;
    displayMarkets();
}

// Sort and display markets
function sortAndDisplayMarkets() {
    const [field, direction] = currentSort.split('_');
    
    marketsData.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];
        
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }
        
        if (direction === 'desc') {
            return valueB > valueA ? 1 : -1;
        } else {
            return valueA > valueB ? 1 : -1;
        }
    });
    
    displayMarkets();
}

// Handle market search
function handleMarketSearch(event) {
    const query = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#marketsTableBody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('.coin-name')?.textContent.toLowerCase() || '';
        const symbol = row.querySelector('.coin-symbol')?.textContent.toLowerCase() || '';
        
        if (name.includes(query) || symbol.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Toggle watchlist
function toggleWatchlist(coinId) {
    const crypto = marketsData.find(c => c.id === coinId);
    if (crypto) {
        crypto.isWatchlisted = !crypto.isWatchlisted;
        
        // Update localStorage
        let watchlist = JSON.parse(localStorage.getItem('cryptoWatchlist')) || [];
        if (crypto.isWatchlisted) {
            watchlist.push(coinId);
            showSuccessMessage(`${crypto.name} added to watchlist`);
        } else {
            watchlist = watchlist.filter(id => id !== coinId);
            showSuccessMessage(`${crypto.name} removed from watchlist`);
        }
        localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
        
        // Update button appearance
        const button = document.querySelector(`[data-coin-id="${coinId}"]`);
        if (button) {
            button.className = `btn btn-sm watchlist-btn ${crypto.isWatchlisted ? 'text-warning' : 'text-muted'}`;
        }
    }
}

// Setup filters
function setupFilters() {
    // Initialize filter buttons
    updateActiveFilter(document.querySelector('[data-filter="all"]'));
}

// Setup sorting
function setupSorting() {
    // Initialize sort dropdown
    const sortSelect = document.querySelector('select[data-sort]');
    if (sortSelect) {
        sortSelect.value = currentSort;
    }
}

// Setup pagination
function setupPagination() {
    // Initialize pagination controls
    updatePaginationInfo();
}

// Update active filter button
function updateActiveFilter(activeButton) {
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove('active');
    });
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Update market filters based on data
function updateMarketFilters() {
    const gainers = marketsData.filter(crypto => crypto.change24h > 0).length;
    const losers = marketsData.filter(crypto => crypto.change24h < 0).length;
    
    // Update filter button badges if they exist
    const gainersBtn = document.querySelector('[data-filter="gainers"]');
    const losersBtn = document.querySelector('[data-filter="losers"]');
    
    if (gainersBtn) gainersBtn.innerHTML = `Gainers <span class="badge bg-success ms-1">${gainers}</span>`;
    if (losersBtn) losersBtn.innerHTML = `Losers <span class="badge bg-danger ms-1">${losers}</span>`;
}

// Update pagination info
function updatePaginationInfo() {
    const totalPages = Math.ceil(marketsData.length / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, marketsData.length);
    
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${marketsData.length} results`;
    }
    
    // Update pagination buttons
    updatePaginationButtons(totalPages);
}

// Update pagination buttons
function updatePaginationButtons(totalPages) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    pagination.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
        ${generatePageNumbers(totalPages)}
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
}

// Generate page numbers for pagination
function generatePageNumbers(totalPages) {
    let pages = '';
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    return pages;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(marketsData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayMarkets();
    }
}

// Draw sparklines (reuse from main.js)
function drawSparklines() {
    document.querySelectorAll('.sparkline').forEach(canvas => {
        const data = JSON.parse(canvas.dataset.sparkline);
        drawSparkline(canvas, data);
    });
}

function drawSparkline(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (data.length < 2) return;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const xStep = width / (data.length - 1);
    
    ctx.strokeStyle = data[data.length - 1] > data[0] ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = index * xStep;
        const y = height - ((value - min) / range) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

// View coin details
function viewCoinDetails(coinId) {
    console.log('Viewing details for:', coinId);
    showSuccessMessage(`Loading details for ${coinId}...`);
}

// Utility functions (reuse from main.js if available, otherwise define here)
function generateRandomPrice(symbol) {
    const basePrices = {
        'BTC': 43000, 'ETH': 2400, 'BNB': 320, 'ADA': 0.85, 'SOL': 95,
        'DOT': 12, 'DOGE': 0.18, 'AVAX': 45, 'LINK': 18, 'MATIC': 1.2,
        'UNI': 8.5, 'LTC': 95, 'ALGO': 0.75, 'ATOM': 15, 'FIL': 25,
        'AAVE': 85, 'COMP': 65, 'MKR': 1200, 'SUSHI': 3.2, 'CAKE': 4.8,
        'AXS': 45, 'SAND': 2.1, 'MANA': 1.8, 'ENJ': 1.5, 'CHZ': 0.12
    };
    
    const basePrice = basePrices[symbol] || Math.random() * 100;
    const variation = (Math.random() - 0.5) * 0.1;
    return basePrice * (1 + variation);
}

function generateRandomChange(maxChange = 10) {
    return (Math.random() - 0.5) * maxChange * 2;
}

function generateRandomMarketCap(rank) {
    const baseCap = Math.max(1000000000, 1000000000000 / Math.pow(rank + 1, 1.5));
    const variation = (Math.random() - 0.5) * 0.2;
    return baseCap * (1 + variation);
}

function generateRandomVolume() {
    return Math.random() * 10000000000;
}

function generateRandomSupply() {
    return Math.random() * 1000000000;
}

function generateSparklineData() {
    const data = [];
    let price = 100;
    
    for (let i = 0; i < 24; i++) {
        price += (Math.random() - 0.5) * 10;
        data.push(Math.max(0, price));
    }
    
    return data;
}

function formatPrice(price) {
    if (price >= 1) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        return price.toFixed(6);
    }
}

function formatLargeNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0 position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 5000);
}

function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0 position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 5000);
}