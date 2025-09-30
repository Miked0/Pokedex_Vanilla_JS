# Criando as utilidades e constantes

# 6. Constants.js
constants_js = """/**
 * Constantes da Aplicação Pokédex
 * Definidas pela equipe para manter consistência
 * 
 * @module constants
 */

// API Configuration
export const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Faixas das gerações (Pokémon ID ranges)
export const GENERATION_RANGES = {
    1: { start: 1, end: 151, name: 'Kanto', region: 'Kanto' },
    2: { start: 152, end: 251, name: 'Johto', region: 'Johto' },
    3: { start: 252, end: 386, name: 'Hoenn', region: 'Hoenn' }
};

// Tipos de Pokémon (ordenados alfabeticamente)
export const POKEMON_TYPES = [
    'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
    'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
    'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
];

// Cores dos tipos para UI
export const TYPE_COLORS = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC'
};

// Durações de cache (em milissegundos)
export const CACHE_DURATION = {
    POKEMON: 30 * 60 * 1000,    // 30 minutos
    SPECIES: 60 * 60 * 1000,    // 1 hora
    EVOLUTION: 60 * 60 * 1000,   // 1 hora
    TYPES: 24 * 60 * 60 * 1000,  // 24 horas
    GENERATION: 24 * 60 * 60 * 1000 // 24 horas
};

// Configurações de paginação
export const PAGINATION = {
    POKEMON_PER_PAGE: 20,
    MAX_POKEMON_PER_PAGE: 50
};

// Configurações de performance
export const PERFORMANCE = {
    DEBOUNCE_DELAY: 300,        // ms para debounce de busca
    LAZY_LOAD_OFFSET: 200,      // pixels para lazy loading
    MAX_CONCURRENT_REQUESTS: 10, // máximo de requisições simultâneas
    RETRY_ATTEMPTS: 3           // tentativas de retry
};

// Breakpoints responsivos
export const BREAKPOINTS = {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE: '1200px'
};

// Estatísticas dos Pokémon
export const STAT_NAMES = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defesa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    'speed': 'Velocidade'
};

// Estados de loading
export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    POKEMON_NOT_FOUND: 'Pokémon não encontrado.',
    GENERIC_ERROR: 'Algo deu errado. Tente novamente.',
    CACHE_ERROR: 'Erro ao acessar cache local.',
    LOADING_ERROR: 'Erro ao carregar dados.'
};

// Configurações de acessibilidade
export const ACCESSIBILITY = {
    ARIA_LABELS: {
        SEARCH: 'Buscar Pokémon',
        FILTER: 'Filtrar Pokémon',
        POKEMON_CARD: 'Detalhes do Pokémon',
        CLOSE_MODAL: 'Fechar detalhes',
        PAGINATION_PREV: 'Página anterior',
        PAGINATION_NEXT: 'Próxima página'
    }
};

// Configurações de imagens
export const IMAGES = {
    PLACEHOLDER: 'assets/images/placeholder.png',
    LOGO: 'assets/images/logo.png',
    FALLBACK_SPRITE: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'
};

// URLs de recursos externos
export const EXTERNAL_RESOURCES = {
    SPRITES_BASE: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/',
    ARTWORK_BASE: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'
};

// Configurações do localStorage
export const STORAGE = {
    CACHE_KEY: 'pokedex_cache',
    PREFERENCES_KEY: 'pokedex_preferences',
    MAX_STORAGE_SIZE: 5 * 1024 * 1024 // 5MB
};

// Animações e transições
export const ANIMATIONS = {
    FADE_DURATION: 300,
    SLIDE_DURATION: 250,
    BOUNCE_DURATION: 400,
    MODAL_DURATION: 200
};"""

# 7. Helpers.js
helpers_js = """/**
 * Funções utilitárias para a Pokédex
 * Desenvolvidas seguindo princípios de clean code
 * 
 * @module helpers
 */

import { TYPE_COLORS, STAT_NAMES, GENERATION_RANGES } from './constants.js';

/**
 * Capitaliza a primeira letra de uma string
 * @param {string} str - String a ser capitalizada
 * @returns {string} String capitalizada
 */
export function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formata o ID do Pokémon com zeros à esquerda
 * @param {number} id - ID do Pokémon
 * @returns {string} ID formatado (ex: 001, 025, 150)
 */
export function formatPokemonId(id) {
    return id.toString().padStart(3, '0');
}

/**
 * Obtém a cor associada ao tipo do Pokémon
 * @param {string} type - Nome do tipo
 * @returns {string} Cor hexadecimal
 */
export function getTypeColor(type) {
    return TYPE_COLORS[type.toLowerCase()] || '#68A090';
}

/**
 * Formata o nome da estatística para exibição
 * @param {string} statName - Nome da estatística da API
 * @returns {string} Nome formatado
 */
export function formatStatName(statName) {
    return STAT_NAMES[statName] || capitalize(statName.replace('-', ' '));
}

/**
 * Determina a geração de um Pokémon baseado no ID
 * @param {number} pokemonId - ID do Pokémon
 * @returns {number|null} Número da geração (1-3) ou null se fora do range
 */
export function getPokemonGeneration(pokemonId) {
    for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
        if (pokemonId >= range.start && pokemonId <= range.end) {
            return parseInt(gen);
        }
    }
    return null;
}

/**
 * Cria um delay (Promise que resolve após um tempo)
 * @param {number} ms - Milissegundos para aguardar
 * @returns {Promise} Promise que resolve após o delay
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce de função - evita múltiplas execuções
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce aplicado
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle de função - limita execuções por tempo
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function} Função com throttle aplicado
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sanitiza string removendo caracteres especiais
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export function sanitizeString(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[^a-zA-Z0-9\\s-]/g, '').trim();
}

/**
 * Valida se um ID de Pokémon é válido (1-386)
 * @param {number|string} id - ID a ser validado
 * @returns {boolean} True se válido
 */
export function isValidPokemonId(id) {
    const numId = parseInt(id);
    return !isNaN(numId) && numId >= 1 && numId <= 386;
}

/**
 * Obtém a URL do sprite de um Pokémon
 * @param {number} id - ID do Pokémon
 * @param {boolean} shiny - Se deve retornar versão shiny
 * @returns {string} URL do sprite
 */
export function getPokemonSpriteUrl(id, shiny = false) {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    const shinyPath = shiny ? 'shiny/' : '';
    return `${baseUrl}${shinyPath}${id}.png`;
}

/**
 * Obtém a URL da artwork oficial de um Pokémon
 * @param {number} id - ID do Pokémon
 * @returns {string} URL da artwork
 */
export function getPokemonArtworkUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Converte peso de hectogramas para kg
 * @param {number} weight - Peso em hectogramas
 * @returns {number} Peso em kg
 */
export function convertWeight(weight) {
    return (weight / 10).toFixed(1);
}

/**
 * Converte altura de decímetros para metros
 * @param {number} height - Altura em decímetros
 * @returns {number} Altura em metros
 */
export function convertHeight(height) {
    return (height / 10).toFixed(1);
}

/**
 * Filtra array removendo duplicatas
 * @param {Array} array - Array com possíveis duplicatas
 * @param {string} key - Chave para comparação (opcional)
 * @returns {Array} Array sem duplicatas
 */
export function removeDuplicates(array, key = null) {
    if (!Array.isArray(array)) return [];
    
    if (key) {
        return array.filter((item, index, self) => 
            index === self.findIndex(t => t[key] === item[key])
        );
    }
    
    return [...new Set(array)];
}

/**
 * Calcula a porcentagem de uma stat baseada no máximo teórico
 * @param {number} statValue - Valor da estatística
 * @param {number} maxValue - Valor máximo (padrão 255)
 * @returns {number} Porcentagem (0-100)
 */
export function calculateStatPercentage(statValue, maxValue = 255) {
    return Math.min(100, Math.max(0, (statValue / maxValue) * 100));
}

/**
 * Cria um elemento HTML com atributos
 * @param {string} tag - Tag do elemento
 * @param {Object} attributes - Atributos do elemento
 * @param {string} content - Conteúdo interno (opcional)
 * @returns {HTMLElement} Elemento criado
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (content) {
        element.innerHTML = content;
    }
    
    return element;
}

/**
 * Formata texto de descrição removendo caracteres de controle
 * @param {string} text - Texto da descrição
 * @returns {string} Texto formatado
 */
export function formatDescription(text) {
    if (!text) return '';
    
    return text
        .replace(/\\f/g, ' ')      // Remove form feed
        .replace(/\\n/g, ' ')      // Remove quebras de linha
        .replace(/\\r/g, '')       // Remove carriage return
        .replace(/\\s+/g, ' ')     // Normaliza espaços
        .trim();
}

/**
 * Verifica se uma imagem pode ser carregada
 * @param {string} url - URL da imagem
 * @returns {Promise<boolean>} Promise que resolve com true se a imagem carrega
 */
export function checkImageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

/**
 * Obtém informações responsivas baseadas no viewport
 * @returns {Object} Informações sobre o viewport atual
 */
export function getViewportInfo() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let device = 'desktop';
    if (width <= 480) device = 'mobile';
    else if (width <= 768) device = 'tablet';
    
    return {
        width,
        height,
        device,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop'
    };
}

/**
 * Cria um observador de interseção para lazy loading
 * @param {Function} callback - Função a ser chamada quando elemento entra na tela
 * @param {Object} options - Opções do observer
 * @returns {IntersectionObserver} Observer configurado
 */
export function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto com HTML escapado
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}"""

# Salvar arquivos utilitários
os.makedirs('src/utils', exist_ok=True)

with open('src/utils/constants.js', 'w', encoding='utf-8') as f:
    f.write(constants_js)

with open('src/utils/helpers.js', 'w', encoding='utf-8') as f:
    f.write(helpers_js)

print("✅ Utilitários criados:")
print("- src/utils/constants.js")
print("- src/utils/helpers.js")