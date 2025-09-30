/**
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
}