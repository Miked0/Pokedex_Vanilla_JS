/**
 * Service Worker - Pokédx V2.0 PWA
 * Desenvolvido por Michael Douglas, PhD - Principal Software Architect
 * Equipe SID Elite
 */

const CACHE_VERSION = 'pokedx-v2-2025-09-30';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html'
];

// Install event
self.addEventListener('install', event => {
    console.log('🔧 Pokédx SW: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => {
                console.log('✅ Pokédx SW: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => console.error('❌ SW Install failed:', error))
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('⚡ Pokédx SW: Activating...');

    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.includes('pokedx-v2') && 
                            ![STATIC_CACHE, API_CACHE, IMAGE_CACHE].includes(cacheName)) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
        .then(() => {
            console.log('✅ Pokédx SW: Activation complete');

            // Notify clients
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_UPDATE',
                        payload: { version: CACHE_VERSION }
                    });
                });
            });
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    if (isStaticAsset(url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(url)) {
        event.respondWith(handleAPIRequest(request));
    } else if (isImageRequest(url)) {
        event.respondWith(handleImageRequest(request));
    }
});

function isStaticAsset(url) {
    return url.origin === self.location.origin && (
        url.pathname === '/' ||
        url.pathname.endsWith('.html') ||
        url.pathname.endsWith('.json')
    );
}

function isAPIRequest(url) {
    return url.origin === 'https://pokeapi.co';
}

function isImageRequest(url) {
    return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
           url.hostname.includes('githubusercontent.com') ||
           url.hostname.includes('placeholder.com');
}

async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;

    } catch (error) {
        console.error('Static asset error:', error);
        return new Response('Offline - Asset not available', { status: 503 });
    }
}

async function handleAPIRequest(request) {
    const cache = await caches.open(API_CACHE);

    try {
        const networkResponse = await Promise.race([
            fetch(request),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
            )
        ]);

        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }

        throw new Error(`API Error: ${networkResponse.status}`);

    } catch (error) {
        console.warn('API network failed, trying cache:', error.message);

        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response(JSON.stringify({
            error: 'Dados não disponíveis offline',
            cached: false,
            timestamp: Date.now()
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);

    try {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }

        throw new Error(`Image fetch failed: ${networkResponse.status}`);

    } catch (error) {
        const placeholder = `
            <svg width="140" height="140" xmlns="http://www.w3.org/2000/svg">
                <rect width="140" height="140" fill="#f0f0f0"/>
                <text x="70" y="75" text-anchor="middle" font-size="16" fill="#999">
                    🔌 Offline
                </text>
            </svg>
        `;

        return new Response(placeholder, {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }
}

// Background sync
self.addEventListener('sync', event => {
    if (event.tag === 'pokemon-sync') {
        event.waitUntil(syncPokemonData());
    }
});

async function syncPokemonData() {
    console.log('🔄 Syncing Pokemon data...');
    try {
        const cache = await caches.open(API_CACHE);
        const essentialEndpoints = [
            'https://pokeapi.co/api/v2/pokemon?limit=386',
            'https://pokeapi.co/api/v2/type',
            'https://pokeapi.co/api/v2/generation/1',
            'https://pokeapi.co/api/v2/generation/2',
            'https://pokeapi.co/api/v2/generation/3'
        ];

        await Promise.all(
            essentialEndpoints.map(async url => {
                try {
                    const response = await fetch(url);
                    if (response.ok) await cache.put(url, response);
                } catch (error) {
                    console.warn(`Sync failed for ${url}:`, error);
                }
            })
        );

        console.log('✅ Pokemon data sync complete');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

console.log('🚀 Pokédx Service Worker v2.0 loaded!');