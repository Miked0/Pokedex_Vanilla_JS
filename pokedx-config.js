/**
 * Pokédx V2.0 PWA - Configuration
 * Equipe SID Elite
 */

window.PokedxConfig = {
    version: '2.0.0',
    api: {
        baseUrl: 'https://pokeapi.co/api/v2/',
        timeout: 5000,
        retries: 3,
        rateLimit: 100 // requests per minute
    },
    cache: {
        version: 'pokedx-v2-2025-09-30',
        staticTTL: 86400000,  // 24 hours
        apiTTL: 3600000,      // 1 hour  
        imageTTL: 604800000   // 1 week
    },
    features: {
        generations: 9,
        maxTeamSize: 6,
        maxComparison: 4,
        battleSimulator: true,
        achievements: true,
        darkMode: true,
        pushNotifications: true
    },
    ui: {
        itemsPerPage: 20,
        animationDuration: 300,
        loadingDebounce: 300,
        themes: ['light', 'dark', 'kanto', 'johto', 'hoenn'],
        defaultTheme: 'light'
    },
    storage: {
        prefix: 'pokedx_v2_',
        useIndexedDB: true,
        fallbackToLocalStorage: true,
        syncAcrossDevices: false // Future feature
    },
    analytics: {
        trackUsage: true,
        trackPerformance: true,
        trackErrors: true,
        anonymousOnly: true
    }
};