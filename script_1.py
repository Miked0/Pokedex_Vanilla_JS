# Vou criar o código da aplicação completa com todos os arquivos necessários

# 1. HTML Principal (index.html)
html_content = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pokédex - Gerações I, II e III</title>
    <meta name="description" content="Explore as primeiras 3 gerações de Pokémon (Kanto, Johto, Hoenn) com nossa Pokédex interativa">
    <link rel="stylesheet" href="src/styles/main.css">
    <link rel="stylesheet" href="src/styles/components.css">
    <link rel="preconnect" href="https://pokeapi.co">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="header__title">
                <span class="pokeball-icon">⚪</span>
                Pokédex
            </h1>
            <p class="header__subtitle">Gerações I, II & III</p>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <!-- Barra de Pesquisa -->
            <section class="search-section">
                <div class="search-bar" id="searchBar">
                    <input 
                        type="text" 
                        id="searchInput"
                        placeholder="Buscar Pokémon por nome ou número..."
                        class="search-input"
                        autocomplete="off"
                    >
                    <button class="search-button" id="searchButton" type="button">
                        🔍
                    </button>
                </div>
                
                <!-- Painel de Filtros -->
                <div class="filter-panel" id="filterPanel">
                    <div class="filter-group">
                        <label for="generationFilter">Geração:</label>
                        <select id="generationFilter" class="filter-select">
                            <option value="">Todas</option>
                            <option value="1">Geração I (Kanto)</option>
                            <option value="2">Geração II (Johto)</option>
                            <option value="3">Geração III (Hoenn)</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="typeFilter">Tipo:</label>
                        <select id="typeFilter" class="filter-select">
                            <option value="">Todos os tipos</option>
                        </select>
                    </div>
                    
                    <button class="filter-clear" id="clearFilters">
                        Limpar Filtros
                    </button>
                </div>
            </section>

            <!-- Loading Indicator -->
            <div class="loading" id="loadingIndicator">
                <div class="loading__spinner"></div>
                <p>Carregando Pokémon...</p>
            </div>

            <!-- Grid de Pokémon -->
            <section class="pokemon-section">
                <div class="pokemon-grid" id="pokemonGrid">
                    <!-- Os cards dos Pokémon serão inseridos aqui dinamicamente -->
                </div>
            </section>

            <!-- Paginação -->
            <section class="pagination-section">
                <div class="pagination" id="pagination">
                    <button class="pagination__btn" id="prevBtn" disabled>
                        ← Anterior
                    </button>
                    <span class="pagination__info" id="paginationInfo">
                        Página 1 de 1
                    </span>
                    <button class="pagination__btn" id="nextBtn">
                        Próximo →
                    </button>
                </div>
            </section>
        </div>
    </main>

    <!-- Modal de Detalhes -->
    <div class="modal" id="pokemonModal">
        <div class="modal__overlay" id="modalOverlay"></div>
        <div class="modal__content">
            <button class="modal__close" id="modalClose">×</button>
            <div class="modal__body" id="modalBody">
                <!-- Conteúdo do modal será inserido dinamicamente -->
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script type="module" src="src/utils/constants.js"></script>
    <script type="module" src="src/utils/helpers.js"></script>
    <script type="module" src="src/services/CacheManager.js"></script>
    <script type="module" src="src/services/PokeAPI.js"></script>
    <script type="module" src="src/components/PokemonCard.js"></script>
    <script type="module" src="src/components/SearchBar.js"></script>
    <script type="module" src="src/components/FilterPanel.js"></script>
    <script type="module" src="src/components/PokemonGrid.js"></script>
    <script type="module" src="app.js"></script>
</body>
</html>"""

# 2. App.js Principal
app_js_content = """/**
 * Pokédex Vanilla JS - Aplicação Principal
 * Coordenada pela equipe SID seguindo as melhores práticas 2025
 * 
 * @author Equipe SID
 * @version 1.0.0
 */

import { PokeAPI } from './src/services/PokeAPI.js';
import { PokemonGrid } from './src/components/PokemonGrid.js';
import { SearchBar } from './src/components/SearchBar.js';
import { FilterPanel } from './src/components/FilterPanel.js';
import { POKEMON_TYPES, GENERATION_RANGES } from './src/utils/constants.js';

class PokedexApp {
    constructor() {
        this.api = new PokeAPI();
        this.pokemonGrid = null;
        this.searchBar = null;
        this.filterPanel = null;
        this.currentPage = 1;
        this.totalPages = 1;
        this.pokemonPerPage = 20;
        this.allPokemon = [];
        this.filteredPokemon = [];
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Inicializando Pokédex App...');
            
            // Inicializar componentes
            this.initializeComponents();
            
            // Carregar dados iniciais
            await this.loadInitialData();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            console.log('✅ Pokédex App inicializada com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar a aplicação:', error);
            this.showError('Erro ao carregar a aplicação. Tente novamente.');
        }
    }

    initializeComponents() {
        // Inicializar componentes principais
        this.pokemonGrid = new PokemonGrid(document.getElementById('pokemonGrid'));
        this.searchBar = new SearchBar(document.getElementById('searchBar'));
        this.filterPanel = new FilterPanel(document.getElementById('filterPanel'));
        
        console.log('📦 Componentes inicializados');
    }

    async loadInitialData() {
        this.showLoading(true);
        
        try {
            // Carregar Pokémon das 3 primeiras gerações
            console.log('📥 Carregando Pokémon das gerações I, II e III...');
            
            const pokemonPromises = [];
            for (let i = 1; i <= 386; i++) {
                pokemonPromises.push(this.api.getPokemon(i));
            }
            
            // Carregar em lotes para melhor performance
            const batchSize = 50;
            for (let i = 0; i < pokemonPromises.length; i += batchSize) {
                const batch = pokemonPromises.slice(i, i + batchSize);
                const batchResults = await Promise.allSettled(batch);
                
                batchResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        this.allPokemon.push(result.value);
                    }
                });
                
                // Atualizar progresso
                const progress = Math.min(100, ((i + batchSize) / pokemonPromises.length) * 100);
                this.updateLoadingProgress(progress);
            }
            
            this.filteredPokemon = [...this.allPokemon];
            this.calculatePagination();
            
            // Carregar tipos para os filtros
            await this.loadPokemonTypes();
            
            // Renderizar primeira página
            this.renderCurrentPage();
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
            this.showError('Erro ao carregar os Pokémon. Verifique sua conexão.');
        } finally {
            this.showLoading(false);
        }
    }

    async loadPokemonTypes() {
        try {
            const types = await this.api.getAllTypes();
            this.filterPanel.populateTypeOptions(types);
        } catch (error) {
            console.warn('⚠️ Erro ao carregar tipos:', error);
        }
    }

    setupEventListeners() {
        // Search
        this.searchBar.onSearch = (query) => this.handleSearch(query);
        
        // Filtros
        this.filterPanel.onFilterChange = (filters) => this.handleFilterChange(filters);
        
        // Paginação
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderCurrentPage();
                this.updatePaginationUI();
            }
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.renderCurrentPage();
                this.updatePaginationUI();
            }
        });
        
        // Modal
        this.setupModalListeners();
        
        console.log('👂 Event listeners configurados');
    }

    setupModalListeners() {
        const modal = document.getElementById('pokemonModal');
        const overlay = document.getElementById('modalOverlay');
        const closeBtn = document.getElementById('modalClose');
        
        overlay.addEventListener('click', () => this.closeModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    handleSearch(query) {
        console.log('🔍 Pesquisando:', query);
        
        if (!query.trim()) {
            this.filteredPokemon = [...this.allPokemon];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.filteredPokemon = this.allPokemon.filter(pokemon => {
                return pokemon.name.toLowerCase().includes(searchTerm) ||
                       pokemon.id.toString() === searchTerm;
            });
        }
        
        this.currentPage = 1;
        this.calculatePagination();
        this.renderCurrentPage();
    }

    handleFilterChange(filters) {
        console.log('🔧 Aplicando filtros:', filters);
        
        this.filteredPokemon = this.allPokemon.filter(pokemon => {
            // Filtro por geração
            if (filters.generation) {
                const range = GENERATION_RANGES[filters.generation];
                if (pokemon.id < range.start || pokemon.id > range.end) {
                    return false;
                }
            }
            
            // Filtro por tipo
            if (filters.type) {
                const hasType = pokemon.types.some(type => 
                    type.type.name === filters.type.toLowerCase()
                );
                if (!hasType) return false;
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.calculatePagination();
        this.renderCurrentPage();
    }

    calculatePagination() {
        this.totalPages = Math.ceil(this.filteredPokemon.length / this.pokemonPerPage);
        this.updatePaginationUI();
    }

    updatePaginationUI() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const paginationInfo = document.getElementById('paginationInfo');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
        
        paginationInfo.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
    }

    renderCurrentPage() {
        const startIndex = (this.currentPage - 1) * this.pokemonPerPage;
        const endIndex = startIndex + this.pokemonPerPage;
        const pokemonToShow = this.filteredPokemon.slice(startIndex, endIndex);
        
        this.pokemonGrid.render(pokemonToShow);
        
        // Configurar cliques nos cards
        this.pokemonGrid.onCardClick = (pokemon) => this.showPokemonDetails(pokemon);
    }

    async showPokemonDetails(pokemon) {
        try {
            console.log('👀 Mostrando detalhes de:', pokemon.name);
            
            // Carregar dados adicionais se necessário
            const [species, evolutionChain] = await Promise.all([
                this.api.getPokemonSpecies(pokemon.id),
                this.api.getEvolutionChain(pokemon.id).catch(() => null)
            ]);
            
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = this.generatePokemonDetailsHTML(pokemon, species, evolutionChain);
            
            document.getElementById('pokemonModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('❌ Erro ao carregar detalhes:', error);
            this.showError('Erro ao carregar detalhes do Pokémon.');
        }
    }

    generatePokemonDetailsHTML(pokemon, species, evolutionChain) {
        const description = species?.flavor_text_entries
            ?.find(entry => entry.language.name === 'en')?.flavor_text
            ?.replace(/\\f/g, ' ') || 'Descrição não disponível';
            
        return `
            <div class="pokemon-details">
                <div class="pokemon-details__header">
                    <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}" class="pokemon-details__image">
                    <div class="pokemon-details__info">
                        <h2 class="pokemon-details__name">${pokemon.name}</h2>
                        <p class="pokemon-details__id">#${pokemon.id.toString().padStart(3, '0')}</p>
                        <div class="pokemon-details__types">
                            ${pokemon.types.map(type => 
                                `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="pokemon-details__description">
                    <p>${description}</p>
                </div>
                
                <div class="pokemon-details__stats">
                    <h3>Estatísticas Base</h3>
                    <div class="stats-list">
                        ${pokemon.stats.map(stat => `
                            <div class="stat-item">
                                <span class="stat-name">${stat.stat.name}</span>
                                <span class="stat-value">${stat.base_stat}</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${(stat.base_stat / 255) * 100}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="pokemon-details__abilities">
                    <h3>Habilidades</h3>
                    <div class="abilities-list">
                        ${pokemon.abilities.map(ability => 
                            `<span class="ability-badge">${ability.ability.name}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    closeModal() {
        document.getElementById('pokemonModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    updateLoadingProgress(progress) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const progressText = loadingIndicator.querySelector('p');
        progressText.textContent = `Carregando Pokémon... ${Math.round(progress)}%`;
    }

    showError(message) {
        // Implementar notificação de erro
        console.error('Error:', message);
        alert(message); // Temporário - substituir por toast/notification
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new PokedexApp();
});

export default PokedexApp;"""

# 3. Salvar os arquivos criados
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js_content)

print("✅ Arquivos principais criados:")
print("- index.html")
print("- app.js")