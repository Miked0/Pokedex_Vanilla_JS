// Pokédx V2.0 - Pokemon API Handler
class PokemonAPI {
    static BASE_URL = 'https://pokeapi.co/api/v2';
    static SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

    static GENERATIONS = {
        1: { name: "Gen 1 - Kanto", range: [1, 151] },
        2: { name: "Gen 2 - Johto", range: [152, 251] },
        3: { name: "Gen 3 - Hoenn", range: [252, 386] },
        4: { name: "Gen 4 - Sinnoh", range: [387, 493] },
        5: { name: "Gen 5 - Unova", range: [494, 649] },
        6: { name: "Gen 6 - Kalos", range: [650, 721] },
        7: { name: "Gen 7 - Alola", range: [722, 809] },
        8: { name: "Gen 8 - Galar", range: [810, 905] },
        9: { name: "Gen 9 - Paldea", range: [906, 1025] }
    };

    static cache = new Map();

    static async fetchWithCache(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.cache.set(url, data);
            return data;
        } catch (error) {
            console.error(`Erro ao buscar ${url}:`, error);
            throw error;
        }
    }

    static async getPokemon(id) {
        const url = `${this.BASE_URL}/pokemon/${id}`;
        return await this.fetchWithCache(url);
    }

    static async getPokemonSpecies(id) {
        const url = `${this.BASE_URL}/pokemon-species/${id}`;
        return await this.fetchWithCache(url);
    }

    static async getPokemonRange(start, end) {
        const promises = [];
        for (let i = start; i <= end; i++) {
            promises.push(this.getPokemon(i));
        }

        try {
            const results = await Promise.all(promises);
            return results.filter(pokemon => pokemon !== null);
        } catch (error) {
            console.error('Erro ao buscar range de Pokémon:', error);
            // Retornar resultados parciais em caso de erro
            return [];
        }
    }

    static async getPokemonByGeneration(generation) {
        if (!this.GENERATIONS[generation]) {
            throw new Error('Geração inválida');
        }

        const { range } = this.GENERATIONS[generation];
        return await this.getPokemonRange(range[0], range[1]);
    }

    static async searchPokemon(query) {
        const normalizedQuery = query.toLowerCase().trim();

        // Se é um número, buscar por ID
        if (!isNaN(normalizedQuery)) {
            const id = parseInt(normalizedQuery);
            if (id > 0 && id <= 1025) {
                try {
                    const pokemon = await this.getPokemon(id);
                    return [pokemon];
                } catch (error) {
                    return [];
                }
            }
        }

        // Buscar por nome (implementação simplificada)
        // Em uma implementação real, você poderia ter um índice de busca
        try {
            const pokemon = await this.getPokemon(normalizedQuery);
            return [pokemon];
        } catch (error) {
            // Se não encontrar por nome exato, retornar array vazio
            // Aqui você poderia implementar busca fuzzy ou por iniciais
            return [];
        }
    }

    static getDefaultSprite(id) {
        return `${this.SPRITE_BASE_URL}/${id}.png`;
    }

    static getOfficialArtwork(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    }

    static async getPokemonEvolutionChain(id) {
        try {
            const species = await this.getPokemonSpecies(id);
            const evolutionUrl = species.evolution_chain.url;
            return await this.fetchWithCache(evolutionUrl);
        } catch (error) {
            console.error('Erro ao buscar cadeia evolutiva:', error);
            return null;
        }
    }

    static async getAllTypes() {
        const url = `${this.BASE_URL}/type`;
        try {
            const response = await this.fetchWithCache(url);
            return response.results;
        } catch (error) {
            console.error('Erro ao buscar tipos:', error);
            return [];
        }
    }

    static async getPokemonByType(typeName) {
        const url = `${this.BASE_URL}/type/${typeName}`;
        try {
            const typeData = await this.fetchWithCache(url);
            return typeData.pokemon.map(p => p.pokemon);
        } catch (error) {
            console.error('Erro ao buscar Pokémon por tipo:', error);
            return [];
        }
    }

    static getTypeColor(typeName) {
        const colors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };

        return colors[typeName] || '#666666';
    }

    static formatPokemonName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    static formatPokemonId(id) {
        return `#${id.toString().padStart(3, '0')}`;
    }

    static getStatName(statName) {
        const statNames = {
            'hp': 'HP',
            'attack': 'Ataque',
            'defense': 'Defesa',
            'special-attack': 'At. Esp.',
            'special-defense': 'Def. Esp.',
            'speed': 'Velocidade'
        };

        return statNames[statName] || statName;
    }

    static calculateStatPercentage(statValue) {
        // Considerando que 255 é o máximo teórico para uma stat
        return Math.min((statValue / 255) * 100, 100);
    }

    static async getRandomPokemon() {
        const randomId = Math.floor(Math.random() * 1025) + 1;
        return await this.getPokemon(randomId);
    }

    static async getMultipleRandomPokemon(count = 6) {
        const promises = [];
        const usedIds = new Set();

        while (promises.length < count) {
            const randomId = Math.floor(Math.random() * 1025) + 1;
            if (!usedIds.has(randomId)) {
                usedIds.add(randomId);
                promises.push(this.getPokemon(randomId));
            }
        }

        try {
            return await Promise.all(promises);
        } catch (error) {
            console.error('Erro ao buscar Pokémon aleatórios:', error);
            return [];
        }
    }

    static clearCache() {
        this.cache.clear();
    }

    static getCacheSize() {
        return this.cache.size;
    }
}

// Make PokemonAPI available globally
window.PokemonAPI = PokemonAPI;