/**
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
}