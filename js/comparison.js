// Pokédx V2.0 - Pokemon Comparison Module
class PokemonComparison {
    constructor() {
        this.selectedPokemon = [null, null];
        this.comparisonSlots = [];
        this.init();
    }

    init() {
        this.setupComparisonSlots();
    }

    setupComparisonSlots() {
        const addButtons = document.querySelectorAll('.add-pokemon-btn');

        addButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openPokemonSelector(index);
            });
        });
    }

    openPokemonSelector(slotIndex) {
        if (window.pokedxApp) {
            window.pokedxApp.openPokemonSelector((pokemon) => {
                this.addPokemonToComparison(pokemon, slotIndex);
            });
        }
    }

    addPokemonToComparison(pokemon, slotIndex) {
        this.selectedPokemon[slotIndex] = pokemon;
        this.updateComparisonSlot(slotIndex, pokemon);

        // Se ambos os Pokémon foram selecionados, mostrar comparação
        if (this.selectedPokemon[0] && this.selectedPokemon[1]) {
            this.showComparison();
        }
    }

    updateComparisonSlot(slotIndex, pokemon) {
        const slot = document.getElementById(`comparison-slot-${slotIndex + 1}`);

        if (pokemon) {
            const types = pokemon.types.map(type => 
                `<span class="pokemon-type type-${type.type.name}">${type.type.name}</span>`
            ).join('');

            slot.innerHTML = `
                <div class="comparison-pokemon">
                    <div class="pokemon-id">${PokemonAPI.formatPokemonId(pokemon.id)}</div>
                    <img src="${pokemon.sprites.front_default || PokemonAPI.getDefaultSprite(pokemon.id)}" 
                         alt="${pokemon.name}" class="pokemon-image"
                         onerror="this.src='${PokemonAPI.getDefaultSprite(pokemon.id)}'">
                    <h3 class="pokemon-name">${PokemonAPI.formatPokemonName(pokemon.name)}</h3>
                    <div class="pokemon-types">${types}</div>
                    <div class="pokemon-basic-info">
                        <div>Altura: ${(pokemon.height / 10).toFixed(1)}m</div>
                        <div>Peso: ${(pokemon.weight / 10).toFixed(1)}kg</div>
                    </div>
                    <button class="remove-pokemon-btn" onclick="pokemonComparison.removePokemon(${slotIndex})">
                        ✕ Remover
                    </button>
                </div>
            `;

            slot.classList.add('filled');
        } else {
            slot.innerHTML = `
                <button class="add-pokemon-btn" data-slot="${slotIndex}">
                    <span class="plus-icon">+</span>
                    <span class="slot-text">Clique para adicionar Pokémon</span>
                </button>
            `;
            slot.classList.remove('filled');

            // Reconfigurar event listener
            const newButton = slot.querySelector('.add-pokemon-btn');
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPokemonSelector(slotIndex);
            });
        }
    }

    removePokemon(slotIndex) {
        this.selectedPokemon[slotIndex] = null;
        this.updateComparisonSlot(slotIndex, null);
        this.clearComparison();
    }

    showComparison() {
        const pokemon1 = this.selectedPokemon[0];
        const pokemon2 = this.selectedPokemon[1];

        const comparisonHTML = this.generateComparisonHTML(pokemon1, pokemon2);

        const resultsContainer = document.getElementById('comparison-results');
        resultsContainer.innerHTML = comparisonHTML;
        resultsContainer.style.display = 'block';
    }

    generateComparisonHTML(pokemon1, pokemon2) {
        return `
            <div class="comparison-detailed">
                <h3>Comparação Detalhada</h3>

                <!-- Estatísticas Base -->
                <div class="stats-comparison">
                    <h4>Estatísticas Base</h4>
                    <div class="stats-grid">
                        ${this.generateStatsComparison(pokemon1, pokemon2)}
                    </div>
                </div>

                <!-- Informações Físicas -->
                <div class="physical-comparison">
                    <h4>Características Físicas</h4>
                    <div class="physical-grid">
                        <div class="physical-row">
                            <span class="stat-name">Altura:</span>
                            <span class="stat-value ${this.compareValues(pokemon1.height, pokemon2.height, 'pokemon1')}">${(pokemon1.height / 10).toFixed(1)}m</span>
                            <span class="stat-value ${this.compareValues(pokemon1.height, pokemon2.height, 'pokemon2')}">${(pokemon2.height / 10).toFixed(1)}m</span>
                        </div>
                        <div class="physical-row">
                            <span class="stat-name">Peso:</span>
                            <span class="stat-value ${this.compareValues(pokemon1.weight, pokemon2.weight, 'pokemon1')}">${(pokemon1.weight / 10).toFixed(1)}kg</span>
                            <span class="stat-value ${this.compareValues(pokemon1.weight, pokemon2.weight, 'pokemon2')}">${(pokemon2.weight / 10).toFixed(1)}kg</span>
                        </div>
                    </div>
                </div>

                <!-- Tipos -->
                <div class="type-comparison">
                    <h4>Vantagens de Tipo</h4>
                    <div class="type-effectiveness">
                        ${this.generateTypeEffectiveness(pokemon1, pokemon2)}
                    </div>
                </div>

                <!-- Resumo -->
                <div class="comparison-summary">
                    <h4>Resumo</h4>
                    ${this.generateSummary(pokemon1, pokemon2)}
                </div>
            </div>
        `;
    }

    generateStatsComparison(pokemon1, pokemon2) {
        const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

        return statNames.map(statName => {
            const stat1 = pokemon1.stats.find(s => s.stat.name === statName);
            const stat2 = pokemon2.stats.find(s => s.stat.name === statName);

            const value1 = stat1 ? stat1.base_stat : 0;
            const value2 = stat2 ? stat2.base_stat : 0;

            return `
                <div class="stat-row">
                    <span class="stat-name">${PokemonAPI.getStatName(statName)}:</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar">
                            <div class="stat-fill ${this.compareValues(value1, value2, 'pokemon1')}" 
                                 style="width: ${PokemonAPI.calculateStatPercentage(value1)}%"></div>
                        </div>
                        <span class="stat-value">${value1}</span>
                    </div>
                    <div class="stat-bar-container">
                        <div class="stat-bar">
                            <div class="stat-fill ${this.compareValues(value1, value2, 'pokemon2')}" 
                                 style="width: ${PokemonAPI.calculateStatPercentage(value2)}%"></div>
                        </div>
                        <span class="stat-value">${value2}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    compareValues(value1, value2, pokemon) {
        if (value1 === value2) return 'equal';
        if (pokemon === 'pokemon1') {
            return value1 > value2 ? 'better' : 'worse';
        } else {
            return value2 > value1 ? 'better' : 'worse';
        }
    }

    generateTypeEffectiveness(pokemon1, pokemon2) {
        // Implementação simplificada da efetividade de tipos
        // Em uma implementação completa, você usaria uma tabela de tipos
        const types1 = pokemon1.types.map(t => t.type.name);
        const types2 = pokemon2.types.map(t => t.type.name);

        return `
            <div class="type-info">
                <div class="pokemon-types-comparison">
                    <div>
                        <strong>${PokemonAPI.formatPokemonName(pokemon1.name)}:</strong>
                        ${types1.map(type => `<span class="pokemon-type type-${type}">${type}</span>`).join('')}
                    </div>
                    <div>
                        <strong>${PokemonAPI.formatPokemonName(pokemon2.name)}:</strong>
                        ${types2.map(type => `<span class="pokemon-type type-${type}">${type}</span>`).join('')}
                    </div>
                </div>
                <p class="type-note">Consulte uma tabela de tipos completa para análise detalhada de efetividade.</p>
            </div>
        `;
    }

    generateSummary(pokemon1, pokemon2) {
        const totalStats1 = pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const totalStats2 = pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

        let winner = '';
        if (totalStats1 > totalStats2) {
            winner = `${PokemonAPI.formatPokemonName(pokemon1.name)} tem estatísticas base superiores`;
        } else if (totalStats2 > totalStats1) {
            winner = `${PokemonAPI.formatPokemonName(pokemon2.name)} tem estatísticas base superiores`;
        } else {
            winner = 'Ambos os Pokémon têm total de estatísticas equivalente';
        }

        return `
            <div class="summary-content">
                <p><strong>Total de Estatísticas:</strong></p>
                <p>${PokemonAPI.formatPokemonName(pokemon1.name)}: ${totalStats1}</p>
                <p>${PokemonAPI.formatPokemonName(pokemon2.name)}: ${totalStats2}</p>
                <p><strong>${winner}</strong></p>
            </div>
        `;
    }

    clearComparison() {
        const resultsContainer = document.getElementById('comparison-results');
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    }

    reset() {
        this.selectedPokemon = [null, null];
        this.updateComparisonSlot(0, null);
        this.updateComparisonSlot(1, null);
        this.clearComparison();
    }
}

// CSS adicional para comparação (será adicionado dinamicamente)
const comparisonCSS = `
.comparison-pokemon {
    text-align: center;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.comparison-pokemon .pokemon-image {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin: 1rem auto;
}

.comparison-detailed {
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-top: 2rem;
}

.stats-grid, .physical-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
}

.stat-row, .physical-row {
    display: grid;
    grid-template-columns: 150px 1fr 1fr;
    align-items: center;
    gap: 1rem;
}

.stat-bar-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stat-bar {
    flex: 1;
    height: 20px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.stat-fill {
    height: 100%;
    transition: var(--transition);
    border-radius: 10px;
}

.stat-fill.better {
    background: var(--success-color);
}

.stat-fill.worse {
    background: var(--error-color);
}

.stat-fill.equal {
    background: var(--secondary-color);
}

.stat-value.better {
    color: var(--success-color);
    font-weight: bold;
}

.stat-value.worse {
    color: var(--error-color);
}

.stat-value.equal {
    color: var(--secondary-color);
    font-weight: bold;
}

.remove-pokemon-btn {
    background: var(--error-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin-top: 1rem;
    transition: var(--transition);
}

.remove-pokemon-btn:hover {
    background: #c53030;
}

.pokemon-slot.filled {
    border-style: solid;
    border-color: var(--success-color);
    background: rgba(255, 255, 255, 0.2);
}

.type-effectiveness, .comparison-summary {
    margin: 1rem 0;
}

.pokemon-types-comparison {
    display: flex;
    justify-content: space-around;
    margin: 1rem 0;
}

.type-note {
    font-style: italic;
    color: #666;
    text-align: center;
}

@media (max-width: 768px) {
    .stat-row, .physical-row {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 0.5rem;
    }

    .stat-name {
        font-weight: bold;
        margin-bottom: 0.25rem;
    }

    .pokemon-types-comparison {
        flex-direction: column;
        gap: 1rem;
    }
}
`;

// Adicionar CSS ao documento
if (!document.getElementById('comparison-styles')) {
    const style = document.createElement('style');
    style.id = 'comparison-styles';
    style.textContent = comparisonCSS;
    document.head.appendChild(style);
}

// Make globally available
window.PokemonComparison = PokemonComparison;