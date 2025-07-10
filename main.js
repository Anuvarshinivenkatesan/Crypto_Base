// CryptoHub - Main Dashboard JavaScript

// Global variables
let cryptoData = [];
let marketData = {};
let priceAlerts = [];
let watchlist = JSON.parse(localStorage.getItem('cryptoWatchlist')) || [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    fetchCryptoData();
    setInterval(fetchCryptoData, 30000); // Update every 30 seconds
});

// Initialize dashboard components
function initializeDashboard() {
    updateGlobalStats();
    createMarketTrendChart();
    createFearGreedChart();
    loadNewsData();
    loadTrendingData();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Timeframe buttons
    document.querySelectorAll('[data-timeframe]').forEach(button => {
        button.addEventListener('click', function() {
            const timeframe = this.dataset.timeframe;
            updateActiveButton(this);
            // Update charts with new timeframe
            updateMarketTrendChart(timeframe);
        });
    });
}

// Fetch cryptocurrency data (simulated API call)
async function fetchCryptoData() {
    try {
        // Simulate API response with realistic crypto data
        cryptoData = generateMockCryptoData();
        updateCryptoTable();
        updateGlobalStats();
        updatePriceAlerts();
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        showErrorMessage('Failed to fetch cryptocurrency data');
    }
}

// Generate mock cryptocurrency data
function generateMockCryptoData() {
    const cryptos = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2 },
        { id: 'binancecoin', name: 'BNB', symbol: 'BNB', rank: 3 },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', rank: 4 },
        { id: 'solana', name: 'Solana', symbol: 'SOL', rank: 5 },
        { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', rank: 6 },
        { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', rank: 7 },
        { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', rank: 8 },
        { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', rank: 9 },
        { id: 'polygon', name: 'Polygon', symbol: 'MATIC', rank: 10 }
    ];

    return cryptos.map(crypto => ({
        ...crypto,
        price: generateRandomPrice(crypto.symbol),
        change24h: generateRandomChange(),
        change7d: generateRandomChange(),
        marketCap: generateRandomMarketCap(),
        volume24h: generateRandomVolume(),
        circulatingSupply: generateRandomSupply(),
        sparklineData: generateSparklineData()
    }));
}

// Generate random price based on crypto
function generateRandomPrice(symbol) {
    const basePrices = {
        'BTC': 43000,
        'ETH': 2400,
        'BNB': 320,
        'ADA': 0.85,
        'SOL': 95,
        'DOT': 12,
        'DOGE': 0.18,
        'AVAX': 45,
        'LINK': 18,
        'MATIC': 1.2
    };
    
    const basePrice = basePrices[symbol] || 100;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return basePrice * (1 + variation);
}

// Generate random percentage change
function generateRandomChange() {
    return (Math.random() - 0.5) * 20; // ±10% change
}

// Generate random market cap
function generateRandomMarketCap() {
    return Math.random() * 500000000000; // Up to $500B
}

// Generate random volume
function generateRandomVolume() {
    return Math.random() * 50000000000; // Up to $50B
}

// Generate random supply
function generateRandomSupply() {
    return Math.random() * 1000000000; // Up to 1B tokens
}

// Generate sparkline data
function generateSparklineData() {
    const data = [];
    let price = 100;
    
    for (let i = 0; i < 24; i++) {
        price += (Math.random() - 0.5) * 10;
        data.push(Math.max(0, price));
    }
    
    return data;
}

// Update cryptocurrency table
function updateCryptoTable() {
    const tableBody = document.getElementById('cryptoTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = cryptoData.map(crypto => `
        <tr class="fade-in-up" onclick="viewCoinDetails('${crypto.id}')">
            <td>${crypto.rank}</td>
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
            <td>
                <canvas class="sparkline" width="100" height="40" data-sparkline='${JSON.stringify(crypto.sparklineData)}'></canvas>
            </td>
        </tr>
    `).join('');

    // Draw sparklines
    drawSparklines();
}

// Update global market statistics
function updateGlobalStats() {
    if (cryptoData.length === 0) return;

    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume24h, 0);
    const btcDominance = cryptoData.find(c => c.symbol === 'BTC')?.marketCap / totalMarketCap * 100 || 0;

    updateElementText('totalMarketCap', '$' + formatLargeNumber(totalMarketCap));
    updateElementText('totalVolume', '$' + formatLargeNumber(totalVolume));
    updateElementText('btcDominance', btcDominance.toFixed(1) + '%');
    updateElementText('activeCryptos', '2,847');
}

// Create market trend chart
function createMarketTrendChart() {
    const ctx = document.getElementById('marketTrendChart');
    if (!ctx) return;

    const data = generateMarketTrendData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Total Market Cap',
                data: data.values,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
}

// Create Fear & Greed Index chart
function createFearGreedChart() {
    const ctx = document.getElementById('fearGreedChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [65, 35],
                backgroundColor: ['#f59e0b', '#374151'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Generate market trend data
function generateMarketTrendData() {
    const labels = [];
    const values = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString());
        values.push(1200000000000 + Math.random() * 200000000000); // $1.2T ± $200B
    }
    
    return { labels, values };
}

// Draw sparkline charts
function drawSparklines() {
    document.querySelectorAll('.sparkline').forEach(canvas => {
        const data = JSON.parse(canvas.dataset.sparkline);
        drawSparkline(canvas, data);
    });
}

// Draw individual sparkline
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

// Load news data
function loadNewsData() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;

    const mockNews = [
        {
            title: 'Bitcoin Reaches New All-Time High',
            summary: 'Institutional adoption drives Bitcoin to unprecedented levels...',
            time: '2 hours ago',
            source: 'CoinDesk'
        },
        {
            title: 'Ethereum 2.0 Staking Rewards Increase',
            summary: 'Latest update brings improved rewards for validators...',
            time: '4 hours ago',
            source: 'Ethereum Foundation'
        },
        {
            title: 'Major Exchange Adds DeFi Support',
            summary: 'Leading cryptocurrency exchange announces DeFi integration...',
            time: '6 hours ago',
            source: 'CryptoNews'
        }
    ];

    newsContainer.innerHTML = mockNews.map(news => `
        <div class="news-item">
            <h6 class="text-white mb-2">${news.title}</h6>
            <p class="text-muted small mb-2">${news.summary}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">${news.source}</small>
                <small class="text-muted">${news.time}</small>
            </div>
        </div>
    `).join('');
}

// Load trending cryptocurrencies
function loadTrendingData() {
    const trendingContainer = document.getElementById('trendingCryptos');
    if (!trendingContainer) return;

    const trending = cryptoData.slice(0, 5);
    
    trendingContainer.innerHTML = trending.map((crypto, index) => `
        <div class="trending-item d-flex align-items-center mb-3">
            <span class="trending-rank me-2">${index + 1}</span>
            <div class="coin-logo me-2">${crypto.symbol.charAt(0)}</div>
            <div class="flex-grow-1">
                <div class="fw-bold text-white">${crypto.name}</div>
                <small class="text-muted">$${formatPrice(crypto.price)}</small>
            </div>
            <div class="text-end">
                <div class="${crypto.change24h >= 0 ? 'price-positive' : 'price-negative'}">
                    <i class="fas fa-arrow-${crypto.change24h >= 0 ? 'up' : 'down'}"></i>
                    ${Math.abs(crypto.change24h).toFixed(2)}%
                </div>
            </div>
        </div>
    `).join('');
}

// Handle search functionality
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#cryptoTableBody tr');
    
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

// Update active button state
function updateActiveButton(activeButton) {
    const buttonGroup = activeButton.parentElement;
    buttonGroup.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Update market trend chart with new timeframe
function updateMarketTrendChart(timeframe) {
    // This would typically fetch new data based on timeframe
    console.log('Updating chart for timeframe:', timeframe);
}

// View coin details
function viewCoinDetails(coinId) {
    console.log('Viewing details for:', coinId);
    // This would typically navigate to a detailed coin page
    showSuccessMessage(`Loading details for ${coinId}...`);
}

// Update price alerts
function updatePriceAlerts() {
    // Check if any price alerts should trigger
    cryptoData.forEach(crypto => {
        const alerts = priceAlerts.filter(alert => alert.symbol === crypto.symbol);
        alerts.forEach(alert => {
            if ((alert.type === 'above' && crypto.price >= alert.price) ||
                (alert.type === 'below' && crypto.price <= alert.price)) {
                showPriceAlert(crypto, alert);
            }
        });
    });
}

// Show price alert notification
function showPriceAlert(crypto, alert) {
    showSuccessMessage(`Price Alert: ${crypto.name} is ${alert.type} $${alert.price}`);
}

// Utility functions
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

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function showSuccessMessage(message) {
    // Create and show toast notification
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
    // Similar to success message but with error styling
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

// Export functions for use in other files
window.CryptoHub = {
    formatPrice,
    formatLargeNumber,
    generateMockCryptoData,
    showSuccessMessage,
    showErrorMessage
};