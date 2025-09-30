# Criando os serviços e componentes da aplicação

# 4. PokeAPI.js Service
pokeapi_service = """/**
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
}"""

# 5. CacheManager.js
cache_manager = """/**
 * Gerenciador de Cache Local
 * Desenvolvido por Michael Douglas - Backend Specialist
 * 
 * @class CacheManager
 * @description Gerencia cache em memória e localStorage para otimização de performance
 */

export class CacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.storageKey = 'pokedex_cache';
        this.maxMemorySize = 500; // Máximo de itens em memória
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0
        };
        
        // Limpar cache expirado na inicialização
        this.cleanExpiredCache();
    }

    /**
     * Armazena um valor no cache
     * @param {string} key - Chave do cache
     * @param {any} value - Valor a ser armazenado
     * @param {number} ttl - Time to live em milissegundos
     */
    set(key, value, ttl = 300000) { // 5 minutos padrão
        const expiresAt = Date.now() + ttl;
        const cacheItem = {
            value,
            expiresAt,
            accessCount: 0,
            createdAt: Date.now()
        };

        // Armazenar em memória
        this.memoryCache.set(key, cacheItem);
        
        // Verificar limite de memória
        if (this.memoryCache.size > this.maxMemorySize) {
            this.evictLeastUsed();
        }

        // Armazenar no localStorage para persistência
        try {
            this.setInStorage(key, cacheItem);
        } catch (error) {
            console.warn('Erro ao salvar no localStorage:', error);
        }

        this.stats.sets++;
    }

    /**
     * Recupera um valor do cache
     * @param {string} key - Chave do cache
     * @returns {any|null} Valor armazenado ou null se não encontrado/expirado
     */
    get(key) {
        // Tentar memória primeiro
        let cacheItem = this.memoryCache.get(key);
        
        // Se não estiver em memória, tentar localStorage
        if (!cacheItem) {
            cacheItem = this.getFromStorage(key);
            if (cacheItem) {
                this.memoryCache.set(key, cacheItem);
            }
        }

        if (!cacheItem) {
            this.stats.misses++;
            return null;
        }

        // Verificar se expirou
        if (Date.now() > cacheItem.expiresAt) {
            this.delete(key);
            this.stats.misses++;
            return null;
        }

        // Atualizar contador de acesso
        cacheItem.accessCount++;
        cacheItem.lastAccessed = Date.now();
        
        this.stats.hits++;
        return cacheItem.value;
    }

    /**
     * Remove um item do cache
     * @param {string} key - Chave a ser removida
     */
    delete(key) {
        this.memoryCache.delete(key);
        this.removeFromStorage(key);
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        this.memoryCache.clear();
        this.clearStorage();
        this.stats = { hits: 0, misses: 0, sets: 0, evictions: 0 };
    }

    /**
     * Verifica se uma chave existe no cache
     * @param {string} key - Chave a verificar
     * @returns {boolean} True se existe e não expirou
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Remove itens menos usados para liberar espaço
     */
    evictLeastUsed() {
        const entries = Array.from(this.memoryCache.entries());
        
        // Ordenar por menor uso e mais antigo
        entries.sort((a, b) => {
            const aItem = a[1];
            const bItem = b[1];
            
            if (aItem.accessCount !== bItem.accessCount) {
                return aItem.accessCount - bItem.accessCount;
            }
            
            return aItem.createdAt - bItem.createdAt;
        });

        // Remover 20% dos itens menos usados
        const toEvict = Math.floor(entries.length * 0.2) || 1;
        for (let i = 0; i < toEvict; i++) {
            const [key] = entries[i];
            this.delete(key);
            this.stats.evictions++;
        }
    }

    /**
     * Limpa itens expirados do cache
     */
    cleanExpiredCache() {
        const now = Date.now();
        
        // Limpar memória
        for (const [key, item] of this.memoryCache.entries()) {
            if (now > item.expiresAt) {
                this.memoryCache.delete(key);
            }
        }

        // Limpar localStorage
        try {
            const storage = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            const cleaned = {};
            
            for (const [key, item] of Object.entries(storage)) {
                if (now <= item.expiresAt) {
                    cleaned[key] = item;
                }
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(cleaned));
        } catch (error) {
            console.warn('Erro ao limpar localStorage:', error);
        }
    }

    /**
     * Salva item no localStorage
     * @private
     */
    setInStorage(key, cacheItem) {
        const storage = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        storage[key] = cacheItem;
        localStorage.setItem(this.storageKey, JSON.stringify(storage));
    }

    /**
     * Recupera item do localStorage
     * @private
     */
    getFromStorage(key) {
        try {
            const storage = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            return storage[key] || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Remove item do localStorage
     * @private
     */
    removeFromStorage(key) {
        try {
            const storage = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            delete storage[key];
            localStorage.setItem(this.storageKey, JSON.stringify(storage));
        } catch (error) {
            console.warn('Erro ao remover do localStorage:', error);
        }
    }

    /**
     * Limpa o localStorage
     * @private
     */
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Erro ao limpar localStorage:', error);
        }
    }

    /**
     * Retorna estatísticas do cache
     * @returns {Object} Estatísticas detalhadas
     */
    getStats() {
        const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
        
        return {
            ...this.stats,
            hitRate: (hitRate * 100).toFixed(2) + '%',
            memorySize: this.memoryCache.size,
            maxMemorySize: this.maxMemorySize
        };
    }

    /**
     * Obtém tamanho aproximado do cache em bytes
     * @returns {number} Tamanho em bytes
     */
    getSize() {
        try {
            const storage = localStorage.getItem(this.storageKey) || '{}';
            return new Blob([storage]).size;
        } catch (error) {
            return 0;
        }
    }
}"""

# Salvar os arquivos de serviços
import os
os.makedirs('src/services', exist_ok=True)

with open('src/services/PokeAPI.js', 'w', encoding='utf-8') as f:
    f.write(pokeapi_service)

with open('src/services/CacheManager.js', 'w', encoding='utf-8') as f:
    f.write(cache_manager)

print("✅ Serviços criados:")
print("- src/services/PokeAPI.js")
print("- src/services/CacheManager.js")