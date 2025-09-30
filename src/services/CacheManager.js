/**
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
}