/**
 * Serviço para integração com PokeAPI
 * Desenvolvido por Michael Douglas - Backend Specialist
 * 
 * @class PokeAPI
 * @description Gerencia todas as requisições à PokeAPI com cache e otimizações
 */

import { CacheManager } from './CacheManager.js';
import { API_BASE_URL, CACHE_DURATION } from '../utils/constants.js';

export class PokeAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.cache = new CacheManager();
        this.requestQueue = new Map();
    }

    /**
     * Busca informações de um Pokémon específico
     * @param {number|string} id - ID ou nome do Pokémon
     * @returns {Promise<Object>} Dados do Pokémon
     */
    async getPokemon(id) {
        const cacheKey = `pokemon_${id}`;

        // Verificar cache primeiro
        const cached = this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }

        // Evitar requisições duplicadas
        if (this.requestQueue.has(cacheKey)) {
            return this.requestQueue.get(cacheKey);
        }

        const request = this.fetchWithRetry(`${this.baseURL}/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                // Armazenar no cache
                this.cache.set(cacheKey, data, CACHE_DURATION.POKEMON);
                this.requestQueue.delete(cacheKey);
                return data;
            })
            .catch(error => {
                this.requestQueue.delete(cacheKey);
                throw error;
            });

        this.requestQueue.set(cacheKey, request);
        return request;
    }

    /**
     * Busca informações da espécie do Pokémon
     * @param {number} id - ID do Pokémon
     * @returns {Promise<Object>} Dados da espécie
     */
    async getPokemonSpecies(id) {
        const cacheKey = `species_${id}`;

        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.fetchWithRetry(`${this.baseURL}/pokemon-species/${id}`);
            const data = await response.json();

            this.cache.set(cacheKey, data, CACHE_DURATION.SPECIES);
            return data;
        } catch (error) {
            console.warn(`Erro ao buscar espécie do Pokémon ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca a cadeia evolutiva do Pokémon
     * @param {number} pokemonId - ID do Pokémon
     * @returns {Promise<Object>} Dados da evolução
     */
    async getEvolutionChain(pokemonId) {
        try {
            const species = await this.getPokemonSpecies(pokemonId);
            const evolutionUrl = species.evolution_chain.url;
            const evolutionId = evolutionUrl.split('/').slice(-2)[0];

            const cacheKey = `evolution_${evolutionId}`;
            const cached = this.cache.get(cacheKey);
            if (cached) return cached;

            const response = await this.fetchWithRetry(evolutionUrl);
            const data = await response.json();

            this.cache.set(cacheKey, data, CACHE_DURATION.EVOLUTION);
            return data;
        } catch (error) {
            console.warn(`Erro ao buscar evolução do Pokémon ${pokemonId}:`, error);
            throw error;
        }
    }

    /**
     * Busca todos os tipos de Pokémon
     * @returns {Promise<Array>} Lista de tipos
     */
    async getAllTypes() {
        const cacheKey = 'all_types';
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.fetchWithRetry(`${this.baseURL}/type`);
            const data = await response.json();

            // Filtrar apenas os tipos das primeiras 3 gerações
            const relevantTypes = data.results.filter(type => {
                const typeId = parseInt(type.url.split('/').slice(-2)[0]);
                return typeId <= 18; // Tipos até a 3ª geração
            });

            this.cache.set(cacheKey, relevantTypes, CACHE_DURATION.TYPES);
            return relevantTypes;
        } catch (error) {
            console.error('Erro ao buscar tipos:', error);
            throw error;
        }
    }

    /**
     * Busca Pokémon por geração
     * @param {number} generation - Número da geração (1-3)
     * @returns {Promise<Array>} Lista de Pokémon da geração
     */
    async getPokemonByGeneration(generation) {
        const cacheKey = `generation_${generation}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.fetchWithRetry(`${this.baseURL}/generation/${generation}`);
            const data = await response.json();

            this.cache.set(cacheKey, data.pokemon_species, CACHE_DURATION.GENERATION);
            return data.pokemon_species;
        } catch (error) {
            console.error(`Erro ao buscar geração ${generation}:`, error);
            throw error;
        }
    }

    /**
     * Busca múltiplos Pokémon em paralelo
     * @param {Array<number>} ids - Lista de IDs
     * @returns {Promise<Array>} Lista de Pokémon
     */
    async getMultiplePokemon(ids) {
        const promises = ids.map(id => this.getPokemon(id));
        const results = await Promise.allSettled(promises);

        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    }

    /**
     * Fetch com retry automático
     * @param {string} url - URL da requisição
     * @param {number} maxRetries - Máximo de tentativas
     * @returns {Promise<Response>}
     */
    async fetchWithRetry(url, maxRetries = 3) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return response;
            } catch (error) {
                console.warn(`Tentativa ${attempt}/${maxRetries} falhou para ${url}:`, error);
                lastError = error;

                if (attempt < maxRetries) {
                    // Delay exponencial
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }

        throw new Error(`Falha após ${maxRetries} tentativas: ${lastError.message}`);
    }

    /**
     * Limpa o cache da API
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache da API limpo');
    }

    /**
     * Obtém estatísticas do cache
     * @returns {Object} Estatísticas do cache
     */
    getCacheStats() {
        return this.cache.getStats();
    }
}