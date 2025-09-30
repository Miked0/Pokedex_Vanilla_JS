/**
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
};