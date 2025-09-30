/**
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
}