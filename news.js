// CryptoHub - News Page JavaScript

let newsData = [];
let currentCategory = 'all';
let currentSort = 'latest';

// Initialize news page
document.addEventListener('DOMContentLoaded', function() {
    initializeNews();
    setupNewsEventListeners();
    loadNewsData();
    loadMarketSentiment();
    loadTrendingTopics();
    loadPriceAlerts();
    setInterval(updateNewsData, 60000); // Update every minute
});

// Initialize news components
function initializeNews() {
    setupCategoryButtons();
    setupSortButtons();
}

// Setup event listeners for news page
function setupNewsEventListeners() {
    // Category buttons
    document.querySelectorAll('[data-category]').forEach(button => {
        button.addEventListener('click', function() {
            currentCategory = this.textContent.toLowerCase().replace(' ', '-');
            updateActiveCategory(this);
            filterAndDisplayNews();
        });
    });

    // Sort buttons
    document.querySelectorAll('[data-sort]').forEach(button => {
        button.addEventListener('click', function() {
            currentSort = this.dataset.sort;
            updateActiveSort(this);
            sortAndDisplayNews();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleNewsSearch);
    }

    // News interaction buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.news-like-btn')) {
            const newsId = e.target.dataset.newsId;
            toggleNewsLike(newsId);
        }
        
        if (e.target.matches('.news-share-btn')) {
            const newsId = e.target.dataset.newsId;
            shareNews(newsId);
        }
    });
}

// Load news data
function loadNewsData() {
    newsData = generateMockNewsData();
    displayNews();
    displayFeaturedNews();
}

// Generate mock news data
function generateMockNewsData() {
    const newsItems = [
        {
            id: 1,
            title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
            summary: 'Major financial institutions continue to add Bitcoin to their portfolios, driving unprecedented price levels and market confidence.',
            content: 'Bitcoin has reached a new all-time high as institutional adoption continues to accelerate...',
            category: 'bitcoin',
            source: 'CoinDesk',
            author: 'Sarah Johnson',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            image: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 245,
            isLiked: false,
            tags: ['bitcoin', 'institutional', 'ath']
        },
        {
            id: 2,
            title: 'Ethereum 2.0 Staking Rewards Increase Following Network Upgrade',
            summary: 'The latest Ethereum network upgrade has resulted in improved staking rewards for validators, making the network more attractive.',
            content: 'Ethereum 2.0 validators are seeing increased rewards following the latest network upgrade...',
            category: 'ethereum',
            source: 'Ethereum Foundation',
            author: 'Vitalik Buterin',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            image: 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 189,
            isLiked: true,
            tags: ['ethereum', 'staking', 'upgrade']
        },
        {
            id: 3,
            title: 'DeFi Protocol Launches Revolutionary Yield Farming Mechanism',
            summary: 'A new DeFi protocol has introduced an innovative yield farming mechanism that promises higher returns with lower risk.',
            content: 'The new DeFi protocol revolutionizes yield farming with its innovative approach...',
            category: 'defi',
            source: 'DeFi Pulse',
            author: 'Alex Thompson',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            image: 'https://images.pexels.com/photos/6772076/pexels-photo-6772076.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 156,
            isLiked: false,
            tags: ['defi', 'yield-farming', 'innovation']
        },
        {
            id: 4,
            title: 'Major Exchange Announces Support for 50+ New Altcoins',
            summary: 'Leading cryptocurrency exchange expands its offerings with support for over 50 new altcoins, increasing trading opportunities.',
            content: 'The exchange has announced support for a wide range of new altcoins...',
            category: 'altcoins',
            source: 'Exchange News',
            author: 'Michael Chen',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
            image: 'https://images.pexels.com/photos/6772078/pexels-photo-6772078.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 98,
            isLiked: false,
            tags: ['altcoins', 'exchange', 'trading']
        },
        {
            id: 5,
            title: 'Government Announces Comprehensive Crypto Regulation Framework',
            summary: 'New regulatory framework aims to provide clarity for cryptocurrency businesses while protecting consumers.',
            content: 'The government has unveiled a comprehensive regulatory framework for cryptocurrencies...',
            category: 'regulation',
            source: 'Regulatory News',
            author: 'Lisa Rodriguez',
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
            image: 'https://images.pexels.com/photos/6772077/pexels-photo-6772077.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 234,
            isLiked: true,
            tags: ['regulation', 'government', 'framework']
        },
        {
            id: 6,
            title: 'NFT Marketplace Sees Record Trading Volume',
            summary: 'Popular NFT marketplace reports record trading volume as digital art and collectibles gain mainstream adoption.',
            content: 'The NFT marketplace has seen unprecedented trading volume this week...',
            category: 'nfts',
            source: 'NFT Times',
            author: 'Emma Wilson',
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            image: 'https://images.pexels.com/photos/6772073/pexels-photo-6772073.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 167,
            isLiked: false,
            tags: ['nft', 'marketplace', 'volume']
        },
        {
            id: 7,
            title: 'Blockchain Technology Revolutionizes Supply Chain Management',
            summary: 'Major corporations adopt blockchain technology to improve transparency and efficiency in supply chain operations.',
            content: 'Blockchain technology is being adopted by major corporations for supply chain management...',
            category: 'technology',
            source: 'Tech Today',
            author: 'David Park',
            publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
            image: 'https://images.pexels.com/photos/6772074/pexels-photo-6772074.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 145,
            isLiked: false,
            tags: ['blockchain', 'supply-chain', 'technology']
        },
        {
            id: 8,
            title: 'Crypto Market Analysis: Bull Run Expected to Continue',
            summary: 'Technical analysis suggests the current crypto bull run may continue for several more months based on market indicators.',
            content: 'Market analysts predict the continuation of the current bull run...',
            category: 'market-analysis',
            source: 'Crypto Analytics',
            author: 'Robert Kim',
            publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
            image: 'https://images.pexels.com/photos/6772075/pexels-photo-6772075.jpeg?auto=compress&cs=tinysrgb&w=800',
            likes: 289,
            isLiked: true,
            tags: ['market-analysis', 'bull-run', 'prediction']
        }
    ];

    return newsItems;
}

// Display news articles
function displayNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;

    const filteredNews = filterNews();
    const sortedNews = sortNews(filteredNews);

    newsContainer.innerHTML = sortedNews.map(news => `
        <article class="news-item fade-in-up" onclick="readNews(${news.id})">
            <div class="row">
                <div class="col-md-8">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${news.category.charAt(0).toUpperCase() + news.category.slice(1)}</span>
                        <small class="text-muted">${getTimeAgo(news.publishedAt)}</small>
                    </div>
                    <h5 class="text-white mb-2">${news.title}</h5>
                    <p class="text-muted mb-3">${news.summary}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <small class="text-muted me-3">By ${news.author}</small>
                            <small class="text-muted">${news.source}</small>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-warning news-like-btn ${news.isLiked ? 'active' : ''}" 
                                    data-news-id="${news.id}" onclick="event.stopPropagation();">
                                <i class="fas fa-heart"></i> ${news.likes}
                            </button>
                            <button class="btn btn-sm btn-outline-warning news-share-btn" 
                                    data-news-id="${news.id}" onclick="event.stopPropagation();">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <img src="${news.image}" class="img-fluid rounded" alt="${news.title}">
                </div>
            </div>
        </article>
    `).join('');
}

// Display featured news
function displayFeaturedNews() {
    const featuredNews = newsData.slice(0, 2); // Get top 2 news items
    
    // Update featured news sections if they exist
    const featuredSections = document.querySelectorAll('.featured-news');
    featuredSections.forEach((section, index) => {
        if (featuredNews[index]) {
            const news = featuredNews[index];
            const img = section.querySelector('img');
            const title = section.querySelector('.card-title');
            const text = section.querySelector('.card-text');
            const source = section.querySelector('small:last-child');
            const likeBtn = section.querySelector('.btn:first-child');
            
            if (img) img.src = news.image;
            if (title) title.textContent = news.title;
            if (text) text.textContent = news.summary;
            if (source) source.textContent = news.source;
            if (likeBtn) {
                likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${news.likes}`;
                likeBtn.dataset.newsId = news.id;
            }
        }
    });
}

// Filter news based on current category
function filterNews() {
    if (currentCategory === 'all' || currentCategory === 'all-news') {
        return newsData;
    }
    return newsData.filter(news => news.category === currentCategory);
}

// Sort news based on current sort method
function sortNews(newsArray) {
    switch (currentSort) {
        case 'latest':
            return newsArray.sort((a, b) => b.publishedAt - a.publishedAt);
        case 'popular':
            return newsArray.sort((a, b) => b.likes - a.likes);
        case 'trending':
            // Sort by a combination of likes and recency
            return newsArray.sort((a, b) => {
                const aScore = a.likes * (1 / ((Date.now() - a.publishedAt) / (1000 * 60 * 60))); // Higher score for recent + popular
                const bScore = b.likes * (1 / ((Date.now() - b.publishedAt) / (1000 * 60 * 60)));
                return bScore - aScore;
            });
        default:
            return newsArray;
    }
}

// Filter and display news
function filterAndDisplayNews() {
    displayNews();
}

// Sort and display news
function sortAndDisplayNews() {
    displayNews();
}

// Handle news search
function handleNewsSearch(event) {
    const query = event.target.value.toLowerCase();
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
        const title = item.querySelector('h5')?.textContent.toLowerCase() || '';
        const summary = item.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || summary.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Toggle news like
function toggleNewsLike(newsId) {
    const news = newsData.find(n => n.id == newsId);
    if (news) {
        news.isLiked = !news.isLiked;
        news.likes += news.isLiked ? 1 : -1;
        
        // Update button appearance
        const button = document.querySelector(`[data-news-id="${newsId}"]`);
        if (button) {
            button.innerHTML = `<i class="fas fa-heart"></i> ${news.likes}`;
            button.classList.toggle('active', news.isLiked);
        }
        
        showSuccessMessage(news.isLiked ? 'Article liked!' : 'Article unliked!');
    }
}

// Share news
function shareNews(newsId) {
    const news = newsData.find(n => n.id == newsId);
    if (news) {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                text: news.summary,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${news.title} - ${window.location.href}`);
            showSuccessMessage('Article link copied to clipboard!');
        }
    }
}

// Read news article
function readNews(newsId) {
    const news = newsData.find(n => n.id == newsId);
    if (news) {
        showSuccessMessage(`Opening article: ${news.title}`);
        // In a real application, this would navigate to the full article
    }
}

// Load market sentiment
function loadMarketSentiment() {
    const sentimentData = {
        bullish: 58,
        neutral: 28,
        bearish: 14,
        overall: 72
    };
    
    // Update sentiment gauge
    const percentageElement = document.querySelector('.percentage');
    const sentimentLabel = document.querySelector('.sentiment-label');
    
    if (percentageElement) percentageElement.textContent = sentimentData.overall + '%';
    if (sentimentLabel) {
        sentimentLabel.textContent = sentimentData.overall > 60 ? 'Bullish' : 
                                   sentimentData.overall < 40 ? 'Bearish' : 'Neutral';
    }
    
    // Update sentiment stats
    const sentimentStats = document.querySelectorAll('.sentiment-stat .h4');
    if (sentimentStats.length >= 3) {
        sentimentStats[0].textContent = sentimentData.bullish + '%';
        sentimentStats[1].textContent = sentimentData.neutral + '%';
        sentimentStats[2].textContent = sentimentData.bearish + '%';
    }
}

// Load trending topics
function loadTrendingTopics() {
    const trendingTopics = [
        { topic: '#Bitcoin', mentions: 12500 },
        { topic: '#Ethereum', mentions: 8200 },
        { topic: '#DeFi', mentions: 5700 },
        { topic: '#NFT', mentions: 4100 },
        { topic: '#Web3', mentions: 3800 }
    ];
    
    const trendingContainer = document.querySelector('.trending-topics');
    if (trendingContainer) {
        trendingContainer.innerHTML = trendingTopics.map((item, index) => `
            <div class="trending-item d-flex align-items-center mb-3">
                <span class="trending-rank me-2">${index + 1}</span>
                <div>
                    <div class="fw-bold text-white">${item.topic}</div>
                    <small class="text-muted">${item.mentions.toLocaleString()} mentions</small>
                </div>
            </div>
        `).join('');
    }
}

// Load price alerts
function loadPriceAlerts() {
    const alerts = [
        { crypto: 'BTC', type: 'triggered', condition: 'above $43,000', status: 'success' },
        { crypto: 'ETH', type: 'pending', condition: 'below $2,400', status: 'warning' }
    ];
    
    const alertsContainer = document.querySelector('.card-body:has(.alert-item)');
    if (alertsContainer) {
        const alertsHTML = alerts.map(alert => `
            <div class="alert-item d-flex justify-content-between align-items-center mb-2 p-2 bg-${alert.status} bg-opacity-25 rounded">
                <div>
                    <small class="text-${alert.status} fw-bold">${alert.crypto} Alert ${alert.type === 'triggered' ? 'Triggered' : 'Pending'}</small>
                    <div class="small text-muted">Price ${alert.condition}</div>
                </div>
                <i class="fas fa-${alert.type === 'triggered' ? 'check-circle' : 'clock'} text-${alert.status}"></i>
            </div>
        `).join('');
        
        alertsContainer.innerHTML = alertsHTML + `
            <button class="btn btn-outline-warning btn-sm w-100">
                <i class="fas fa-plus me-1"></i>Add New Alert
            </button>
        `;
    }
}

// Update news data (called periodically)
function updateNewsData() {
    // In a real application, this would fetch new news from an API
    // For demo purposes, we'll just update timestamps and like counts
    newsData.forEach(news => {
        // Randomly update like counts
        if (Math.random() > 0.9) {
            news.likes += Math.floor(Math.random() * 5);
        }
    });
    
    displayNews();
}

// Setup category buttons
function setupCategoryButtons() {
    const allNewsBtn = document.querySelector('[data-category]:first-child');
    if (allNewsBtn) {
        updateActiveCategory(allNewsBtn);
    }
}

// Setup sort buttons
function setupSortButtons() {
    const latestBtn = document.querySelector('[data-sort="latest"]');
    if (latestBtn) {
        updateActiveSort(latestBtn);
    }
}

// Update active category button
function updateActiveCategory(activeButton) {
    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Update active sort button
function updateActiveSort(activeButton) {
    document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Utility function
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