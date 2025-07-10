// CryptoHub - Portfolio Page JavaScript

let portfolioData = [];
let portfolioChart;
let allocationChart;
let totalPortfolioValue = 0;

// Initialize portfolio page
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
    setupPortfolioEventListeners();
    loadPortfolioData();
    createPortfolioCharts();
    setInterval(updatePortfolioData, 30000); // Update every 30 seconds
});

// Initialize portfolio components
function initializePortfolio() {
    loadPortfolioStats();
    setupTransactionModal();
}

// Setup event listeners for portfolio page
function setupPortfolioEventListeners() {
    // Add transaction modal
    const addTransactionBtn = document.querySelector('[data-bs-target="#addTransactionModal"]');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', function() {
            resetTransactionForm();
        });
    }

    // Transaction form submission
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
    }

    // Portfolio timeframe buttons
    document.querySelectorAll('[data-portfolio-timeframe]').forEach(button => {
        button.addEventListener('click', function() {
            const timeframe = this.dataset.portfolioTimeframe;
            updateActivePortfolioTimeframe(this);
            updatePortfolioChart(timeframe);
        });
    });

    // Export and refresh buttons
    document.querySelector('[data-action="export"]')?.addEventListener('click', exportPortfolioData);
    document.querySelector('[data-action="refresh"]')?.addEventListener('click', refreshPortfolioData);
}

// Load portfolio data
function loadPortfolioData() {
    portfolioData = generateMockPortfolioData();
    updatePortfolioTable();
    updatePortfolioStats();
    updateAllocationChart();
}

// Generate mock portfolio data
function generateMockPortfolioData() {
    const holdings = [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.5, avgBuyPrice: 40000 },
        { symbol: 'ETH', name: 'Ethereum', amount: 5.2, avgBuyPrice: 2200 },
        { symbol: 'ADA', name: 'Cardano', amount: 1500, avgBuyPrice: 0.75 },
        { symbol: 'SOL', name: 'Solana', amount: 25, avgBuyPrice: 80 },
        { symbol: 'DOT', name: 'Polkadot', amount: 100, avgBuyPrice: 15 },
        { symbol: 'LINK', name: 'Chainlink', amount: 75, avgBuyPrice: 20 },
        { symbol: 'MATIC', name: 'Polygon', amount: 2000, avgBuyPrice: 1.0 },
        { symbol: 'AVAX', name: 'Avalanche', amount: 15, avgBuyPrice: 35 }
    ];

    return holdings.map(holding => {
        const currentPrice = getCurrentPrice(holding.symbol);
        const marketValue = holding.amount * currentPrice;
        const totalCost = holding.amount * holding.avgBuyPrice;
        const pnl = marketValue - totalCost;
        const pnlPercent = (pnl / totalCost) * 100;
        const change24h = (Math.random() - 0.5) * 10; // Random 24h change

        return {
            ...holding,
            currentPrice,
            marketValue,
            totalCost,
            pnl,
            pnlPercent,
            change24h
        };
    });
}

// Get current price for symbol
function getCurrentPrice(symbol) {
    const prices = {
        'BTC': 43256.78,
        'ETH': 2456.32,
        'ADA': 0.87,
        'SOL': 98.45,
        'DOT': 12.89,
        'LINK': 18.76,
        'MATIC': 1.23,
        'AVAX': 42.15
    };
    
    const basePrice = prices[symbol] || 100;
    const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
    return basePrice * (1 + variation);
}

// Update portfolio table
function updatePortfolioTable() {
    const tableBody = document.getElementById('holdingsTableBody');
    if (!tableBody) return;

    totalPortfolioValue = portfolioData.reduce((sum, holding) => sum + holding.marketValue, 0);

    tableBody.innerHTML = portfolioData.map(holding => `
        <tr class="fade-in-up">
            <td>
                <div class="coin-info">
                    <div class="coin-logo">${holding.symbol.charAt(0)}</div>
                    <div>
                        <div class="coin-name">${holding.name}</div>
                        <div class="coin-symbol">${holding.symbol}</div>
                    </div>
                </div>
            </td>
            <td class="fw-bold">${holding.amount.toFixed(holding.amount >= 1 ? 2 : 6)}</td>
            <td>$${holding.avgBuyPrice.toFixed(2)}</td>
            <td>$${holding.currentPrice.toFixed(2)}</td>
            <td class="fw-bold">$${holding.marketValue.toFixed(2)}</td>
            <td class="${holding.pnl >= 0 ? 'price-positive' : 'price-negative'} fw-bold">
                ${holding.pnl >= 0 ? '+' : ''}$${holding.pnl.toFixed(2)}
            </td>
            <td class="${holding.pnlPercent >= 0 ? 'price-positive' : 'price-negative'} fw-bold">
                <i class="fas fa-arrow-${holding.pnlPercent >= 0 ? 'up' : 'down'}"></i>
                ${holding.pnlPercent >= 0 ? '+' : ''}${holding.pnlPercent.toFixed(2)}%
            </td>
            <td class="${holding.change24h >= 0 ? 'price-positive' : 'price-negative'}">
                <i class="fas fa-arrow-${holding.change24h >= 0 ? 'up' : 'down'}"></i>
                ${Math.abs(holding.change24h).toFixed(2)}%
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-warning" onclick="editHolding('${holding.symbol}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="removeHolding('${holding.symbol}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update portfolio statistics
function updatePortfolioStats() {
    const totalPnL = portfolioData.reduce((sum, holding) => sum + holding.pnl, 0);
    const totalCost = portfolioData.reduce((sum, holding) => sum + holding.totalCost, 0);
    const totalPnLPercent = (totalPnL / totalCost) * 100;
    
    // Calculate today's P&L (simulated)
    const todayPnL = totalPortfolioValue * ((Math.random() - 0.4) * 0.1); // -4% to +6% range
    const todayPnLPercent = (todayPnL / totalPortfolioValue) * 100;
    
    // Find best performer
    const bestPerformer = portfolioData.reduce((best, current) => 
        current.pnlPercent > best.pnlPercent ? current : best
    );

    // Update stat cards
    updateElementText('totalValue', '$' + totalPortfolioValue.toFixed(2));
    updateElementText('todayPnL', (todayPnL >= 0 ? '+' : '') + '$' + todayPnL.toFixed(2));
    updateElementText('totalCoins', portfolioData.length.toString());
    updateElementText('bestPerformer', bestPerformer.symbol);

    // Update badge colors
    const todayPnLElement = document.getElementById('todayPnL');
    if (todayPnLElement) {
        const badge = todayPnLElement.closest('.card').querySelector('.badge');
        if (badge) {
            badge.className = `badge ${todayPnL >= 0 ? 'bg-success' : 'bg-danger'}`;
            badge.innerHTML = `<i class="fas fa-arrow-${todayPnL >= 0 ? 'up' : 'down'}"></i> ${todayPnLPercent >= 0 ? '+' : ''}${todayPnLPercent.toFixed(1)}%`;
        }
    }

    const totalValueElement = document.getElementById('totalValue');
    if (totalValueElement) {
        const badge = totalValueElement.closest('.card').querySelector('.badge');
        if (badge) {
            badge.innerHTML = `<i class="fas fa-arrow-${totalPnL >= 0 ? 'up' : 'down'}"></i> +$${Math.abs(totalPnL).toFixed(0)} (${totalPnLPercent >= 0 ? '+' : ''}${totalPnLPercent.toFixed(1)}%)`;
        }
    }

    const bestPerformerElement = document.getElementById('bestPerformer');
    if (bestPerformerElement) {
        const badge = bestPerformerElement.closest('.card').querySelector('.badge');
        if (badge) {
            badge.innerHTML = `<i class="fas fa-arrow-up"></i> +${bestPerformer.pnlPercent.toFixed(1)}%`;
        }
    }
}

// Create portfolio charts
function createPortfolioCharts() {
    createPortfolioPerformanceChart();
    createAssetAllocationChart();
}

// Create portfolio performance chart
function createPortfolioPerformanceChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;

    const data = generatePortfolioPerformanceData();
    
    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Portfolio Value',
                data: data.values,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    borderColor: '#475569',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Create asset allocation chart
function createAssetAllocationChart() {
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;

    const colors = [
        '#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6',
        '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
    ];

    const data = portfolioData.map(holding => holding.marketValue);
    const labels = portfolioData.map(holding => holding.symbol);

    allocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    borderColor: '#475569',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Update allocation legend
    updateAllocationLegend(labels, data, colors);
}

// Update allocation legend
function updateAllocationLegend(labels, data, colors) {
    const legendContainer = document.getElementById('allocationLegend');
    if (!legendContainer) return;

    const total = data.reduce((a, b) => a + b, 0);

    legendContainer.innerHTML = labels.map((label, index) => {
        const value = data[index];
        const percentage = ((value / total) * 100).toFixed(1);
        
        return `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                    <div class="me-2" style="width: 12px; height: 12px; background-color: ${colors[index]}; border-radius: 2px;"></div>
                    <span class="text-white fw-bold">${label}</span>
                </div>
                <div class="text-end">
                    <div class="text-white fw-bold">$${value.toFixed(2)}</div>
                    <small class="text-muted">${percentage}%</small>
                </div>
            </div>
        `;
    }).join('');
}

// Generate portfolio performance data
function generatePortfolioPerformanceData() {
    const labels = [];
    const values = [];
    const now = new Date();
    let currentValue = totalPortfolioValue || 25000;
    
    // Generate 30 days of data
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Add some realistic volatility
        const change = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
        currentValue *= (1 + change);
        values.push(Math.max(0, currentValue));
    }
    
    return { labels, values };
}

// Update portfolio chart with new timeframe
function updatePortfolioChart(timeframe) {
    if (!portfolioChart) return;
    
    const data = generatePortfolioPerformanceData(); // In real app, this would vary by timeframe
    portfolioChart.data.labels = data.labels;
    portfolioChart.data.datasets[0].data = data.values;
    portfolioChart.update();
}

// Setup transaction modal
function setupTransactionModal() {
    const modal = document.getElementById('addTransactionModal');
    if (modal) {
        modal.addEventListener('shown.bs.modal', function() {
            const firstInput = modal.querySelector('input, select');
            if (firstInput) firstInput.focus();
        });
    }
}

// Reset transaction form
function resetTransactionForm() {
    const form = document.getElementById('transactionForm');
    if (form) {
        form.reset();
        // Set default date to now
        const dateInput = form.querySelector('input[type="datetime-local"]');
        if (dateInput) {
            const now = new Date();
            dateInput.value = now.toISOString().slice(0, 16);
        }
    }
}

// Handle transaction form submission
function handleTransactionSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const transaction = {
        type: formData.get('type'),
        symbol: formData.get('symbol'),
        amount: parseFloat(formData.get('amount')),
        price: parseFloat(formData.get('price')),
        date: formData.get('date'),
        notes: formData.get('notes')
    };
    
    // Add transaction to portfolio
    addTransaction(transaction);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
    modal.hide();
    
    showSuccessMessage('Transaction added successfully!');
}

// Add transaction to portfolio
function addTransaction(transaction) {
    // Find existing holding or create new one
    let holding = portfolioData.find(h => h.symbol === transaction.symbol);
    
    if (holding) {
        if (transaction.type === 'buy') {
            // Update average buy price
            const totalCost = (holding.amount * holding.avgBuyPrice) + (transaction.amount * transaction.price);
            const totalAmount = holding.amount + transaction.amount;
            holding.avgBuyPrice = totalCost / totalAmount;
            holding.amount = totalAmount;
        } else if (transaction.type === 'sell') {
            holding.amount = Math.max(0, holding.amount - transaction.amount);
        }
    } else if (transaction.type === 'buy') {
        // Create new holding
        const newHolding = {
            symbol: transaction.symbol,
            name: getCoinName(transaction.symbol),
            amount: transaction.amount,
            avgBuyPrice: transaction.price
        };
        
        const currentPrice = getCurrentPrice(transaction.symbol);
        const marketValue = newHolding.amount * currentPrice;
        const totalCost = newHolding.amount * newHolding.avgBuyPrice;
        const pnl = marketValue - totalCost;
        const pnlPercent = (pnl / totalCost) * 100;
        const change24h = (Math.random() - 0.5) * 10;

        portfolioData.push({
            ...newHolding,
            currentPrice,
            marketValue,
            totalCost,
            pnl,
            pnlPercent,
            change24h
        });
    }
    
    // Remove holdings with zero amount
    portfolioData = portfolioData.filter(h => h.amount > 0);
    
    // Update display
    updatePortfolioTable();
    updatePortfolioStats();
    updateAllocationChart();
}

// Get coin name from symbol
function getCoinName(symbol) {
    const names = {
        'BTC': 'Bitcoin',
        'ETH': 'Ethereum',
        'ADA': 'Cardano',
        'SOL': 'Solana',
        'DOT': 'Polkadot',
        'LINK': 'Chainlink',
        'MATIC': 'Polygon',
        'AVAX': 'Avalanche'
    };
    return names[symbol] || symbol;
}

// Edit holding
function editHolding(symbol) {
    const holding = portfolioData.find(h => h.symbol === symbol);
    if (holding) {
        // Pre-fill modal with holding data
        const modal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
        
        // Set form values
        const form = document.getElementById('transactionForm');
        if (form) {
            form.querySelector('select[name="type"]').value = 'buy';
            form.querySelector('select[name="symbol"]').value = holding.name;
            form.querySelector('input[name="amount"]').value = holding.amount;
            form.querySelector('input[name="price"]').value = holding.avgBuyPrice;
        }
        
        modal.show();
    }
}

// Remove holding
function removeHolding(symbol) {
    if (confirm('Are you sure you want to remove this holding from your portfolio?')) {
        portfolioData = portfolioData.filter(h => h.symbol !== symbol);
        updatePortfolioTable();
        updatePortfolioStats();
        updateAllocationChart();
        showSuccessMessage('Holding removed from portfolio');
    }
}

// Update portfolio data (called periodically)
function updatePortfolioData() {
    // Update current prices
    portfolioData.forEach(holding => {
        holding.currentPrice = getCurrentPrice(holding.symbol);
        holding.marketValue = holding.amount * holding.currentPrice;
        const totalCost = holding.amount * holding.avgBuyPrice;
        holding.pnl = holding.marketValue - totalCost;
        holding.pnlPercent = (holding.pnl / totalCost) * 100;
        holding.change24h = (Math.random() - 0.5) * 10; // Random 24h change
    });
    
    updatePortfolioTable();
    updatePortfolioStats();
}

// Export portfolio data
function exportPortfolioData() {
    const csvData = convertToCSV(portfolioData);
    downloadCSV(csvData, 'portfolio.csv');
    showSuccessMessage('Portfolio data exported successfully!');
}

// Refresh portfolio data
function refreshPortfolioData() {
    updatePortfolioData();
    showSuccessMessage('Portfolio data refreshed!');
}

// Update active portfolio timeframe
function updateActivePortfolioTimeframe(activeButton) {
    document.querySelectorAll('[data-portfolio-timeframe]').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Utility functions
function convertToCSV(data) {
    const headers = ['Symbol', 'Name', 'Amount', 'Avg Buy Price', 'Current Price', 'Market Value', 'P&L', 'P&L %'];
    const rows = data.map(item => [
        item.symbol,
        item.name,
        item.amount,
        item.avgBuyPrice,
        item.currentPrice,
        item.marketValue,
        item.pnl,
        item.pnlPercent
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
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

// Load portfolio stats on page load
function loadPortfolioStats() {
    // Initialize with default values
    updateElementText('totalValue', '$25,847.92');
    updateElementText('todayPnL', '+$1,247.82');
    updateElementText('totalCoins', '12');
    updateElementText('bestPerformer', 'BTC');
}