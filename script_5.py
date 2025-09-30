# Criando os componentes de pesquisa e filtros

# 10. SearchBar.js
search_bar_js = """/**
 * Componente SearchBar
 * Desenvolvido por Fernanda Martins - Frontend Specialist
 * 
 * @class SearchBar
 * @description Barra de pesquisa com funcionalidades avançadas e acessibilidade
 */

import { debounce, sanitizeString } from '../utils/helpers.js';
import { PERFORMANCE, ACCESSIBILITY } from '../utils/constants.js';

export class SearchBar {
    constructor(container) {
        this.container = container;
        this.input = null;
        this.button = null;
        this.clearButton = null;
        this.suggestions = null;
        this.onSearch = null;
        this.currentQuery = '';
        this.isActive = false;
        this.suggestionData = [];
        
        this.init();
    }

    /**
     * Inicializa o componente
     * @private
     */
    init() {
        this.findElements();
        this.setupEventListeners();
        this.createSuggestions();
        this.setupAccessibility();
    }

    /**
     * Encontra elementos necessários
     * @private
     */
    findElements() {
        if (!this.container) {
            throw new Error('Container da SearchBar não encontrado');
        }

        this.input = this.container.querySelector('#searchInput') || 
                    this.container.querySelector('.search-input');
        this.button = this.container.querySelector('#searchButton') || 
                     this.container.querySelector('.search-button');
        
        if (!this.input) {
            throw new Error('Input de pesquisa não encontrado');
        }
    }

    /**
     * Configura event listeners
     * @private
     */
    setupEventListeners() {
        // Debounced search
        const debouncedSearch = debounce((query) => {
            this.performSearch(query);
        }, PERFORMANCE.DEBOUNCE_DELAY);

        // Input events
        this.input.addEventListener('input', (e) => {
            const query = sanitizeString(e.target.value);
            this.currentQuery = query;
            
            this.updateClearButton();
            this.updateSuggestions(query);
            
            if (query.length >= 2 || query.length === 0) {
                debouncedSearch(query);
            }
        });

        // Enter key
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.currentQuery);
                this.hideSuggestions();
                this.input.blur();
            } else if (e.key === 'Escape') {
                this.clearSearch();
                this.hideSuggestions();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateSuggestions('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSuggestions('up');
            }
        });

        // Focus events
        this.input.addEventListener('focus', () => {
            this.isActive = true;
            this.container.classList.add('search-bar--active');
            
            if (this.currentQuery) {
                this.showSuggestions();
            }
        });

        this.input.addEventListener('blur', (e) => {
            // Delay para permitir clique em sugestões
            setTimeout(() => {
                this.isActive = false;
                this.container.classList.remove('search-bar--active');
                this.hideSuggestions();
            }, 150);
        });

        // Search button
        if (this.button) {
            this.button.addEventListener('click', () => {
                this.performSearch(this.currentQuery);
                this.input.focus();
            });
        }

        // Clear functionality
        this.createClearButton();
    }

    /**
     * Cria botão de limpar pesquisa
     * @private
     */
    createClearButton() {
        this.clearButton = document.createElement('button');
        this.clearButton.className = 'search-clear';
        this.clearButton.innerHTML = '×';
        this.clearButton.setAttribute('aria-label', 'Limpar pesquisa');
        this.clearButton.setAttribute('tabindex', '-1');
        this.clearButton.style.display = 'none';
        
        this.clearButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearSearch();
            this.input.focus();
        });
        
        this.container.appendChild(this.clearButton);
    }

    /**
     * Cria container de sugestões
     * @private
     */
    createSuggestions() {
        this.suggestions = document.createElement('div');
        this.suggestions.className = 'search-suggestions';
        this.suggestions.setAttribute('role', 'listbox');
        this.suggestions.setAttribute('aria-label', 'Sugestões de pesquisa');
        this.suggestions.style.display = 'none';
        
        this.container.appendChild(this.suggestions);
    }

    /**
     * Configura acessibilidade
     * @private
     */
    setupAccessibility() {
        this.input.setAttribute('role', 'searchbox');
        this.input.setAttribute('aria-label', ACCESSIBILITY.ARIA_LABELS.SEARCH);
        this.input.setAttribute('aria-describedby', 'search-help');
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('spellcheck', 'false');
        
        // Criar texto de ajuda
        const helpText = document.createElement('div');
        helpText.id = 'search-help';
        helpText.className = 'search-help sr-only';
        helpText.textContent = 'Digite o nome ou número do Pokémon. Use as setas para navegar pelas sugestões.';
        
        this.container.appendChild(helpText);
    }

    /**
     * Executa a pesquisa
     * @param {string} query - Termo de pesquisa
     * @private
     */
    performSearch(query) {
        const cleanQuery = sanitizeString(query).trim();
        
        if (this.onSearch && typeof this.onSearch === 'function') {
            this.onSearch(cleanQuery);
        }
        
        // Analytics/tracking
        this.trackSearch(cleanQuery);
        
        // Update URL
        this.updateURL(cleanQuery);
    }

    /**
     * Atualiza sugestões baseado na query
     * @param {string} query - Termo de pesquisa
     * @private
     */
    updateSuggestions(query) {
        if (!query || query.length < 2) {
            this.hideSuggestions();
            return;
        }

        const matches = this.findMatches(query);
        this.renderSuggestions(matches);
        
        if (matches.length > 0) {
            this.showSuggestions();
        } else {
            this.hideSuggestions();
        }
    }

    /**
     * Encontra correspondências para sugestões
     * @param {string} query - Termo de pesquisa
     * @private
     */
    findMatches(query) {
        if (!this.suggestionData.length) return [];
        
        const lowercaseQuery = query.toLowerCase();
        const matches = [];
        
        // Buscar por nome e ID
        this.suggestionData.forEach(pokemon => {
            const name = pokemon.name.toLowerCase();
            const id = pokemon.id.toString();
            
            if (name.startsWith(lowercaseQuery) || id === lowercaseQuery) {
                matches.push({
                    ...pokemon,
                    matchType: name.startsWith(lowercaseQuery) ? 'name' : 'id',
                    relevance: name.startsWith(lowercaseQuery) ? 
                               (name === lowercaseQuery ? 100 : 90) : 80
                });
            } else if (name.includes(lowercaseQuery)) {
                matches.push({
                    ...pokemon,
                    matchType: 'partial',
                    relevance: 70
                });
            }
        });
        
        // Ordenar por relevância
        return matches
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8); // Máximo 8 sugestões
    }

    /**
     * Renderiza sugestões na tela
     * @param {Array} matches - Correspondências encontradas
     * @private
     */
    renderSuggestions(matches) {
        this.suggestions.innerHTML = '';
        
        matches.forEach((pokemon, index) => {
            const suggestion = document.createElement('div');
            suggestion.className = 'search-suggestion';
            suggestion.setAttribute('role', 'option');
            suggestion.setAttribute('aria-selected', 'false');
            suggestion.dataset.pokemonId = pokemon.id;
            suggestion.dataset.pokemonName = pokemon.name;
            
            const highlightedName = this.highlightMatch(pokemon.name, this.currentQuery);
            
            suggestion.innerHTML = `
                <div class="suggestion-content">
                    <span class="suggestion-id">#${pokemon.id.toString().padStart(3, '0')}</span>
                    <span class="suggestion-name">${highlightedName}</span>
                </div>
                <div class="suggestion-meta">
                    ${pokemon.types ? `<span class="suggestion-type">${pokemon.types[0]}</span>` : ''}
                </div>
            `;
            
            // Event listener para clique
            suggestion.addEventListener('click', () => {
                this.selectSuggestion(pokemon);
            });
            
            // Hover events
            suggestion.addEventListener('mouseenter', () => {
                this.highlightSuggestion(index);
            });
            
            this.suggestions.appendChild(suggestion);
        });
    }

    /**
     * Destaca correspondências no texto
     * @param {string} text - Texto original
     * @param {string} query - Termo de busca
     * @private
     */
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Seleciona uma sugestão
     * @param {Object} pokemon - Dados do Pokémon selecionado
     * @private
     */
    selectSuggestion(pokemon) {
        this.input.value = pokemon.name;
        this.currentQuery = pokemon.name;
        this.performSearch(pokemon.name);
        this.hideSuggestions();
        this.updateClearButton();
    }

    /**
     * Navega pelas sugestões com teclado
     * @param {string} direction - 'up' ou 'down'
     * @private
     */
    navigateSuggestions(direction) {
        const suggestions = this.suggestions.querySelectorAll('.search-suggestion');
        if (!suggestions.length) return;
        
        const current = this.suggestions.querySelector('.search-suggestion--highlighted');
        let index = -1;
        
        if (current) {
            index = Array.from(suggestions).indexOf(current);
            current.classList.remove('search-suggestion--highlighted');
            current.setAttribute('aria-selected', 'false');
        }
        
        if (direction === 'down') {
            index = (index + 1) % suggestions.length;
        } else {
            index = index <= 0 ? suggestions.length - 1 : index - 1;
        }
        
        this.highlightSuggestion(index);
    }

    /**
     * Destaca uma sugestão específica
     * @param {number} index - Índice da sugestão
     * @private
     */
    highlightSuggestion(index) {
        const suggestions = this.suggestions.querySelectorAll('.search-suggestion');
        
        // Remover destaque anterior
        suggestions.forEach(s => {
            s.classList.remove('search-suggestion--highlighted');
            s.setAttribute('aria-selected', 'false');
        });
        
        // Adicionar novo destaque
        if (suggestions[index]) {
            suggestions[index].classList.add('search-suggestion--highlighted');
            suggestions[index].setAttribute('aria-selected', 'true');
            
            // Scroll para view se necessário
            suggestions[index].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    /**
     * Mostra sugestões
     * @private
     */
    showSuggestions() {
        this.suggestions.style.display = 'block';
        this.container.classList.add('search-bar--suggestions-open');
    }

    /**
     * Oculta sugestões
     * @private
     */
    hideSuggestions() {
        this.suggestions.style.display = 'none';
        this.container.classList.remove('search-bar--suggestions-open');
    }

    /**
     * Atualiza visibilidade do botão de limpar
     * @private
     */
    updateClearButton() {
        if (this.clearButton) {
            this.clearButton.style.display = this.currentQuery ? 'block' : 'none';
        }
    }

    /**
     * Limpa a pesquisa
     */
    clearSearch() {
        this.input.value = '';
        this.currentQuery = '';
        this.hideSuggestions();
        this.updateClearButton();
        this.performSearch('');
    }

    /**
     * Define dados para sugestões
     * @param {Array} pokemonData - Dados dos Pokémon
     */
    setSuggestionData(pokemonData) {
        this.suggestionData = pokemonData.map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types?.map(t => t.type.name) || []
        }));
    }

    /**
     * Atualiza URL com termo de pesquisa
     * @param {string} query - Termo de pesquisa
     * @private
     */
    updateURL(query) {
        if ('URLSearchParams' in window) {
            const url = new URL(window.location);
            
            if (query) {
                url.searchParams.set('search', query);
            } else {
                url.searchParams.delete('search');
            }
            
            window.history.replaceState({}, '', url);
        }
    }

    /**
     * Rastreia pesquisa para analytics
     * @param {string} query - Termo de pesquisa
     * @private
     */
    trackSearch(query) {
        // Implementar analytics se necessário
        if (query && query.length > 0) {
            console.log(`Pesquisa realizada: "${query}"`);
        }
    }

    /**
     * Obtém query atual
     * @returns {string} Query atual
     */
    getCurrentQuery() {
        return this.currentQuery;
    }

    /**
     * Define query programaticamente
     * @param {string} query - Nova query
     */
    setQuery(query) {
        this.input.value = query;
        this.currentQuery = query;
        this.updateClearButton();
        this.performSearch(query);
    }

    /**
     * Foca no input de pesquisa
     */
    focus() {
        this.input.focus();
    }

    /**
     * Limpa recursos e event listeners
     */
    destroy() {
        // Event listeners são removidos automaticamente quando elemento é removido
        if (this.suggestions && this.suggestions.parentNode) {
            this.suggestions.parentNode.removeChild(this.suggestions);
        }
        
        if (this.clearButton && this.clearButton.parentNode) {
            this.clearButton.parentNode.removeChild(this.clearButton);
        }
    }
}"""

# 11. FilterPanel.js
filter_panel_js = """/**
 * Componente FilterPanel
 * Desenvolvido por Fernanda Martins - Frontend Specialist
 * 
 * @class FilterPanel
 * @description Painel de filtros com funcionalidades avançadas
 */

import { capitalize, debounce } from '../utils/helpers.js';
import { GENERATION_RANGES, PERFORMANCE } from '../utils/constants.js';

export class FilterPanel {
    constructor(container) {
        this.container = container;
        this.generationSelect = null;
        this.typeSelect = null;
        this.clearButton = null;
        this.onFilterChange = null;
        this.currentFilters = {
            generation: '',
            type: '',
            favorites: false,
            sortBy: 'id',
            sortOrder: 'asc'
        };
        this.isCollapsed = false;
        
        this.init();
    }

    /**
     * Inicializa o componente
     * @private
     */
    init() {
        this.findElements();
        this.setupEventListeners();
        this.setupAccessibility();
        this.loadSavedFilters();
    }

    /**
     * Encontra elementos do DOM
     * @private
     */
    findElements() {
        if (!this.container) {
            throw new Error('Container do FilterPanel não encontrado');
        }

        this.generationSelect = this.container.querySelector('#generationFilter');
        this.typeSelect = this.container.querySelector('#typeFilter');
        this.clearButton = this.container.querySelector('#clearFilters');
        
        if (!this.generationSelect || !this.typeSelect) {
            throw new Error('Elementos de filtro não encontrados');
        }
    }

    /**
     * Configura event listeners
     * @private
     */
    setupEventListeners() {
        // Debounced filter change
        const debouncedFilterChange = debounce(() => {
            this.applyFilters();
        }, PERFORMANCE.DEBOUNCE_DELAY);

        // Generation filter
        this.generationSelect.addEventListener('change', (e) => {
            this.currentFilters.generation = e.target.value;
            this.updateTypeOptions();
            debouncedFilterChange();
        });

        // Type filter
        this.typeSelect.addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            debouncedFilterChange();
        });

        // Clear filters
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Advanced filters (if they exist)
        this.setupAdvancedFilters();
        
        // Responsive behavior
        this.setupResponsiveBehavior();
    }

    /**
     * Configura filtros avançados
     * @private
     */
    setupAdvancedFilters() {
        // Sort options
        const sortSelect = this.container.querySelector('#sortFilter');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                this.currentFilters.sortBy = sortBy;
                this.currentFilters.sortOrder = sortOrder;
                this.applyFilters();
            });
        }

        // Favorites toggle
        const favoritesToggle = this.container.querySelector('#favoritesFilter');
        if (favoritesToggle) {
            favoritesToggle.addEventListener('change', (e) => {
                this.currentFilters.favorites = e.target.checked;
                this.applyFilters();
            });
        }

        // Stats range filters
        this.setupStatsFilters();
    }

    /**
     * Configura filtros por estatísticas
     * @private
     */
    setupStatsFilters() {
        const statFilters = this.container.querySelectorAll('.stat-filter');
        
        statFilters.forEach(filter => {
            const minRange = filter.querySelector('.stat-min');
            const maxRange = filter.querySelector('.stat-max');
            const statName = filter.dataset.stat;
            
            if (minRange && maxRange) {
                [minRange, maxRange].forEach(range => {
                    range.addEventListener('input', debounce(() => {
                        this.currentFilters[`${statName}Min`] = parseInt(minRange.value);
                        this.currentFilters[`${statName}Max`] = parseInt(maxRange.value);
                        this.applyFilters();
                    }, 300));
                });
            }
        });
    }

    /**
     * Configura comportamento responsivo
     * @private
     */
    setupResponsiveBehavior() {
        // Toggle para mobile
        const toggleButton = this.createToggleButton();
        
        // Media query listener
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleMediaQuery = (e) => {
            if (e.matches) {
                this.enableMobileMode();
            } else {
                this.disableMobileMode();
            }
        };
        
        mediaQuery.addListener(handleMediaQuery);
        handleMediaQuery(mediaQuery);
    }

    /**
     * Cria botão de toggle para mobile
     * @private
     */
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'filter-toggle';
        button.innerHTML = `
            <span class="filter-toggle__text">Filtros</span>
            <span class="filter-toggle__icon">⚙️</span>
        `;
        button.setAttribute('aria-label', 'Mostrar/Ocultar filtros');
        button.setAttribute('aria-expanded', 'true');
        
        button.addEventListener('click', () => {
            this.togglePanel();
        });
        
        this.container.parentNode.insertBefore(button, this.container);
        return button;
    }

    /**
     * Ativa modo mobile
     * @private
     */
    enableMobileMode() {
        this.container.classList.add('filter-panel--mobile');
        if (window.innerWidth <= 768) {
            this.collapsePanel();
        }
    }

    /**
     * Desativa modo mobile
     * @private
     */
    disableMobileMode() {
        this.container.classList.remove('filter-panel--mobile');
        this.expandPanel();
    }

    /**
     * Alterna visibilidade do painel
     */
    togglePanel() {
        if (this.isCollapsed) {
            this.expandPanel();
        } else {
            this.collapsePanel();
        }
    }

    /**
     * Recolhe o painel
     * @private
     */
    collapsePanel() {
        this.isCollapsed = true;
        this.container.classList.add('filter-panel--collapsed');
        
        const toggleBtn = this.container.parentNode.querySelector('.filter-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Expande o painel
     * @private
     */
    expandPanel() {
        this.isCollapsed = false;
        this.container.classList.remove('filter-panel--collapsed');
        
        const toggleBtn = this.container.parentNode.querySelector('.filter-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    }

    /**
     * Configura acessibilidade
     * @private
     */
    setupAccessibility() {
        this.container.setAttribute('role', 'group');
        this.container.setAttribute('aria-label', 'Filtros de Pokémon');
        
        // Labels para selects
        this.generationSelect.setAttribute('aria-label', 'Filtrar por geração');
        this.typeSelect.setAttribute('aria-label', 'Filtrar por tipo');
        
        if (this.clearButton) {
            this.clearButton.setAttribute('aria-label', 'Limpar todos os filtros');
        }
    }

    /**
     * Popula opções de tipos
     * @param {Array} types - Lista de tipos disponíveis
     */
    populateTypeOptions(types) {
        // Limpar opções existentes (exceto "Todos")
        while (this.typeSelect.children.length > 1) {
            this.typeSelect.removeChild(this.typeSelect.lastChild);
        }
        
        // Adicionar novos tipos
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = capitalize(type.name);
            this.typeSelect.appendChild(option);
        });
        
        // Atualizar baseado na geração atual
        this.updateTypeOptions();
    }

    /**
     * Atualiza opções de tipos baseado na geração selecionada
     * @private
     */
    updateTypeOptions() {
        const generation = this.currentFilters.generation;
        const options = this.typeSelect.querySelectorAll('option:not(:first-child)');
        
        options.forEach(option => {
            // Lógica para mostrar/ocultar tipos por geração
            const isRelevantToGeneration = this.isTypeRelevantToGeneration(
                option.value, 
                generation
            );
            
            option.style.display = isRelevantToGeneration ? 'block' : 'none';
        });
    }

    /**
     * Verifica se tipo é relevante para a geração
     * @param {string} type - Nome do tipo
     * @param {string} generation - Número da geração
     * @private
     */
    isTypeRelevantToGeneration(type, generation) {
        // Por simplicidade, todos os tipos estão disponíveis
        // Em uma implementação mais complexa, poderia filtrar por geração
        return true;
    }

    /**
     * Aplica filtros atuais
     * @private
     */
    applyFilters() {
        if (this.onFilterChange && typeof this.onFilterChange === 'function') {
            this.onFilterChange({ ...this.currentFilters });
        }
        
        // Salvar filtros no localStorage
        this.saveFilters();
        
        // Atualizar interface
        this.updateFilterDisplay();
        
        // Analytics
        this.trackFilterUsage();
    }

    /**
     * Atualiza exibição dos filtros ativos
     * @private
     */
    updateFilterDisplay() {
        // Contar filtros ativos
        const activeFilters = this.getActiveFiltersCount();
        
        // Atualizar badge de contagem
        this.updateFilterBadge(activeFilters);
        
        // Atualizar classes CSS
        this.container.classList.toggle('filter-panel--has-filters', activeFilters > 0);
        
        // Atualizar botão de limpar
        if (this.clearButton) {
            this.clearButton.disabled = activeFilters === 0;
            this.clearButton.textContent = `Limpar (${activeFilters})`;
        }
    }

    /**
     * Conta filtros ativos
     * @private
     */
    getActiveFiltersCount() {
        let count = 0;
        
        if (this.currentFilters.generation) count++;
        if (this.currentFilters.type) count++;
        if (this.currentFilters.favorites) count++;
        
        // Contar filtros de stats se existirem
        Object.keys(this.currentFilters).forEach(key => {
            if (key.includes('Min') || key.includes('Max')) {
                if (this.currentFilters[key] !== undefined) count++;
            }
        });
        
        return count;
    }

    /**
     * Atualiza badge de contagem de filtros
     * @private
     */
    updateFilterBadge(count) {
        let badge = this.container.querySelector('.filter-badge');
        
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'filter-badge';
                badge.setAttribute('aria-label', `${count} filtros ativos`);
                this.container.appendChild(badge);
            }
            badge.textContent = count;
        } else if (badge) {
            badge.remove();
        }
    }

    /**
     * Limpa todos os filtros
     */
    clearAllFilters() {
        // Reset filters
        this.currentFilters = {
            generation: '',
            type: '',
            favorites: false,
            sortBy: 'id',
            sortOrder: 'asc'
        };
        
        // Reset UI
        this.generationSelect.value = '';
        this.typeSelect.value = '';
        
        const favoritesToggle = this.container.querySelector('#favoritesFilter');
        if (favoritesToggle) {
            favoritesToggle.checked = false;
        }
        
        const sortSelect = this.container.querySelector('#sortFilter');
        if (sortSelect) {
            sortSelect.value = 'id-asc';
        }
        
        // Reset stat filters
        const statRanges = this.container.querySelectorAll('.stat-filter input[type="range"]');
        statRanges.forEach(range => {
            range.value = range.defaultValue;
        });
        
        // Apply cleared filters
        this.applyFilters();
    }

    /**
     * Salva filtros no localStorage
     * @private
     */
    saveFilters() {
        try {
            localStorage.setItem('pokedex_filters', JSON.stringify(this.currentFilters));
        } catch (error) {
            console.warn('Erro ao salvar filtros:', error);
        }
    }

    /**
     * Carrega filtros salvos
     * @private
     */
    loadSavedFilters() {
        try {
            const saved = localStorage.getItem('pokedex_filters');
            if (saved) {
                const filters = JSON.parse(saved);
                this.currentFilters = { ...this.currentFilters, ...filters };
                this.updateUIFromFilters();
            }
        } catch (error) {
            console.warn('Erro ao carregar filtros salvos:', error);
        }
    }

    /**
     * Atualiza UI baseado nos filtros salvos
     * @private
     */
    updateUIFromFilters() {
        this.generationSelect.value = this.currentFilters.generation;
        this.typeSelect.value = this.currentFilters.type;
        
        const favoritesToggle = this.container.querySelector('#favoritesFilter');
        if (favoritesToggle) {
            favoritesToggle.checked = this.currentFilters.favorites;
        }
        
        const sortSelect = this.container.querySelector('#sortFilter');
        if (sortSelect) {
            sortSelect.value = `${this.currentFilters.sortBy}-${this.currentFilters.sortOrder}`;
        }
    }

    /**
     * Rastreia uso de filtros para analytics
     * @private
     */
    trackFilterUsage() {
        const activeFilters = this.getActiveFiltersCount();
        if (activeFilters > 0) {
            console.log('Filtros aplicados:', this.currentFilters);
        }
    }

    /**
     * Obtém filtros atuais
     * @returns {Object} Filtros atuais
     */
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    /**
     * Define filtros programaticamente
     * @param {Object} filters - Novos filtros
     */
    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        this.updateUIFromFilters();
        this.applyFilters();
    }

    /**
     * Limpa recursos e event listeners
     */
    destroy() {
        const toggleBtn = this.container.parentNode.querySelector('.filter-toggle');
        if (toggleBtn && toggleBtn.parentNode) {
            toggleBtn.parentNode.removeChild(toggleBtn);
        }
    }
}"""

# Salvar componentes de pesquisa e filtros
with open('src/components/SearchBar.js', 'w', encoding='utf-8') as f:
    f.write(search_bar_js)

with open('src/components/FilterPanel.js', 'w', encoding='utf-8') as f:
    f.write(filter_panel_js)

print("✅ Componentes de pesquisa e filtros criados:")
print("- src/components/SearchBar.js")
print("- src/components/FilterPanel.js")