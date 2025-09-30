# Criando os componentes da interface

# 8. PokemonCard.js
pokemon_card_js = """/**
 * Componente PokemonCard
 * Desenvolvido por Fernanda Martins - Frontend Specialist
 * 
 * @class PokemonCard
 * @description Renderiza um card individual do Pokémon com design responsivo
 */

import { 
    capitalize, 
    formatPokemonId, 
    getTypeColor, 
    getPokemonArtworkUrl,
    createElement 
} from '../utils/helpers.js';

export class PokemonCard {
    constructor(pokemon) {
        this.pokemon = pokemon;
        this.element = null;
        this.isLoaded = false;
    }

    /**
     * Renderiza o card do Pokémon
     * @returns {HTMLElement} Elemento DOM do card
     */
    render() {
        this.element = this.createElement();
        this.setupEventListeners();
        this.lazyLoadImage();
        return this.element;
    }

    /**
     * Cria a estrutura HTML do card
     * @private
     */
    createElement() {
        const primaryType = this.pokemon.types[0].type.name;
        const cardElement = createElement('div', {
            className: `pokemon-card pokemon-card--${primaryType}`,
            dataset: {
                pokemonId: this.pokemon.id,
                pokemonName: this.pokemon.name,
                pokemonTypes: this.pokemon.types.map(t => t.type.name).join(',')
            },
            role: 'button',
            tabindex: '0',
            'aria-label': `Ver detalhes de ${capitalize(this.pokemon.name)}`
        });

        cardElement.innerHTML = `
            <div class="pokemon-card__header">
                <span class="pokemon-card__id">#${formatPokemonId(this.pokemon.id)}</span>
                <div class="pokemon-card__favorite" data-favorite="false">
                    <span class="favorite-icon">☆</span>
                </div>
            </div>
            
            <div class="pokemon-card__image-container">
                <div class="pokemon-card__image-placeholder">
                    <div class="loading-spinner"></div>
                </div>
                <img 
                    class="pokemon-card__image" 
                    data-src="${this.getImageUrl()}"
                    alt="${capitalize(this.pokemon.name)}"
                    loading="lazy"
                    style="opacity: 0;"
                >
            </div>
            
            <div class="pokemon-card__content">
                <h3 class="pokemon-card__name">${capitalize(this.pokemon.name)}</h3>
                <div class="pokemon-card__types">
                    ${this.renderTypes()}
                </div>
                <div class="pokemon-card__stats">
                    ${this.renderQuickStats()}
                </div>
            </div>
            
            <div class="pokemon-card__overlay">
                <span class="pokemon-card__cta">Ver detalhes</span>
            </div>
        `;

        return cardElement;
    }

    /**
     * Renderiza os tipos do Pokémon
     * @private
     */
    renderTypes() {
        return this.pokemon.types
            .map(typeInfo => {
                const typeName = typeInfo.type.name;
                const color = getTypeColor(typeName);
                return `
                    <span 
                        class="type-badge type-badge--${typeName}" 
                        style="background-color: ${color}"
                    >
                        ${capitalize(typeName)}
                    </span>
                `;
            })
            .join('');
    }

    /**
     * Renderiza estatísticas rápidas
     * @private
     */
    renderQuickStats() {
        const hp = this.pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
        const attack = this.pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
        const defense = this.pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;

        return `
            <div class="quick-stats">
                <div class="quick-stat">
                    <span class="quick-stat__label">HP</span>
                    <span class="quick-stat__value">${hp}</span>
                </div>
                <div class="quick-stat">
                    <span class="quick-stat__label">ATK</span>
                    <span class="quick-stat__value">${attack}</span>
                </div>
                <div class="quick-stat">
                    <span class="quick-stat__label">DEF</span>
                    <span class="quick-stat__value">${defense}</span>
                </div>
            </div>
        `;
    }

    /**
     * Obtém URL da imagem com fallback
     * @private
     */
    getImageUrl() {
        const artworkUrl = this.pokemon.sprites?.other?.['official-artwork']?.front_default;
        const spriteUrl = this.pokemon.sprites?.front_default;
        
        return artworkUrl || spriteUrl || getPokemonArtworkUrl(this.pokemon.id);
    }

    /**
     * Configura lazy loading da imagem
     * @private
     */
    lazyLoadImage() {
        const img = this.element.querySelector('.pokemon-card__image');
        const placeholder = this.element.querySelector('.pokemon-card__image-placeholder');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(img, placeholder);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px' });
            
            observer.observe(this.element);
        } else {
            // Fallback para navegadores sem suporte
            this.loadImage(img, placeholder);
        }
    }

    /**
     * Carrega a imagem com tratamento de erro
     * @private
     */
    loadImage(img, placeholder) {
        const src = img.dataset.src;
        
        img.onload = () => {
            img.style.opacity = '1';
            placeholder.style.display = 'none';
            this.isLoaded = true;
            this.element.classList.add('pokemon-card--loaded');
        };
        
        img.onerror = () => {
            // Tentar sprite padrão como fallback
            const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon.id}.png`;
            if (src !== fallbackUrl) {
                img.src = fallbackUrl;
            } else {
                // Mostrar placeholder de erro
                placeholder.innerHTML = `
                    <div class="error-placeholder">
                        <span>?</span>
                    </div>
                `;
                placeholder.style.display = 'flex';
            }
        };
        
        img.src = src;
    }

    /**
     * Configura event listeners do card
     * @private
     */
    setupEventListeners() {
        // Click para abrir detalhes
        this.element.addEventListener('click', (e) => {
            if (!e.target.closest('.pokemon-card__favorite')) {
                this.handleCardClick();
            }
        });

        // Enter key para acessibilidade
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCardClick();
            }
        });

        // Hover effects
        this.element.addEventListener('mouseenter', () => {
            this.element.classList.add('pokemon-card--hover');
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.classList.remove('pokemon-card--hover');
        });

        // Favoritos
        const favoriteBtn = this.element.querySelector('.pokemon-card__favorite');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite();
        });
    }

    /**
     * Manipula o clique no card
     * @private
     */
    handleCardClick() {
        this.element.classList.add('pokemon-card--clicked');
        
        // Dispatch evento customizado
        const event = new CustomEvent('pokemonCardClick', {
            detail: {
                pokemon: this.pokemon,
                cardElement: this.element
            },
            bubbles: true
        });
        
        this.element.dispatchEvent(event);
        
        // Remover classe após animação
        setTimeout(() => {
            this.element.classList.remove('pokemon-card--clicked');
        }, 200);
    }

    /**
     * Alterna estado de favorito
     * @private
     */
    toggleFavorite() {
        const favoriteElement = this.element.querySelector('.pokemon-card__favorite');
        const icon = favoriteElement.querySelector('.favorite-icon');
        const isFavorite = favoriteElement.dataset.favorite === 'true';
        
        favoriteElement.dataset.favorite = (!isFavorite).toString();
        icon.textContent = isFavorite ? '☆' : '★';
        
        // Salvar nos favoritos do localStorage
        this.updateFavoriteStorage(!isFavorite);
        
        // Dispatch evento
        const event = new CustomEvent('pokemonFavoriteToggle', {
            detail: {
                pokemon: this.pokemon,
                isFavorite: !isFavorite
            },
            bubbles: true
        });
        
        this.element.dispatchEvent(event);
    }

    /**
     * Atualiza storage de favoritos
     * @private
     */
    updateFavoriteStorage(isFavorite) {
        try {
            const favorites = JSON.parse(localStorage.getItem('pokedex_favorites') || '[]');
            
            if (isFavorite) {
                if (!favorites.includes(this.pokemon.id)) {
                    favorites.push(this.pokemon.id);
                }
            } else {
                const index = favorites.indexOf(this.pokemon.id);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
            }
            
            localStorage.setItem('pokedex_favorites', JSON.stringify(favorites));
        } catch (error) {
            console.warn('Erro ao salvar favoritos:', error);
        }
    }

    /**
     * Verifica se o Pokémon está nos favoritos
     * @private
     */
    checkFavoriteStatus() {
        try {
            const favorites = JSON.parse(localStorage.getItem('pokedex_favorites') || '[]');
            return favorites.includes(this.pokemon.id);
        } catch (error) {
            return false;
        }
    }

    /**
     * Atualiza os dados do Pokémon
     * @param {Object} newPokemonData - Novos dados do Pokémon
     */
    updateData(newPokemonData) {
        this.pokemon = newPokemonData;
        if (this.element) {
            const newElement = this.createElement();
            this.element.replaceWith(newElement);
            this.element = newElement;
            this.setupEventListeners();
        }
    }

    /**
     * Remove o card do DOM
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    /**
     * Obtém informações do card para filtragem
     * @returns {Object} Dados para filtragem
     */
    getFilterData() {
        return {
            id: this.pokemon.id,
            name: this.pokemon.name,
            types: this.pokemon.types.map(t => t.type.name),
            stats: this.pokemon.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
            }, {})
        };
    }
}"""

# 9. PokemonGrid.js
pokemon_grid_js = """/**
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
}"""

# Salvar componentes
os.makedirs('src/components', exist_ok=True)

with open('src/components/PokemonCard.js', 'w', encoding='utf-8') as f:
    f.write(pokemon_card_js)

with open('src/components/PokemonGrid.js', 'w', encoding='utf-8') as f:
    f.write(pokemon_grid_js)

print("✅ Componentes criados:")
print("- src/components/PokemonCard.js")
print("- src/components/PokemonGrid.js")