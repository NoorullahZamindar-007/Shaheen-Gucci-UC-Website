/* =========================
   Marketplace page logic
   - search
   - filter
   - sorting
   - load more
   ========================= */

const MARKETPLACE_PAGE_SIZE = 6;

const marketplaceState = {
  search: '',
  game: 'all',
  price: 'all',
  region: 'all',
  level: 'all',
  sort: 'newest',
  visibleCount: MARKETPLACE_PAGE_SIZE,
  currentLanguage: 'en'
};

/* -------------------------
   Translation helpers
   ------------------------- */
function getMarketplaceDictionary() {
  return translations[marketplaceState.currentLanguage] || translations.en;
}

function getMarketplaceText(key, fallback = '') {
  const dictionary = getMarketplaceDictionary();
  return getNestedValue(dictionary, key) || fallback;
}

/* -------------------------
   Filtering helpers
   ------------------------- */
function formatMarketplacePrice(price) {
  return `$${price}`;
}

function passesPriceFilter(item, priceFilter) {
  if (priceFilter === 'all') return true;
  if (priceFilter === '301+') return item.price >= 301;

  const [min, max] = priceFilter.split('-').map(Number);
  return item.price >= min && item.price <= max;
}

function applyMarketplaceFilters() {
  const searchTerm = marketplaceState.search.trim().toLowerCase();

  const filtered = marketplaceListings.filter((item) => {
    const matchesSearch = !searchTerm || [item.game, item.title, item.region, ...item.features].join(' ').toLowerCase().includes(searchTerm);
    const matchesGame = marketplaceState.game === 'all' || item.game === marketplaceState.game;
    const matchesPrice = passesPriceFilter(item, marketplaceState.price);
    const matchesRegion = marketplaceState.region === 'all' || item.region === marketplaceState.region;
    const matchesLevel = marketplaceState.level === 'all' || item.levelBand === marketplaceState.level;

    return matchesSearch && matchesGame && matchesPrice && matchesRegion && matchesLevel;
  });

  filtered.sort((a, b) => {
    if (marketplaceState.sort === 'price-low') return a.price - b.price;
    if (marketplaceState.sort === 'price-high') return b.price - a.price;
    return new Date(b.listedAt) - new Date(a.listedAt);
  });

  return filtered;
}

/* -------------------------
   Rendering helpers
   ------------------------- */
function createFeatureTags(features) {
  return features.map((feature) => `<span>${feature}</span>`).join('');
}

function createMarketplaceCard(item) {
  const cardsText = getMarketplaceText('cards', {});
  const statusLabel = getMarketplaceText(`marketplacePage.statuses.${item.statusKey}`, item.status);
  const buyLabel = getMarketplaceText('buttons.buyNow', 'Buy Now');
  const contactLabel = getMarketplaceText('buttons.contactUs', 'Contact Us');

  return `
    <div class="col-md-6 col-xl-4 scroll-reveal">
      <article class="market-card">
        <div class="market-card-media ${item.imageClass}"><img class="market-card-photo" src="../assets/images/downloads/${item.imageClass === 'listing-pubg' ? 'pubg-market.jpg' : item.imageClass === 'listing-coc' ? 'pubg-squad.jpg' : item.imageClass === 'listing-ff' ? 'pubg-action.jpg' : item.imageClass === 'listing-codm' ? 'pubg-cta.jpg' : 'pubg-hero.jpg'}" alt="${item.game} account visual">
          <span class="market-status ${item.statusKey}">${statusLabel}</span>
          <span class="market-game">${item.game}</span>
        </div>
        <div class="market-card-body">
          <h3 class="market-card-title">${item.title}</h3>
          <div class="market-card-meta">
            <span><strong>${cardsText.level || 'Level'}:</strong> ${item.levelLabel}</span>
            <span><strong>${cardsText.region || 'Region'}:</strong> ${item.region}</span>
          </div>
          <div class="market-feature-list">${createFeatureTags(item.features)}</div>
          <div class="market-card-footer">
            <div>
              <div class="market-price-label">${cardsText.price || 'Price'}</div>
              <div class="market-price">${formatMarketplacePrice(item.price)}</div>
            </div>
            <div class="market-actions">
              <a href="contact.html" class="btn btn-info offer-cta">${buyLabel}</a>
              <a href="contact.html" class="btn btn-outline-light offer-cta secondary">${contactLabel}</a>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderActiveFilterChips() {
  const chipsContainer = document.getElementById('activeFilterChips');
  if (!chipsContainer) return;

  const chips = [];
  if (marketplaceState.game !== 'all') chips.push(marketplaceState.game);
  if (marketplaceState.price !== 'all') chips.push(marketplaceState.price);
  if (marketplaceState.region !== 'all') chips.push(marketplaceState.region);
  if (marketplaceState.level !== 'all') chips.push(getMarketplaceText(`marketplacePage.levelOptions.${marketplaceState.level}`, marketplaceState.level));
  if (marketplaceState.search.trim()) chips.push(`"${marketplaceState.search.trim()}"`);

  chipsContainer.innerHTML = chips.map((chip) => `<span class="filter-chip">${chip}</span>`).join('');
}

function renderMarketplace() {
  const grid = document.getElementById('marketplaceGrid');
  const resultsCount = document.getElementById('resultsCount');
  const loadMoreButton = document.getElementById('loadMoreButton');
  const emptyState = document.getElementById('emptyState');
  if (!grid || !resultsCount || !loadMoreButton || !emptyState) return;

  const filteredListings = applyMarketplaceFilters();
  const visibleListings = filteredListings.slice(0, marketplaceState.visibleCount);

  resultsCount.textContent = String(filteredListings.length);
  renderActiveFilterChips();

  if (filteredListings.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('d-none');
    loadMoreButton.classList.add('d-none');
    return;
  }

  emptyState.classList.add('d-none');
  grid.innerHTML = visibleListings.map(createMarketplaceCard).join('');

  if (window.ShaheenApp?.initializeScrollReveal) {
    window.ShaheenApp.initializeScrollReveal();
  }

  if (visibleListings.length >= filteredListings.length) {
    loadMoreButton.classList.add('d-none');
  } else {
    loadMoreButton.classList.remove('d-none');
  }
}

/* -------------------------
   Filter dropdown setup
   ------------------------- */
function populateMarketplaceFilters() {
  const gameFilter = document.getElementById('gameFilter');
  const regionFilter = document.getElementById('regionFilter');
  if (!gameFilter || !regionFilter) return;

  const allGamesLabel = getMarketplaceText('marketplacePage.filterOptions.allGames', 'All Games');
  const allRegionsLabel = getMarketplaceText('marketplacePage.filterOptions.allRegions', 'All Regions');
  const uniqueGames = [...new Set(marketplaceListings.map((item) => item.game))];
  const uniqueRegions = [...new Set(marketplaceListings.map((item) => item.region))];

  gameFilter.innerHTML = [`<option value="all">${allGamesLabel}</option>`, ...uniqueGames.map((game) => `<option value="${game}">${game}</option>`)].join('');
  regionFilter.innerHTML = [`<option value="all">${allRegionsLabel}</option>`, ...uniqueRegions.map((region) => `<option value="${region}">${region}</option>`)].join('');

  gameFilter.value = marketplaceState.game;
  regionFilter.value = marketplaceState.region;
}

/* -------------------------
   Event binding
   ------------------------- */
function bindMarketplaceEvents() {
  const searchInput = document.getElementById('searchInput');
  const gameFilter = document.getElementById('gameFilter');
  const priceFilter = document.getElementById('priceFilter');
  const regionFilter = document.getElementById('regionFilter');
  const levelFilter = document.getElementById('levelFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetButton = document.getElementById('resetFilters');
  const loadMoreButton = document.getElementById('loadMoreButton');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      marketplaceState.search = event.target.value;
      marketplaceState.visibleCount = MARKETPLACE_PAGE_SIZE;
      renderMarketplace();
    });
  }

  [[gameFilter, 'game'], [priceFilter, 'price'], [regionFilter, 'region'], [levelFilter, 'level'], [sortFilter, 'sort']].forEach(([element, key]) => {
    if (!element) return;
    element.addEventListener('change', (event) => {
      marketplaceState[key] = event.target.value;
      marketplaceState.visibleCount = MARKETPLACE_PAGE_SIZE;
      renderMarketplace();
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      marketplaceState.search = '';
      marketplaceState.game = 'all';
      marketplaceState.price = 'all';
      marketplaceState.region = 'all';
      marketplaceState.level = 'all';
      marketplaceState.sort = 'newest';
      marketplaceState.visibleCount = MARKETPLACE_PAGE_SIZE;

      if (searchInput) searchInput.value = '';
      if (gameFilter) gameFilter.value = 'all';
      if (priceFilter) priceFilter.value = 'all';
      if (regionFilter) regionFilter.value = 'all';
      if (levelFilter) levelFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'newest';

      renderMarketplace();
    });
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      marketplaceState.visibleCount += MARKETPLACE_PAGE_SIZE;
      renderMarketplace();
    });
  }
}

/* -------------------------
   Initialization
   ------------------------- */
function refreshMarketplaceLanguage() {
  marketplaceState.currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
  populateMarketplaceFilters();
  renderMarketplace();
}

function initializeMarketplacePage() {
  const grid = document.getElementById('marketplaceGrid');
  if (!grid) return;

  marketplaceState.currentLanguage = typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
  populateMarketplaceFilters();
  bindMarketplaceEvents();
  renderMarketplace();
  document.addEventListener('languageChanged', refreshMarketplaceLanguage);
}

document.addEventListener('DOMContentLoaded', initializeMarketplacePage);

