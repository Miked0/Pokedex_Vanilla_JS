/**
 * Componente PokemonGrid
 * Desenvolvido por Fernanda Martins - Frontend Specialist
 * 
 * @class PokemonGrid
 * @description Gerencia a grade de cards dos Pokémon com performance otimizada
 */

import { PokemonCard } from './PokemonCard.js';
import { createElement } from '../utils/helpers.js';

export class PokemonGrid {
    constructor(container) {
        this.container = container;
        this.cards = new Map();
        this.onCardClick = null;
        this.isRendering = false;
        this.observedElements = new Set();

        this.init();
    }

    /**
     * Inicializa o componente
     * @private
     */
    init() {
        this.setupContainer();
        this.setupEventListeners();
    }

    /**
     * Configura o container principal
     * @private
     */
    setupContainer() {
        if (!this.container) {
            throw new Error('Container do PokemonGrid não encontrado');
        }

        this.container.classList.add('pokemon-grid--initialized');
        this.container.setAttribute('role', 'grid');
        this.container.setAttribute('aria-label', 'Grade de Pokémon');
    }

    /**
     * Configura event listeners globais
     * @private
     */
    setupEventListeners() {
        // Listener para cliques nos cards
        this.container.addEventListener('pokemonCardClick', (e) => {
            if (this.onCardClick && typeof this.onCardClick === 'function') {
                this.onCardClick(e.detail.pokemon, e.detail.cardElement);
            }
        });

        // Listener para favoritos
        this.container.addEventListener('pokemonFavoriteToggle', (e) => {
            this.handleFavoriteToggle(e.detail);
        });

        // Resize observer para responsividade
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateGridLayout();
            });
            this.resizeObserver.observe(this.container);
        }
    }

    /**
     * Renderiza a lista de Pokémon
     * @param {Array} pokemonList - Lista de Pokémon para renderizar
     */
    async render(pokemonList) {
        if (this.isRendering) {
            console.warn('Renderização já em andamento...');
            return;
        }

        this.isRendering = true;

        try {
            this.showLoading();

            // Limpar cards existentes
            this.clearGrid();

            // Renderizar novos cards
            await this.renderCards(pokemonList);

            // Atualizar layout
            this.updateGridLayout();

            this.hideLoading();

        } catch (error) {
            console.error('Erro ao renderizar grid:', error);
            this.showError('Erro ao exibir Pokémon');
        } finally {
            this.isRendering = false;
        }
    }

    /**
     * Renderiza os cards dos Pokémon
     * @private
     */
    async renderCards(pokemonList) {
        const fragment = document.createDocumentFragment();

        // Renderizar em lotes para melhor performance
        const batchSize = 10;
        for (let i = 0; i < pokemonList.length; i += batchSize) {
            const batch = pokemonList.slice(i, i + batchSize);

            batch.forEach(pokemon => {
                const card = new PokemonCard(pokemon);
                const cardElement = card.render();

                this.cards.set(pokemon.id, card);
                fragment.appendChild(cardElement);
            });

            // Yield para não bloquear a UI
            if (i + batchSize < pokemonList.length) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        this.container.appendChild(fragment);

        // Animar entrada dos cards
        this.animateCardsEntrance();
    }

    /**
     * Anima a entrada dos cards
     * @private
     */
    animateCardsEntrance() {
        const cards = this.container.querySelectorAll('.pokemon-card');

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    /**
     * Limpa todos os cards do grid
     * @private
     */
    clearGrid() {
        // Destruir cards existentes
        this.cards.forEach(card => {
            card.destroy();
        });
        this.cards.clear();

        // Limpar observadores
        this.observedElements.clear();

        // Limpar container
        this.container.innerHTML = '';
    }

    /**
     * Atualiza layout do grid baseado no tamanho da tela
     * @private
     */
    updateGridLayout() {
        const containerWidth = this.container.offsetWidth;
        let columns;

        if (containerWidth < 480) {
            columns = 1;
        } else if (containerWidth < 768) {
            columns = 2;
        } else if (containerWidth < 1024) {
            columns = 3;
        } else if (containerWidth < 1200) {
            columns = 4;
        } else {
            columns = 5;
        }

        this.container.style.setProperty('--grid-columns', columns);
        this.container.setAttribute('data-columns', columns);
    }

    /**
     * Filtra cards existentes sem re-renderizar
     * @param {Function} filterFn - Função de filtro
     */
    filterCards(filterFn) {
        this.cards.forEach((card, pokemonId) => {
            const shouldShow = filterFn(card.pokemon);
            const element = card.element;

            if (element) {
                element.style.display = shouldShow ? 'block' : 'none';
                element.setAttribute('aria-hidden', (!shouldShow).toString());
            }
        });

        this.updateEmptyState();
    }

    /**
     * Ordena cards por critério específico
     * @param {Function} sortFn - Função de ordenação
     */
    sortCards(sortFn) {
        const cardElements = Array.from(this.container.querySelectorAll('.pokemon-card'));
        const sortedCards = cardElements.sort((a, b) => {
            const pokemonA = this.cards.get(parseInt(a.dataset.pokemonId)).pokemon;
            const pokemonB = this.cards.get(parseInt(b.dataset.pokemonId)).pokemon;
            return sortFn(pokemonA, pokemonB);
        });

        // Re-anexar na ordem correta
        sortedCards.forEach(card => {
            this.container.appendChild(card);
        });
    }

    /**
     * Busca card por ID
     * @param {number} pokemonId - ID do Pokémon
     * @returns {PokemonCard|null} Card encontrado ou null
     */
    getCardById(pokemonId) {
        return this.cards.get(pokemonId) || null;
    }

    /**
     * Busca cards por nome
     * @param {string} searchTerm - Termo de busca
     * @returns {Array<PokemonCard>} Cards encontrados
     */
    searchCards(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const matchingCards = [];

        this.cards.forEach(card => {
            if (card.pokemon.name.toLowerCase().includes(term) ||
                card.pokemon.id.toString() === term) {
                matchingCards.push(card);
            }
        });

        return matchingCards;
    }

    /**
     * Manipula toggle de favorito
     * @private
     */
    handleFavoriteToggle(detail) {
        console.log(`Pokémon ${detail.pokemon.name} ${detail.isFavorite ? 'adicionado aos' : 'removido dos'} favoritos`);

        // Dispatch evento global
        const event = new CustomEvent('gridFavoriteChange', {
            detail,
            bubbles: true
        });

        document.dispatchEvent(event);
    }

    /**
     * Atualiza estado vazio
     * @private
     */
    updateEmptyState() {
        const visibleCards = this.container.querySelectorAll('.pokemon-card[style*="display: block"], .pokemon-card:not([style*="display: none"])');

        if (visibleCards.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
        }
    }

    /**
     * Mostra estado de loading
     * @private
     */
    showLoading() {
        this.container.classList.add('pokemon-grid--loading');

        if (!this.container.querySelector('.grid-loading')) {
            const loading = createElement('div', {
                className: 'grid-loading'
            }, `
                <div class="loading-spinner"></div>
                <p>Carregando Pokémon...</p>
            `);

            this.container.appendChild(loading);
        }
    }

    /**
     * Oculta estado de loading
     * @private
     */
    hideLoading() {
        this.container.classList.remove('pokemon-grid--loading');

        const loading = this.container.querySelector('.grid-loading');
        if (loading) {
            loading.remove();
        }
    }

    /**
     * Mostra estado vazio
     * @private
     */
    showEmptyState() {
        if (!this.container.querySelector('.grid-empty')) {
            const empty = createElement('div', {
                className: 'grid-empty'
            }, `
                <div class="empty-icon">🔍</div>
                <h3>Nenhum Pokémon encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca</p>
            `);

            this.container.appendChild(empty);
        }
    }

    /**
     * Oculta estado vazio
     * @private
     */
    hideEmptyState() {
        const empty = this.container.querySelector('.grid-empty');
        if (empty) {
            empty.remove();
        }
    }

    /**
     * Mostra estado de erro
     * @private
     */
    showError(message) {
        this.container.innerHTML = `
            <div class="grid-error">
                <div class="error-icon">⚠️</div>
                <h3>Erro ao carregar</h3>
                <p>${message}</p>
                <button class="retry-button" onclick="location.reload()">
                    Tentar novamente
                </button>
            </div>
        `;
    }

    /**
     * Obtém estatísticas do grid
     * @returns {Object} Estatísticas do grid
     */
    getStats() {
        const totalCards = this.cards.size;
        const visibleCards = this.container.querySelectorAll('.pokemon-card:not([style*="display: none"])').length;

        return {
            total: totalCards,
            visible: visibleCards,
            hidden: totalCards - visibleCards,
            isRendering: this.isRendering
        };
    }

    /**
     * Limpa recursos e event listeners
     */
    destroy() {
        // Limpar observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        // Limpar cards
        this.clearGrid();

        // Limpar container
        this.container.classList.remove('pokemon-grid--initialized');
        this.container.removeAttribute('role');
        this.container.removeAttribute('aria-label');
    }
}