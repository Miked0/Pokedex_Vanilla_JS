// Pokédex Application - JavaScript ES6+
class PokédexApp {
    constructor() {
        this.apiBase = 'https://pokeapi.co/api/v2/';
        this.pokemonCache = new Map();
        this.allPokemon = [];
        this.filteredPokemon = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.favorites = this.loadFavorites();
        this.showingFavorites = false;
        this.searchTimeout = null;
        
        // Type colors mapping
        this.typeColors = {
            normal: '#A8A878', fire: '#F08030', water: '#6890F0',
            grass: '#78C850', electric: '#F8D030', ice: '#98D8D8',
            fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
            flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
            rock: '#B8A038', ghost: '#705898', dark: '#705848',
            dragon: '#7038F8', steel: '#B8B8D0', fairy: '#EE99AC'
        };
        
        // Generation ranges
        this.generations = {
            1: { start: 1, end: 151, name: 'Kanto' },
            2: { start: 152, end: 251, name: 'Johto' },
            3: { start: 252, end: 386, name: 'Hoenn' }
        };
        
        this.initializeApp();
    }
    
    async initializeApp() {
        this.bindEvents();
        await this.loadInitialPokemon();
        this.renderPokemon();
        this.updatePagination();
        this.showPagination();
        this.hideLoading();
    }
    
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', this.handleSearch.bind(this));
        searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
        
        // Filters
        document.getElementById('generation-filter').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('type-filter').addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('clear-filters').addEventListener('click', this.clearFilters.bind(this));
        
        // Pagination
        document.getElementById('prev-page').addEventListener('click', this.previousPage.bind(this));
        document.getElementById('next-page').addEventListener('click', this.nextPage.bind(this));
        
        // Modal events
        document.getElementById('modal-close').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('modal-backdrop').addEventListener('click', this.closeModal.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Favorites toggle
        document.getElementById('toggle-favorites').addEventListener('click', this.toggleFavoritesView.bind(this));
        
        // Retry button
        document.getElementById('retry-btn').addEventListener('click', this.retryLoad.bind(this));
        
        // Click outside suggestions to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                this.hideSuggestions();
            }
        });
    }
    
    async loadInitialPokemon() {
        try {
            this.showLoading();
            const promises = [];
            
            // Load all Pokemon from generations 1-3 (1-386)
            for (let i = 1; i <= 386; i++) {
                promises.push(this.fetchPokemon(i));
            }
            
            // Load in batches to avoid overwhelming the API
            const batchSize = 50;
            for (let i = 0; i < promises.length; i += batchSize) {
                const batch = promises.slice(i, i + batchSize);
                const results = await Promise.all(batch);
                this.allPokemon.push(...results.filter(p => p !== null));
                
                // Update loading progress
                const progress = Math.min(100, ((i + batchSize) / promises.length) * 100);
                this.updateLoadingProgress(progress);
                
                // Small delay to avoid rate limiting
                if (i + batchSize < promises.length) {
                    await this.delay(100);
                }
            }
            
            // Sort by ID to maintain order
            this.allPokemon.sort((a, b) => a.id - b.id);
            this.filteredPokemon = [...this.allPokemon];
            this.hideError();
        } catch (error) {
            console.error('Error loading Pokemon:', error);
            this.showError();
        }
    }
    
    async fetchPokemon(id) {
        if (this.pokemonCache.has(id)) {
            return this.pokemonCache.get(id);
        }
        
        try {
            const response = await fetch(`${this.apiBase}pokemon/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const pokemonData = await response.json();
            
            // Get species data for description
            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = speciesResponse.ok ? await speciesResponse.json() : null;
            
            const pokemon = {
                id: pokemonData.id,
                name: pokemonData.name,
                types: pokemonData.types.map(t => t.type.name),
                stats: pokemonData.stats.reduce((acc, stat) => {
                    acc[stat.stat.name.replace('-', '_')] = stat.base_stat;
                    return acc;
                }, {}),
                height: pokemonData.height,
                weight: pokemonData.weight,
                abilities: pokemonData.abilities.map(a => a.ability.name),
                sprites: {
                    default: pokemonData.sprites.front_default,
                    official: pokemonData.sprites.other['official-artwork'].front_default,
                    animated: pokemonData.sprites.versions['generation-v']['black-white'].animated?.front_default
                },
                description: this.getEnglishDescription(speciesData?.flavor_text_entries || []),
                generation: this.getGeneration(pokemonData.id)
            };
            
            this.pokemonCache.set(id, pokemon);
            return pokemon;
        } catch (error) {
            console.error(`Error fetching Pokemon ${id}:`, error);
            return null;
        }
    }
    
    getEnglishDescription(flavorTexts) {
        const englishEntry = flavorTexts.find(entry => entry.language.name === 'en');
        return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'No description available.';
    }
    
    getGeneration(id) {
        if (id <= 151) return 1;
        if (id <= 251) return 2;
        if (id <= 386) return 3;
        return 0;
    }
    
    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (query.length === 0) {
                this.hideSuggestions();
                this.applyFilters();
                return;
            }
            
            if (query.length >= 2) {
                this.showSuggestions(query);
            }
            
            this.filterBySearch(query);
        }, 300);
    }
    
    handleSearchKeydown(e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        const highlighted = document.querySelector('.suggestion-item.highlighted');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = highlighted?.nextElementSibling || suggestions[0];
            this.highlightSuggestion(next);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = highlighted?.previousElementSibling || suggestions[suggestions.length - 1];
            this.highlightSuggestion(prev);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlighted) {
                const pokemonId = parseInt(highlighted.dataset.pokemonId);
                this.openModal(pokemonId);
                this.hideSuggestions();
            }
        } else if (e.key === 'Escape') {
            this.hideSuggestions();
        }
    }
    
    highlightSuggestion(element) {
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        if (element) {
            element.classList.add('highlighted');
        }
    }
    
    showSuggestions(query) {
        const matches = this.allPokemon
            .filter(pokemon => pokemon.name.toLowerCase().includes(query))
            .slice(0, 5);
            
        const suggestionsContainer = document.getElementById('search-suggestions');
        
        if (matches.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        suggestionsContainer.innerHTML = matches.map(pokemon => `
            <div class="suggestion-item" data-pokemon-id="${pokemon.id}">
                <img src="${pokemon.sprites.default}" alt="${pokemon.name}" class="suggestion-sprite" loading="lazy">
                <span>${this.capitalizeFirst(pokemon.name)} (#${pokemon.id.toString().padStart(3, '0')})</span>
            </div>
        `).join('');
        
        suggestionsContainer.classList.remove('hidden');
        
        // Add click events to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const pokemonId = parseInt(item.dataset.pokemonId);
                this.openModal(pokemonId);
                this.hideSuggestions();
            });
        });
    }
    
    hideSuggestions() {
        document.getElementById('search-suggestions').classList.add('hidden');
    }
    
    filterBySearch(query) {
        this.filteredPokemon = this.allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.id.toString() === query ||
            pokemon.types.some(type => type.toLowerCase().includes(query))
        );
        this.currentPage = 1;
        this.renderPokemon();
        this.updatePagination();
    }
    
    handleFilterChange() {
        this.applyFilters();
    }
    
    applyFilters() {
        let filtered = [...this.allPokemon];
        
        // Apply search filter if there's a search term
        const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
        if (searchQuery) {
            filtered = filtered.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchQuery) ||
                pokemon.id.toString() === searchQuery ||
                pokemon.types.some(type => type.toLowerCase().includes(searchQuery))
            );
        }
        
        // Apply generation filter
        const genFilter = document.getElementById('generation-filter').value;
        if (genFilter) {
            const generation = parseInt(genFilter);
            const range = this.generations[generation];
            filtered = filtered.filter(pokemon => 
                pokemon.id >= range.start && pokemon.id <= range.end
            );
        }
        
        // Apply type filter
        const typeFilter = document.getElementById('type-filter').value;
        if (typeFilter) {
            filtered = filtered.filter(pokemon => 
                pokemon.types.includes(typeFilter)
            );
        }
        
        this.filteredPokemon = filtered;
        this.currentPage = 1;
        this.renderPokemon();
        this.updatePagination();
    }
    
    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('generation-filter').value = '';
        document.getElementById('type-filter').value = '';
        this.hideSuggestions();
        this.filteredPokemon = [...this.allPokemon];
        this.currentPage = 1;
        this.renderPokemon();
        this.updatePagination();
    }
    
    toggleFavoritesView() {
        this.showingFavorites = !this.showingFavorites;
        const button = document.getElementById('toggle-favorites');
        
        if (this.showingFavorites) {
            this.filteredPokemon = this.allPokemon.filter(pokemon => 
                this.favorites.includes(pokemon.id)
            );
            button.textContent = '🏠 Mostrar Todos';
            button.classList.add('btn--primary');
            button.classList.remove('btn--outline');
        } else {
            this.applyFilters();
            button.innerHTML = '<span class="star-icon">⭐</span> Mostrar Favoritos';
            button.classList.remove('btn--primary');
            button.classList.add('btn--outline');
        }
        
        this.currentPage = 1;
        this.renderPokemon();
        this.updatePagination();
    }
    
    renderPokemon() {
        const grid = document.getElementById('pokemon-grid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pokemonToShow = this.filteredPokemon.slice(startIndex, endIndex);
        
        if (this.filteredPokemon.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <h3>Nenhum Pokémon encontrado</h3>
                    <p>Tente ajustar seus filtros ou termo de busca.</p>
                </div>
            `;
            this.updateResultsCount(0);
            this.hidePagination();
            return;
        }
        
        if (pokemonToShow.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <h3>Página não encontrada</h3>
                    <p>Não há Pokémon nesta página. Use a navegação para voltar.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = pokemonToShow.map(pokemon => this.createPokemonCard(pokemon)).join('');
        this.updateResultsCount(this.filteredPokemon.length);
        this.showPagination();
        
        // Add event listeners to cards and favorite buttons
        grid.querySelectorAll('.pokemon-card').forEach((card, index) => {
            const pokemon = pokemonToShow[index];
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.pokemon-card__favorite')) {
                    this.openModal(pokemon.id);
                }
            });
            
            const favoriteBtn = card.querySelector('.pokemon-card__favorite');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(pokemon.id);
            });
        });
    }
    
    createPokemonCard(pokemon) {
        const isFavorite = this.favorites.includes(pokemon.id);
        const statsToShow = ['hp', 'attack', 'defense', 'speed'];
        
        return `
            <div class="pokemon-card" data-pokemon-id="${pokemon.id}">
                <div class="pokemon-card__header">
                    <span class="pokemon-card__id">#${pokemon.id.toString().padStart(3, '0')}</span>
                    <button class="pokemon-card__favorite ${isFavorite ? 'active' : ''}" 
                            aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                        ${isFavorite ? '⭐' : '☆'}
                    </button>
                </div>
                
                <div class="pokemon-card__image-container">
                    <img src="${pokemon.sprites.official || pokemon.sprites.default}" 
                         alt="${pokemon.name}"
                         class="pokemon-card__image"
                         loading="lazy"
                         onerror="this.src='${pokemon.sprites.default}'">
                </div>
                
                <h3 class="pokemon-card__name">${this.capitalizeFirst(pokemon.name)}</h3>
                
                <div class="pokemon-card__types">
                    ${pokemon.types.map(type => 
                        `<span class="type-badge type-${type}">${this.capitalizeFirst(type)}</span>`
                    ).join('')}
                </div>
                
                <div class="pokemon-card__stats">
                    ${statsToShow.map(stat => `
                        <div class="stat-item">
                            <span class="stat-name">${this.getStatDisplayName(stat)}</span>
                            <span class="stat-value">${pokemon.stats[stat] || 0}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getStatDisplayName(stat) {
        const names = {
            hp: 'HP',
            attack: 'ATK',
            defense: 'DEF',
            'special_attack': 'SP.ATK',
            'special_defense': 'SP.DEF',
            speed: 'VEL'
        };
        return names[stat] || stat.toUpperCase();
    }
    
    async openModal(pokemonId) {
        const modal = document.getElementById('pokemon-modal');
        const pokemon = this.allPokemon.find(p => p.id === pokemonId);
        
        if (!pokemon) return;
        
        document.getElementById('modal-title').textContent = this.capitalizeFirst(pokemon.name);
        document.getElementById('modal-body').innerHTML = this.createModalContent(pokemon);
        
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeButton = document.getElementById('modal-close');
        closeButton.focus();
    }
    
    createModalContent(pokemon) {
        const isFavorite = this.favorites.includes(pokemon.id);
        const allStats = ['hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed'];
        const maxStat = 255; // Maximum possible stat value for progress bars
        
        return `
            <div class="modal-pokemon">
                <div class="modal-pokemon__header">
                    <div class="modal-pokemon__id">#${pokemon.id.toString().padStart(3, '0')}</div>
                    <img src="${pokemon.sprites.official || pokemon.sprites.default}" 
                         alt="${pokemon.name}"
                         class="modal-pokemon__image"
                         loading="lazy"
                         onerror="this.src='${pokemon.sprites.default}'">
                    
                    <div class="modal-pokemon__types">
                        ${pokemon.types.map(type => 
                            `<span class="type-badge type-${type}">${this.capitalizeFirst(type)}</span>`
                        ).join('')}
                    </div>
                    
                    <button class="btn btn--${isFavorite ? 'primary' : 'outline'} modal-favorite-btn" 
                            data-pokemon-id="${pokemon.id}">
                        ${isFavorite ? '⭐ Remover dos Favoritos' : '☆ Adicionar aos Favoritos'}
                    </button>
                </div>
                
                ${pokemon.description ? `
                    <div class="modal-pokemon__description">
                        "${pokemon.description}"
                    </div>
                ` : ''}
                
                <div class="modal-pokemon__info">
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Altura:</strong> ${pokemon.height / 10} m
                        </div>
                        <div class="info-item">
                            <strong>Peso:</strong> ${pokemon.weight / 10} kg
                        </div>
                        <div class="info-item">
                            <strong>Geração:</strong> ${this.generations[pokemon.generation]?.name || 'Desconhecida'}
                        </div>
                        <div class="info-item">
                            <strong>Habilidades:</strong> ${pokemon.abilities.map(a => this.capitalizeFirst(a.replace('-', ' '))).join(', ')}
                        </div>
                    </div>
                </div>
                
                <div class="modal-pokemon__stats">
                    <h3>Estatísticas Base</h3>
                    <div class="stats-grid">
                        ${allStats.map(stat => `
                            <div class="stat-bar">
                                <div class="stat-bar__label">
                                    <span>${this.getStatDisplayName(stat)}</span>
                                    <span>${pokemon.stats[stat] || 0}</span>
                                </div>
                                <div class="stat-bar__progress">
                                    <div class="stat-bar__fill" 
                                         style="width: ${((pokemon.stats[stat] || 0) / maxStat) * 100}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="total-stats">
                        <strong>Total: ${Object.values(pokemon.stats).reduce((sum, val) => sum + (val || 0), 0)}</strong>
                    </div>
                </div>
            </div>
        `;
    }
    
    closeModal() {
        const modal = document.getElementById('pokemon-modal');
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.closeModal();
            this.hideSuggestions();
        }
    }
    
    toggleFavorite(pokemonId) {
        const index = this.favorites.indexOf(pokemonId);
        
        if (index === -1) {
            this.favorites.push(pokemonId);
            this.showToast('Pokémon adicionado aos favoritos!', 'success');
        } else {
            this.favorites.splice(index, 1);
            this.showToast('Pokémon removido dos favoritos!', 'success');
        }
        
        this.saveFavorites();
        
        // Update UI
        this.renderPokemon();
        
        // Update modal if open
        const modal = document.getElementById('pokemon-modal');
        if (!modal.classList.contains('hidden')) {
            const favoriteBtn = modal.querySelector('.modal-favorite-btn');
            if (favoriteBtn && parseInt(favoriteBtn.dataset.pokemonId) === pokemonId) {
                const isFavorite = this.favorites.includes(pokemonId);
                favoriteBtn.textContent = isFavorite ? '⭐ Remover dos Favoritos' : '☆ Adicionar aos Favoritos';
                favoriteBtn.className = `btn btn--${isFavorite ? 'primary' : 'outline'} modal-favorite-btn`;
            }
        }
    }
    
    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('pokemon-favorites') || '[]');
        } catch {
            return [];
        }
    }
    
    saveFavorites() {
        try {
            localStorage.setItem('pokemon-favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderPokemon();
            this.updatePagination();
            this.scrollToTop();
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredPokemon.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderPokemon();
            this.updatePagination();
            this.scrollToTop();
        }
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredPokemon.length / this.itemsPerPage);
        
        document.getElementById('current-page').textContent = this.currentPage;
        document.getElementById('total-pages').textContent = totalPages || 1;
        
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Show/hide pagination based on whether it's needed
        const paginationContainer = document.getElementById('pagination-container');
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
        } else {
            paginationContainer.style.display = 'flex';
        }
    }
    
    showPagination() {
        const totalPages = Math.ceil(this.filteredPokemon.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        
        if (totalPages > 1) {
            paginationContainer.style.display = 'flex';
        } else {
            paginationContainer.style.display = 'none';
        }
    }
    
    hidePagination() {
        document.getElementById('pagination-container').style.display = 'none';
    }
    
    updateResultsCount(count) {
        const resultsCount = document.getElementById('results-count');
        const currentStart = (this.currentPage - 1) * this.itemsPerPage + 1;
        const currentEnd = Math.min(this.currentPage * this.itemsPerPage, count);
        
        if (count === 0) {
            resultsCount.textContent = 'Nenhum Pokémon encontrado';
        } else if (count <= this.itemsPerPage) {
            resultsCount.textContent = `${count} Pokémon encontrados`;
        } else {
            resultsCount.textContent = `Mostrando ${currentStart}-${currentEnd} de ${count} Pokémon`;
        }
    }
    
    showLoading() {
        document.getElementById('loading-container').style.display = 'flex';
        document.getElementById('pokemon-grid').style.display = 'none';
        document.getElementById('pagination-container').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('pokemon-grid').style.display = 'grid';
    }
    
    updateLoadingProgress(progress) {
        const loadingText = document.querySelector('.loading-text');
        loadingText.textContent = `Carregando Pokémon... ${Math.round(progress)}%`;
    }
    
    showError() {
        document.getElementById('error-container').classList.remove('hidden');
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('pokemon-grid').style.display = 'none';
        document.getElementById('pagination-container').style.display = 'none';
    }
    
    hideError() {
        document.getElementById('error-container').classList.add('hidden');
    }
    
    async retryLoad() {
        this.hideError();
        this.allPokemon = [];
        this.filteredPokemon = [];
        this.pokemonCache.clear();
        this.currentPage = 1;
        await this.loadInitialPokemon();
        this.renderPokemon();
        this.updatePagination();
        this.hideLoading();
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PokédexApp();
    window.pokédexApp = app; // Make it globally accessible for debugging
    
    // Add modal favorite button functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-favorite-btn')) {
            const pokemonId = parseInt(e.target.dataset.pokemonId);
            app.toggleFavorite(pokemonId);
        }
    });
    
    // Add CSS for missing styles
    const additionalStyles = `
        <style>
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: var(--space-32);
            color: var(--color-text-secondary);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-16);
            margin: var(--space-20) 0;
        }
        
        .info-item {
            padding: var(--space-12);
            background: var(--color-secondary);
            border-radius: var(--radius-base);
        }
        
        .total-stats {
            text-align: center;
            margin-top: var(--space-16);
            padding: var(--space-12);
            background: var(--color-bg-2);
            border-radius: var(--radius-base);
            font-size: var(--font-size-lg);
        }
        
        @media (max-width: 768px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
});