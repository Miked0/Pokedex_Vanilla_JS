// Pokédx V2.0 - Team Builder Module
class TeamBuilder {
    constructor() {
        this.currentTeam = Array(6).fill(null);
        this.savedTeams = this.loadSavedTeams();
        this.selectedSlot = null;
        this.init();
    }

    init() {
        this.setupTeamSlots();
        this.setupSaveButton();
        this.displaySavedTeams();
    }

    setupTeamSlots() {
        const teamSlots = document.querySelectorAll('.team-slot');

        teamSlots.forEach((slot, index) => {
            const addButton = slot.querySelector('.add-pokemon-team-btn');

            if (addButton) {
                addButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openPokemonSelector(index);
                });
            }
        });
    }

    setupSaveButton() {
        const saveButton = document.getElementById('save-team');

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveCurrentTeam();
            });
        }
    }

    openPokemonSelector(slotIndex) {
        this.selectedSlot = slotIndex;

        if (window.pokedxApp) {
            window.pokedxApp.openPokemonSelector((pokemon) => {
                this.addPokemonToTeam(pokemon, slotIndex);
            });
        }
    }

    addPokemonToTeam(pokemon, slotIndex) {
        // Verificar se o Pokémon já está na equipe
        const existingIndex = this.currentTeam.findIndex(p => p && p.id === pokemon.id);
        if (existingIndex !== -1 && existingIndex !== slotIndex) {
            alert(`${PokemonAPI.formatPokemonName(pokemon.name)} já está na equipe no slot ${existingIndex + 1}!`);
            return;
        }

        this.currentTeam[slotIndex] = pokemon;
        this.updateTeamSlot(slotIndex, pokemon);
    }

    updateTeamSlot(slotIndex, pokemon) {
        const slot = document.getElementById(`team-slot-${slotIndex + 1}`);

        if (!slot) return;

        if (pokemon) {
            const types = pokemon.types.map(type => 
                `<span class="pokemon-type type-${type.type.name}">${type.type.name}</span>`
            ).join('');

            slot.innerHTML = `
                <div class="slot-number">${slotIndex + 1}</div>
                <div class="team-pokemon">
                    <img src="${pokemon.sprites.front_default || PokemonAPI.getDefaultSprite(pokemon.id)}" 
                         alt="${pokemon.name}" class="team-pokemon-image"
                         onerror="this.src='${PokemonAPI.getDefaultSprite(pokemon.id)}'">
                    <div class="team-pokemon-info">
                        <h4 class="team-pokemon-name">${PokemonAPI.formatPokemonName(pokemon.name)}</h4>
                        <div class="team-pokemon-id">${PokemonAPI.formatPokemonId(pokemon.id)}</div>
                        <div class="team-pokemon-types">${types}</div>
                    </div>
                    <div class="team-pokemon-actions">
                        <button class="change-pokemon-btn" onclick="teamBuilder.changePokemon(${slotIndex})">
                            🔄 Trocar
                        </button>
                        <button class="remove-pokemon-btn" onclick="teamBuilder.removePokemon(${slotIndex})">
                            ✕ Remover
                        </button>
                    </div>
                </div>
            `;

            slot.classList.add('occupied');
        } else {
            slot.innerHTML = `
                <div class="slot-number">${slotIndex + 1}</div>
                <button class="add-pokemon-team-btn">+</button>
                <span class="slot-label">Clique para adicionar Pokémon</span>
            `;

            slot.classList.remove('occupied');

            // Reconfigurar event listener
            const newButton = slot.querySelector('.add-pokemon-team-btn');
            if (newButton) {
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openPokemonSelector(slotIndex);
                });
            }
        }
    }

    changePokemon(slotIndex) {
        this.openPokemonSelector(slotIndex);
    }

    removePokemon(slotIndex) {
        this.currentTeam[slotIndex] = null;
        this.updateTeamSlot(slotIndex, null);
    }

    saveCurrentTeam() {
        const teamName = document.getElementById('team-name').value.trim();
        const teamCategory = document.getElementById('team-category').value;

        if (!teamName) {
            alert('Por favor, digite um nome para a equipe!');
            return;
        }

        // Verificar se há pelo menos um Pokémon na equipe
        const pokemonInTeam = this.currentTeam.filter(p => p !== null);
        if (pokemonInTeam.length === 0) {
            alert('Adicione pelo menos um Pokémon à equipe antes de salvar!');
            return;
        }

        const teamData = {
            id: Date.now(), // ID único baseado no timestamp
            name: teamName,
            category: teamCategory,
            pokemon: [...this.currentTeam], // Cópia do array
            pokemonCount: pokemonInTeam.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Verificar se já existe uma equipe com o mesmo nome
        const existingTeamIndex = this.savedTeams.findIndex(team => team.name === teamName);

        if (existingTeamIndex !== -1) {
            const confirmed = confirm(`Já existe uma equipe com o nome "${teamName}". Deseja substituí-la?`);
            if (confirmed) {
                this.savedTeams[existingTeamIndex] = teamData;
            } else {
                return;
            }
        } else {
            this.savedTeams.push(teamData);
        }

        this.saveTeamsToStorage();
        this.displaySavedTeams();

        // Limpar formulário
        document.getElementById('team-name').value = '';

        alert(`Equipe "${teamName}" salva com sucesso!`);
    }

    saveTeamsToStorage() {
        try {
            localStorage.setItem('pokemonTeams', JSON.stringify(this.savedTeams));
        } catch (error) {
            console.error('Erro ao salvar equipes:', error);
            alert('Erro ao salvar equipe no armazenamento local.');
        }
    }

    loadSavedTeams() {
        try {
            const saved = localStorage.getItem('pokemonTeams');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Erro ao carregar equipes salvas:', error);
            return [];
        }
    }

    displaySavedTeams() {
        const container = document.getElementById('saved-teams-list');

        if (!container) return;

        if (this.savedTeams.length === 0) {
            container.innerHTML = '<p class="no-teams">Nenhuma equipe salva ainda. Crie sua primeira equipe!</p>';
            return;
        }

        const teamsHTML = this.savedTeams.map(team => this.createTeamCard(team)).join('');
        container.innerHTML = teamsHTML;
    }

    createTeamCard(team) {
        const pokemonInTeam = team.pokemon.filter(p => p !== null);
        const pokemonPreview = pokemonInTeam.slice(0, 6).map(pokemon => {
            if (!pokemon) return '<div class="empty-slot"></div>';

            return `
                <div class="team-preview-pokemon" title="${PokemonAPI.formatPokemonName(pokemon.name)}">
                    <img src="${pokemon.sprites.front_default || PokemonAPI.getDefaultSprite(pokemon.id)}" 
                         alt="${pokemon.name}"
                         onerror="this.src='${PokemonAPI.getDefaultSprite(pokemon.id)}'">
                </div>
            `;
        }).join('');

        // Preencher slots vazios se necessário
        const emptySlots = 6 - pokemonInTeam.length;
        const emptySlotHTML = '<div class="empty-slot">?</div>'.repeat(emptySlots);

        return `
            <div class="saved-team-card">
                <div class="team-header">
                    <h4 class="team-name">${team.name}</h4>
                    <span class="team-category">${team.category}</span>
                </div>
                <div class="team-preview">
                    ${pokemonPreview}${emptySlotHTML}
                </div>
                <div class="team-info">
                    <span class="pokemon-count">${team.pokemonCount}/6 Pokémon</span>
                    <span class="team-date">Criado: ${this.formatDate(team.createdAt)}</span>
                </div>
                <div class="team-actions">
                    <button class="load-team-btn" onclick="teamBuilder.loadTeam(${team.id})">
                        📥 Carregar
                    </button>
                    <button class="export-team-btn" onclick="teamBuilder.exportTeam(${team.id})">
                        📤 Exportar
                    </button>
                    <button class="delete-team-btn" onclick="teamBuilder.deleteTeam(${team.id})">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        `;
    }

    loadTeam(teamId) {
        const team = this.savedTeams.find(t => t.id === teamId);

        if (!team) {
            alert('Equipe não encontrada!');
            return;
        }

        const confirmed = confirm(`Carregar a equipe "${team.name}"? Isso substituirá a equipe atual.`);

        if (confirmed) {
            this.currentTeam = [...team.pokemon];

            // Atualizar todos os slots
            for (let i = 0; i < 6; i++) {
                this.updateTeamSlot(i, this.currentTeam[i]);
            }

            // Atualizar campos do formulário
            document.getElementById('team-name').value = team.name;
            document.getElementById('team-category').value = team.category;

            alert(`Equipe "${team.name}" carregada com sucesso!`);
        }
    }

    exportTeam(teamId) {
        const team = this.savedTeams.find(t => t.id === teamId);

        if (!team) {
            alert('Equipe não encontrada!');
            return;
        }

        const exportData = {
            name: team.name,
            category: team.category,
            pokemon: team.pokemon.map(p => p ? {
                id: p.id,
                name: p.name,
                types: p.types.map(t => t.type.name)
            } : null),
            createdAt: team.createdAt
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `equipe-${team.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        link.click();

        URL.revokeObjectURL(link.href);
    }

    deleteTeam(teamId) {
        const team = this.savedTeams.find(t => t.id === teamId);

        if (!team) {
            alert('Equipe não encontrada!');
            return;
        }

        const confirmed = confirm(`Tem certeza que deseja excluir a equipe "${team.name}"?`);

        if (confirmed) {
            this.savedTeams = this.savedTeams.filter(t => t.id !== teamId);
            this.saveTeamsToStorage();
            this.displaySavedTeams();
            alert(`Equipe "${team.name}" excluída com sucesso!`);
        }
    }

    clearCurrentTeam() {
        const confirmed = confirm('Tem certeza que deseja limpar a equipe atual?');

        if (confirmed) {
            this.currentTeam = Array(6).fill(null);

            for (let i = 0; i < 6; i++) {
                this.updateTeamSlot(i, null);
            }

            document.getElementById('team-name').value = '';
        }
    }

    getTeamStats() {
        const pokemonInTeam = this.currentTeam.filter(p => p !== null);

        if (pokemonInTeam.length === 0) {
            return null;
        }

        const totalStats = pokemonInTeam.reduce((acc, pokemon) => {
            pokemon.stats.forEach(stat => {
                if (!acc[stat.stat.name]) {
                    acc[stat.stat.name] = 0;
                }
                acc[stat.stat.name] += stat.base_stat;
            });
            return acc;
        }, {});

        const avgStats = {};
        Object.keys(totalStats).forEach(statName => {
            avgStats[statName] = Math.round(totalStats[statName] / pokemonInTeam.length);
        });

        return {
            totalPokemon: pokemonInTeam.length,
            avgStats: avgStats,
            totalStats: totalStats
        };
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    importTeam(jsonData) {
        try {
            const teamData = JSON.parse(jsonData);

            // Validar estrutura básica
            if (!teamData.name || !teamData.pokemon || !Array.isArray(teamData.pokemon)) {
                throw new Error('Formato de equipe inválido');
            }

            // Carregar Pokémon da equipe importada
            const loadPromises = teamData.pokemon.map(async (pokemonData, index) => {
                if (pokemonData && pokemonData.id) {
                    try {
                        return await PokemonAPI.getPokemon(pokemonData.id);
                    } catch (error) {
                        console.warn(`Erro ao carregar Pokémon ${pokemonData.id}:`, error);
                        return null;
                    }
                }
                return null;
            });

            Promise.all(loadPromises).then(loadedPokemon => {
                this.currentTeam = loadedPokemon;

                for (let i = 0; i < 6; i++) {
                    this.updateTeamSlot(i, this.currentTeam[i]);
                }

                document.getElementById('team-name').value = teamData.name;
                document.getElementById('team-category').value = teamData.category || 'Casual';

                alert(`Equipe "${teamData.name}" importada com sucesso!`);
            });

        } catch (error) {
            console.error('Erro ao importar equipe:', error);
            alert('Erro ao importar equipe. Verifique o formato do arquivo.');
        }
    }
}

// CSS adicional para team builder
const teamBuilderCSS = `
.team-pokemon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    height: 100%;
    justify-content: space-between;
}

.team-pokemon-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
}

.team-pokemon-info {
    text-align: center;
    flex: 1;
}

.team-pokemon-name {
    font-size: 1rem;
    margin: 0.25rem 0;
    color: var(--dark-color);
}

.team-pokemon-id {
    font-size: 0.8rem;
    color: #666;
    margin: 0.25rem 0;
}

.team-pokemon-types {
    display: flex;
    gap: 0.25rem;
    justify-content: center;
    flex-wrap: wrap;
}

.team-pokemon-types .pokemon-type {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
}

.team-pokemon-actions {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}

.change-pokemon-btn, .remove-pokemon-btn {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: var(--transition);
}

.change-pokemon-btn {
    background: var(--secondary-color);
    color: white;
}

.change-pokemon-btn:hover {
    background: #2c5aa0;
}

.remove-pokemon-btn {
    background: var(--error-color);
    color: white;
}

.remove-pokemon-btn:hover {
    background: #c53030;
}

.team-slot.occupied {
    border-color: var(--success-color);
    background: rgba(255, 255, 255, 0.95);
}

/* Saved Teams Styles */
.saved-teams {
    color: white;
}

#saved-teams-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.saved-team-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    color: var(--dark-color);
    box-shadow: var(--shadow);
}

.team-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.team-name {
    margin: 0;
    font-size: 1.25rem;
}

.team-category {
    background: var(--secondary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
}

.team-preview {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
}

.team-preview-pokemon, .empty-slot {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #e2e8f0;
}

.team-preview-pokemon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.empty-slot {
    background: #f7fafc;
    color: #a0aec0;
    font-weight: bold;
}

.team-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
}

.team-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.load-team-btn, .export-team-btn, .delete-team-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
    transition: var(--transition);
}

.load-team-btn {
    background: var(--success-color);
    color: white;
}

.load-team-btn:hover {
    background: #2f855a;
}

.export-team-btn {
    background: var(--secondary-color);
    color: white;
}

.export-team-btn:hover {
    background: #2c5aa0;
}

.delete-team-btn {
    background: var(--error-color);
    color: white;
}

.delete-team-btn:hover {
    background: #c53030;
}

.no-teams {
    text-align: center;
    font-style: italic;
    color: #a0aec0;
    grid-column: 1 / -1;
}

@media (max-width: 768px) {
    #saved-teams-list {
        grid-template-columns: 1fr;
    }

    .team-actions {
        flex-direction: column;
    }

    .team-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }

    .team-preview {
        grid-template-columns: repeat(3, 1fr);
    }

    .team-info {
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
    }
}
`;

// Adicionar CSS ao documento
if (!document.getElementById('team-builder-styles')) {
    const style = document.createElement('style');
    style.id = 'team-builder-styles';
    style.textContent = teamBuilderCSS;
    document.head.appendChild(style);
}

// Make globally available
window.TeamBuilder = TeamBuilder;