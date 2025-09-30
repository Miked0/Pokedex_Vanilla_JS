# Criando os estilos CSS para a aplicação

# 12. Main.css
main_css = """/**
 * Pokédex Vanilla JS - Estilos Principais
 * Design System criado por Ygor Silva - UI/UX Specialist
 * 
 * @version 1.0.0
 * @description Sistema de design responsivo mobile-first
 */

/* ===== RESET E BASE ===== */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg-primary);
    overflow-x: hidden;
}

/* ===== VARIÁVEIS CSS ===== */
:root {
    /* Cores Principais */
    --primary: #e53e3e;
    --primary-light: #feb2b2;
    --primary-dark: #c53030;
    --secondary: #3182ce;
    --secondary-light: #90cdf4;
    --secondary-dark: #2c5282;
    
    /* Cores de Sistema */
    --success: #38a169;
    --warning: #d69e2e;
    --error: #e53e3e;
    --info: #3182ce;
    
    /* Cores de Fundo */
    --bg-primary: #f7fafc;
    --bg-secondary: #edf2f7;
    --bg-tertiary: #e2e8f0;
    --bg-card: #ffffff;
    --bg-overlay: rgba(0, 0, 0, 0.5);
    
    /* Cores de Texto */
    --text-primary: #2d3748;
    --text-secondary: #4a5568;
    --text-muted: #718096;
    --text-inverse: #ffffff;
    
    /* Bordas */
    --border-color: #e2e8f0;
    --border-color-focus: #3182ce;
    --border-radius: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 16px;
    
    /* Sombras */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
    
    /* Espaçamentos */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Tipografia */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 2rem;
    
    /* Transições */
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 350ms ease;
    
    /* Z-index */
    --z-dropdown: 1000;
    --z-modal: 1100;
    --z-tooltip: 1200;
    
    /* Grid */
    --grid-columns: 1;
    --container-max-width: 1200px;
}

/* ===== DARK MODE ===== */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: #1a202c;
        --bg-secondary: #2d3748;
        --bg-tertiary: #4a5568;
        --bg-card: #2d3748;
        
        --text-primary: #f7fafc;
        --text-secondary: #e2e8f0;
        --text-muted: #a0aec0;
        
        --border-color: #4a5568;
        --border-color-focus: #63b3ed;
    }
}

/* ===== UTILITÁRIOS ===== */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.container {
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

@media (min-width: 768px) {
    .container {
        padding: 0 var(--spacing-xl);
    }
}

/* ===== LAYOUT PRINCIPAL ===== */
.header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: var(--text-inverse);
    padding: var(--spacing-lg) 0;
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header__title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.pokeball-icon {
    font-size: 1.2em;
    animation: spin 3s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.header__subtitle {
    font-size: var(--font-size-lg);
    opacity: 0.9;
    font-weight: 300;
}

.main {
    padding: var(--spacing-xl) 0;
    min-height: calc(100vh - 120px);
}

/* ===== SEÇÃO DE PESQUISA ===== */
.search-section {
    margin-bottom: var(--spacing-2xl);
}

.search-bar {
    position: relative;
    max-width: 600px;
    margin: 0 auto var(--spacing-lg);
}

.search-input {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-xl) var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-lg);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-xl);
    background: var(--bg-card);
    color: var(--text-primary);
    transition: all var(--transition-normal);
    box-shadow: var(--shadow-sm);
}

.search-input:focus {
    outline: none;
    border-color: var(--border-color-focus);
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    transform: translateY(-1px);
}

.search-button {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    background: var(--primary);
    color: var(--text-inverse);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-lg);
}

.search-button:hover {
    background: var(--primary-dark);
    transform: translateY(-50%) scale(1.05);
}

.search-clear {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: 50%;
    transition: all var(--transition-fast);
}

.search-clear:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

/* ===== PAINEL DE FILTROS ===== */
.filter-panel {
    background: var(--bg-card);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--spacing-xl);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
    align-items: center;
    justify-content: center;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    min-width: 150px;
}

.filter-group label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
}

.filter-select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-card);
    color: var(--text-primary);
    font-size: var(--font-size-base);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.filter-select:focus {
    outline: none;
    border-color: var(--border-color-focus);
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1);
}

.filter-clear {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-fast);
}

.filter-clear:hover:not(:disabled) {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary);
}

.filter-clear:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ===== LOADING ===== */
.loading {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    color: var(--text-muted);
}

.loading__spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--bg-secondary);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-md);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--bg-secondary);
    border-top: 2px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* ===== GRID DE POKÉMON ===== */
.pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
}

@media (min-width: 480px) {
    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}

@media (min-width: 768px) {
    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: var(--spacing-xl);
    }
}

@media (min-width: 1024px) {
    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
}

/* Estados do grid */
.pokemon-grid--loading {
    opacity: 0.5;
    pointer-events: none;
}

.grid-loading,
.grid-empty,
.grid-error {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--text-muted);
}

.grid-empty .empty-icon,
.grid-error .error-icon {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
}

.retry-button {
    background: var(--primary);
    color: var(--text-inverse);
    border: none;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    margin-top: var(--spacing-md);
    transition: all var(--transition-fast);
}

.retry-button:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

/* ===== PAGINAÇÃO ===== */
.pagination-section {
    margin-top: var(--spacing-2xl);
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
}

.pagination__btn {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-fast);
    min-width: 120px;
}

.pagination__btn:hover:not(:disabled) {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary);
    transform: translateY(-1px);
}

.pagination__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination__info {
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius);
}

/* ===== MODAL ===== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--z-modal);
    display: none;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
}

.modal.active {
    display: flex;
}

.modal__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-overlay);
    backdrop-filter: blur(4px);
    animation: fadeIn 200ms ease;
}

.modal__content {
    position: relative;
    background: var(--bg-card);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-xl);
    max-width: 600px;
    max-height: 90vh;
    width: 100%;
    overflow: hidden;
    animation: slideIn 300ms ease;
}

.modal__close {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--bg-secondary);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: var(--font-size-lg);
    font-weight: bold;
    color: var(--text-muted);
    transition: all var(--transition-fast);
    z-index: 10;
}

.modal__close:hover {
    background: var(--error);
    color: var(--text-inverse);
    transform: scale(1.1);
}

.modal__body {
    padding: var(--spacing-xl);
    overflow-y: auto;
    max-height: 90vh;
}

/* ===== ANIMAÇÕES ===== */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
    .header__title {
        font-size: var(--font-size-2xl);
    }
    
    .search-input {
        font-size: var(--font-size-base);
        padding: var(--spacing-md);
    }
    
    .filter-panel {
        flex-direction: column;
        align-items: stretch;
    }
    
    .filter-group {
        min-width: unset;
    }
    
    .modal__content {
        margin: var(--spacing-md);
    }
    
    .modal__body {
        padding: var(--spacing-lg);
    }
}

@media (max-width: 480px) {
    .pokemon-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
    
    .pagination {
        flex-direction: column;
    }
    
    .pagination__btn {
        width: 100%;
        min-width: unset;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    .header,
    .search-section,
    .filter-panel,
    .pagination-section,
    .modal {
        display: none !important;
    }
    
    .pokemon-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-md);
    }
}

/* ===== ACESSIBILIDADE ===== */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus visible para navegação por teclado */
.search-input:focus-visible,
.filter-select:focus-visible,
.filter-clear:focus-visible,
.pagination__btn:focus-visible {
    outline: 2px solid var(--border-color-focus);
    outline-offset: 2px;
}

/* Estados de alto contraste */
@media (prefers-contrast: high) {
    :root {
        --border-color: #000000;
        --text-muted: var(--text-secondary);
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
        --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
}"""

# 13. Components.css
components_css = """/**
 * Pokédex Vanilla JS - Componentes
 * Estilos específicos dos componentes
 * Design por Ygor Silva - UI/UX Specialist
 */

/* ===== POKÉMON CARD ===== */
.pokemon-card {
    position: relative;
    background: var(--bg-card);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
    cursor: pointer;
    overflow: hidden;
    border: 2px solid transparent;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 320px;
}

.pokemon-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
}

.pokemon-card:focus {
    outline: none;
    border-color: var(--border-color-focus);
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.pokemon-card--clicked {
    transform: scale(0.98);
}

.pokemon-card--loading .pokemon-card__image {
    opacity: 0;
}

.pokemon-card--loaded .pokemon-card__image {
    opacity: 1;
}

/* Card Header */
.pokemon-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.pokemon-card__id {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
}

.pokemon-card__favorite {
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: 50%;
    transition: all var(--transition-fast);
    background: none;
    border: none;
}

.pokemon-card__favorite:hover {
    background: var(--bg-secondary);
    transform: scale(1.2);
}

.favorite-icon {
    font-size: var(--font-size-lg);
    color: var(--warning);
}

.pokemon-card__favorite[data-favorite="true"] .favorite-icon {
    color: var(--warning);
}

/* Card Image */
.pokemon-card__image-container {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-md);
    min-height: 150px;
}

.pokemon-card__image-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
}

.pokemon-card__image {
    max-width: 120px;
    max-height: 120px;
    width: 100%;
    height: auto;
    transition: all var(--transition-normal);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.pokemon-card:hover .pokemon-card__image {
    transform: scale(1.05);
}

.error-placeholder {
    width: 60px;
    height: 60px;
    background: var(--bg-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);
    color: var(--text-muted);
}

/* Card Content */
.pokemon-card__content {
    text-align: center;
}

.pokemon-card__name {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    text-transform: capitalize;
}

.pokemon-card__types {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: center;
    margin-bottom: var(--spacing-md);
    flex-wrap: wrap;
}

/* Quick Stats */
.quick-stats {
    display: flex;
    justify-content: space-around;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.quick-stat {
    text-align: center;
    flex: 1;
}

.quick-stat__label {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: var(--spacing-xs);
}

.quick-stat__value {
    display: block;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--text-primary);
}

/* Card Overlay */
.pokemon-card__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    opacity: 0;
    transition: all var(--transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-lg);
}

.pokemon-card:hover .pokemon-card__overlay {
    opacity: 0.9;
}

.pokemon-card__cta {
    color: var(--text-inverse);
    font-weight: 600;
    font-size: var(--font-size-lg);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ===== TYPE BADGES ===== */
.type-badge {
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-xl);
    font-size: var(--font-size-sm);
    font-weight: 600;
    text-transform: capitalize;
    color: var(--text-inverse);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Cores específicas dos tipos */
.type-badge--normal { background: linear-gradient(135deg, #A8A878, #9C9C6C); }
.type-badge--fighting { background: linear-gradient(135deg, #C03028, #A82820); }
.type-badge--flying { background: linear-gradient(135deg, #A890F0, #9180E8); }
.type-badge--poison { background: linear-gradient(135deg, #A040A0, #903890); }
.type-badge--ground { background: linear-gradient(135deg, #E0C068, #D4B055); }
.type-badge--rock { background: linear-gradient(135deg, #B8A038, #A69030); }
.type-badge--bug { background: linear-gradient(135deg, #A8B820, #98A820); }
.type-badge--ghost { background: linear-gradient(135deg, #705898, #604888); }
.type-badge--steel { background: linear-gradient(135deg, #B8B8D0, #A8A8C0); }
.type-badge--fire { background: linear-gradient(135deg, #F08030, #E07028); }
.type-badge--water { background: linear-gradient(135deg, #6890F0, #5880E0); }
.type-badge--grass { background: linear-gradient(135deg, #78C850, #68B840); }
.type-badge--electric { background: linear-gradient(135deg, #F8D030, #E8C028); }
.type-badge--psychic { background: linear-gradient(135deg, #F85888, #E84878); }
.type-badge--ice { background: linear-gradient(135deg, #98D8D8, #88C8C8); }
.type-badge--dragon { background: linear-gradient(135deg, #7038F8, #6028E8); }
.type-badge--dark { background: linear-gradient(135deg, #705848, #604838); }
.type-badge--fairy { background: linear-gradient(135deg, #EE99AC, #E889A0); }

/* ===== POKÉMON DETAILS (MODAL) ===== */
.pokemon-details {
    animation: slideIn 300ms ease;
}

.pokemon-details__header {
    display: flex;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    align-items: flex-start;
}

.pokemon-details__image {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}

.pokemon-details__info {
    flex: 1;
}

.pokemon-details__name {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    text-transform: capitalize;
}

.pokemon-details__id {
    font-size: var(--font-size-xl);
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
}

.pokemon-details__types {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
}

.pokemon-details__description {
    background: var(--bg-secondary);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-xl);
    font-style: italic;
    line-height: 1.7;
    color: var(--text-secondary);
}

.pokemon-details__stats h3,
.pokemon-details__abilities h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
}

/* Stats */
.stats-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.stat-item {
    display: grid;
    grid-template-columns: 1fr auto 2fr;
    align-items: center;
    gap: var(--spacing-md);
}

.stat-name {
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: capitalize;
}

.stat-value {
    font-weight: 700;
    color: var(--text-primary);
    min-width: 40px;
    text-align: center;
    background: var(--bg-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
}

.stat-bar {
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.stat-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success) 0%, var(--warning) 50%, var(--error) 100%);
    transition: width 1s ease;
    border-radius: 4px;
}

/* Abilities */
.abilities-list {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

.ability-badge {
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-xl);
    font-size: var(--font-size-sm);
    font-weight: 500;
    text-transform: capitalize;
    border: 1px solid var(--border-color);
}

/* ===== SEARCH SUGGESTIONS ===== */
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-dropdown);
    max-height: 300px;
    overflow-y: auto;
    margin-top: var(--spacing-xs);
}

.search-suggestion {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    border-bottom: 1px solid var(--bg-secondary);
}

.search-suggestion:last-child {
    border-bottom: none;
}

.search-suggestion:hover,
.search-suggestion--highlighted {
    background: var(--bg-secondary);
}

.suggestion-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.suggestion-id {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg-tertiary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
}

.suggestion-name {
    font-weight: 500;
    color: var(--text-primary);
    text-transform: capitalize;
}

.suggestion-name mark {
    background: var(--primary-light);
    color: var(--primary-dark);
    padding: 0 2px;
    border-radius: 2px;
}

.suggestion-meta {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
}

.suggestion-type {
    background: var(--bg-tertiary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    text-transform: capitalize;
}

/* ===== FILTER PANEL MOBILE ===== */
.filter-toggle {
    display: none;
    background: var(--primary);
    color: var(--text-inverse);
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    width: 100%;
    transition: all var(--transition-fast);
}

.filter-toggle:hover {
    background: var(--primary-dark);
}

.filter-toggle__text {
    margin-right: var(--spacing-sm);
}

.filter-panel--mobile .filter-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-panel--collapsed {
    display: none;
}

.filter-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--error);
    color: var(--text-inverse);
    font-size: var(--font-size-xs);
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: bold;
}

/* ===== RESPONSIVIDADE DOS COMPONENTES ===== */
@media (max-width: 768px) {
    .pokemon-card {
        min-height: 280px;
        padding: var(--spacing-md);
    }
    
    .pokemon-details__header {
        flex-direction: column;
        text-align: center;
    }
    
    .pokemon-details__image {
        width: 150px;
        height: 150px;
        margin: 0 auto;
    }
    
    .stat-item {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--spacing-sm);
    }
    
    .search-suggestions {
        max-height: 250px;
    }
}

@media (max-width: 480px) {
    .pokemon-card {
        min-height: 260px;
    }
    
    .pokemon-card__name {
        font-size: var(--font-size-lg);
    }
    
    .pokemon-details__name {
        font-size: var(--font-size-2xl);
    }
    
    .quick-stats {
        gap: var(--spacing-xs);
    }
    
    .type-badge {
        font-size: var(--font-size-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
    }
}

/* ===== VARIAÇÕES DE TEMA POR TIPO ===== */
.pokemon-card--fire {
    background: linear-gradient(135deg, rgba(240, 128, 48, 0.1), rgba(240, 128, 48, 0.05));
    border-color: rgba(240, 128, 48, 0.2);
}

.pokemon-card--water {
    background: linear-gradient(135deg, rgba(104, 144, 240, 0.1), rgba(104, 144, 240, 0.05));
    border-color: rgba(104, 144, 240, 0.2);
}

.pokemon-card--grass {
    background: linear-gradient(135deg, rgba(120, 200, 80, 0.1), rgba(120, 200, 80, 0.05));
    border-color: rgba(120, 200, 80, 0.2);
}

.pokemon-card--electric {
    background: linear-gradient(135deg, rgba(248, 208, 48, 0.1), rgba(248, 208, 48, 0.05));
    border-color: rgba(248, 208, 48, 0.2);
}

/* ===== ANIMAÇÕES AVANÇADAS ===== */
.pokemon-card--hover {
    animation: cardHover 0.3s ease;
}

@keyframes cardHover {
    0% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
    100% { transform: translateY(-4px); }
}

.stat-fill {
    position: relative;
    overflow: hidden;
}

.stat-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}"""

# Salvar arquivos de estilo
os.makedirs('src/styles', exist_ok=True)

with open('src/styles/main.css', 'w', encoding='utf-8') as f:
    f.write(main_css)

with open('src/styles/components.css', 'w', encoding='utf-8') as f:
    f.write(components_css)

print("✅ Estilos CSS criados:")
print("- src/styles/main.css")
print("- src/styles/components.css")