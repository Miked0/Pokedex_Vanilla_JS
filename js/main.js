// Pokédx V2.0 - Main Application
class PokedxApp {
    constructor() {
        this.currentSection = 'pokedex';
        this.currentPokemonList = [];
        this.currentPage = 0;
        this.pokemonPerPage = 20;
        this.isLoading = false;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupModal();
        this.loadInitialPokemon();

        // Initialize other modules
        if (window.PokemonComparison) {
            this.comparison = new PokemonComparison();
        }

        if (window.TeamBuilder) {
            this.teamBuilder = new TeamBuilder();
        }
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.id.replace('-tab', '-section');

                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');

                this.currentSection = btn.id.replace('-tab', '');
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('pokemon-search');
        const generationSelect = document.getElementById('generation-select');
        const loadMoreBtn = document.getElementById('load-more');

        searchInput.addEventListener('input', debounce((e) => {
            this.searchPokemon(e.target.value);
        }, 300));

        generationSelect.addEventListener('change', (e) => {
            this.filterByGeneration(e.target.value);
        });

        loadMoreBtn.addEventListener('click', () => {
            this.loadMorePokemon();
        });
    }

    setupModal() {
        const modal = document.getElementById('pokemon-selector-modal');
        const closeBtn = modal.querySelector('.close-btn');
        const modalSearch = document.getElementById('modal-search');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        modalSearch.addEventListener('input', debounce((e) => {
            this.searchInModal(e.target.value);
        }, 300));
    }

    async loadInitialPokemon() {
        this.showLoading();
        try {
            const pokemon = await PokemonAPI.getPokemonRange(1, this.pokemonPerPage);
            this.currentPokemonList = pokemon;
            this.renderPokemonGrid(pokemon);
            this.currentPage = 1;
            document.getElementById('load-more').style.display = 'block';
        } catch (error) {
            this.showError('Erro ao carregar Pokémon iniciais');
        } finally {
            this.hideLoading();
        }
    }

    async loadMorePokemon() {
        if (this.isLoading) return;

        this.isLoading = true;
        const loadMoreBtn = document.getElementById('load-more');
        const originalText = loadMoreBtn.textContent;
        loadMoreBtn.textContent = 'Carregando...';

        try {
            const startId = (this.currentPage * this.pokemonPerPage) + 1;
            const endId = startId + this.pokemonPerPage - 1;

            if (startId > 1025) { // Total Pokémon até Gen 9
                loadMoreBtn.style.display = 'none';
                return;
            }

            const newPokemon = await PokemonAPI.getPokemonRange(startId, Math.min(endId, 1025));
            this.currentPokemonList.push(...newPokemon);
            this.appendPokemonGrid(newPokemon);
            this.currentPage++;

            if (endId >= 1025) {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            this.showError('Erro ao carregar mais Pokémon');
        } finally {
            this.isLoading = false;
            loadMoreBtn.textContent = originalText;
        }
    }

    async searchPokemon(query) {
        if (!query.trim()) {
            this.loadInitialPokemon();
            return;
        }

        this.showLoading();
        try {
            const results = await PokemonAPI.searchPokemon(query);
            this.renderPokemonGrid(results);
            document.getElementById('load-more').style.display = 'none';
        } catch (error) {
            this.showError('Erro na busca');
        } finally {
            this.hideLoading();
        }
    }

    async filterByGeneration(generation) {
        if (generation === 'all') {
            this.loadInitialPokemon();
            return;
        }

        this.showLoading();
        try {
            const pokemon = await PokemonAPI.getPokemonByGeneration(parseInt(generation));
            this.renderPokemonGrid(pokemon);
            document.getElementById('load-more').style.display = 'none';
        } catch (error) {
            this.showError('Erro ao filtrar geração');
        } finally {
            this.hideLoading();
        }
    }

    renderPokemonGrid(pokemonList) {
        const grid = document.getElementById('pokemon-grid');
        grid.innerHTML = '';
        this.appendPokemonGrid(pokemonList);
    }

    appendPokemonGrid(pokemonList) {
        const grid = document.getElementById('pokemon-grid');

        pokemonList.forEach(pokemon => {
            const card = this.createPokemonCard(pokemon);
            grid.appendChild(card);
        });
    }

    createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.addEventListener('click', () => this.showPokemonDetails(pokemon));

        const types = pokemon.types.map(type => 
            `<span class="pokemon-type type-${type.type.name}">${type.type.name}</span>`
        ).join('');

        card.innerHTML = `
            <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
            <img src="${pokemon.sprites.front_default || PokemonAPI.getDefaultSprite(pokemon.id)}" 
                 alt="${pokemon.name}" class="pokemon-image" 
                 onerror="this.src='${PokemonAPI.getDefaultSprite(pokemon.id)}'">
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-types">${types}</div>
        `;

        return card;
    }

    showPokemonDetails(pokemon) {
        // Implementar modal de detalhes do Pokémon
        console.log('Mostrar detalhes:', pokemon);
    }

    openPokemonSelector(callback) {
        this.pokemonSelectorCallback = callback;
        const modal = document.getElementById('pokemon-selector-modal');
        modal.style.display = 'block';
        this.loadModalPokemon();
    }

    async loadModalPokemon() {
        const modalList = document.getElementById('modal-pokemon-list');
        modalList.innerHTML = '<div class="text-center">Carregando...</div>';

        try {
            const pokemon = await PokemonAPI.getPokemonRange(1, 50);
            this.renderModalPokemon(pokemon);
        } catch (error) {
            modalList.innerHTML = '<div class="text-center">Erro ao carregar Pokémon</div>';
        }
    }

    renderModalPokemon(pokemonList) {
        const modalList = document.getElementById('modal-pokemon-list');
        modalList.innerHTML = '';

        pokemonList.forEach(pokemon => {
            const item = document.createElement('div');
            item.className = 'modal-pokemon-item';
            item.addEventListener('click', () => {
                if (this.pokemonSelectorCallback) {
                    this.pokemonSelectorCallback(pokemon);
                }
                this.closeModal();
            });

            item.innerHTML = `
                <img src="${pokemon.sprites.front_default || PokemonAPI.getDefaultSprite(pokemon.id)}" 
                     alt="${pokemon.name}" 
                     onerror="this.src='${PokemonAPI.getDefaultSprite(pokemon.id)}'">
                <div>${pokemon.name}</div>
                <div>#${pokemon.id}</div>
            `;

            modalList.appendChild(item);
        });
    }

    async searchInModal(query) {
        if (!query.trim()) {
            this.loadModalPokemon();
            return;
        }

        try {
            const results = await PokemonAPI.searchPokemon(query);
            this.renderModalPokemon(results.slice(0, 20));
        } catch (error) {
            console.error('Erro na busca do modal:', error);
        }
    }

    closeModal() {
        const modal = document.getElementById('pokemon-selector-modal');
        modal.style.display = 'none';
        this.pokemonSelectorCallback = null;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        // Implementar sistema de notificações
        console.error(message);
        alert(message);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pokedxApp = new PokedxApp();
});