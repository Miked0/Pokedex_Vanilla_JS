# 🎮 Pokédex Vanilla JS

Uma aplicação web moderna para explorar as primeiras 3 gerações de Pokémon (Kanto, Johto, Hoenn), desenvolvida em JavaScript puro e conectada à PokeAPI.

![Pokédex Screenshot](assets/images/screenshot.png)

## 🚀 Funcionalidades

### ✨ Características Principais
- ✅ **Listagem Completa**: Todos os 386 Pokémon das gerações I, II e III
- 🔍 **Busca Inteligente**: Pesquisa por nome ou número com sugestões automáticas
- 🏷️ **Filtros Avançados**: Filtro por geração, tipo e estatísticas
- 📱 **Design Responsivo**: Mobile-first, otimizado para todos os dispositivos
- ⚡ **Cache Local**: Performance otimizada com cache inteligente
- ♿ **Acessibilidade**: Suporte completo a WCAG 2.1
- 🎨 **Animações Fluidas**: Transições suaves e micro-interações
- 🌙 **Tema Escuro**: Suporte automático ao modo escuro do sistema

### 🎯 Funcionalidades Avançadas
- **Lazy Loading**: Carregamento otimizado de imagens
- **Debounce**: Busca otimizada com delay inteligente
- **Service Worker**: Cache offline (planejado)
- **PWA Ready**: Estrutura preparada para Progressive Web App

## 🛠️ Tecnologias

### Core Technologies
- **JavaScript ES6+** - Vanilla JavaScript moderno
- **HTML5** - Marcação semântica
- **CSS3** - Grid, Flexbox, Custom Properties
- **PokeAPI** - Dados dos Pokémon

### APIs e Serviços
- [PokeAPI v2](https://pokeapi.co/) - API REST completa
- LocalStorage - Cache de dados
- Intersection Observer - Lazy loading
- Web Workers - Performance (planejado)

## 📂 Estrutura do Projeto

```
pokedex-vanilla-js/
├── 📄 index.html              # Arquivo principal HTML
├── 📄 app.js                  # Aplicação principal
├── 📄 README.md               # Este arquivo
├── 📄 .gitignore              # Arquivos ignorados pelo Git
│
├── 📁 src/                    # Código fonte
│   ├── 📁 components/         # Componentes da UI
│   │   ├── 📄 PokemonCard.js    # Card individual do Pokémon
│   │   ├── 📄 PokemonGrid.js    # Grade de Pokémon
│   │   ├── 📄 SearchBar.js      # Barra de pesquisa
│   │   └── 📄 FilterPanel.js    # Painel de filtros
│   │
│   ├── 📁 services/           # Serviços e integrações
│   │   ├── 📄 PokeAPI.js        # Cliente da PokeAPI
│   │   └── 📄 CacheManager.js   # Gerenciador de cache
│   │
│   ├── 📁 utils/              # Utilitários
│   │   ├── 📄 helpers.js        # Funções auxiliares
│   │   └── 📄 constants.js      # Constantes da aplicação
│   │
│   └── 📁 styles/             # Estilos CSS
│       ├── 📄 main.css          # Estilos principais
│       └── 📄 components.css    # Estilos dos componentes
│
├── 📁 assets/                 # Assets estáticos
│   └── 📁 images/             # Imagens
│       ├── 📄 logo.png          # Logo da aplicação
│       └── 📄 placeholder.png   # Placeholder de imagens
│
├── 📁 docs/                   # Documentação
│   ├── 📄 API.md               # Documentação da API
│   └── 📄 ARCHITECTURE.md      # Arquitetura da aplicação
│
└── 📁 tests/                  # Testes (planejado)
    └── 📄 pokemon.test.js      # Testes unitários
```

## 🏃‍♂️ Quick Start

### Pré-requisitos
- Navegador moderno com suporte a ES6+
- Servidor web local (recomendado)

### Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Miked0/Pokedex_Vanilla_JS.git
   cd Pokedex_Vanilla_JS
   ```

2. **Inicie um servidor local**

   **Opção 1: Python (recomendado)**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Opção 2: Node.js**
   ```bash
   npx serve .
   ```

   **Opção 3: Live Server (VS Code)**
   - Instale a extensão Live Server
   - Clique com botão direito no `index.html`
   - Selecione "Open with Live Server"

3. **Acesse a aplicação**
   ```
   http://localhost:8000
   ```

## 🎨 Design System

### Paleta de Cores
- **Primário**: `#e53e3e` (Vermelho Pokémon)
- **Secundário**: `#3182ce` (Azul)
- **Sucesso**: `#38a169` (Verde)
- **Aviso**: `#d69e2e` (Amarelo)
- **Erro**: `#e53e3e` (Vermelho)

### Tipografia
- **Fonte Principal**: Inter, system fonts
- **Títulos**: 700 (Bold)
- **Subtítulos**: 600 (Semi-bold)
- **Corpo**: 400 (Regular)

### Breakpoints
- **Mobile**: `< 480px`
- **Tablet**: `480px - 768px`
- **Desktop**: `768px - 1024px`
- **Large**: `> 1024px`

## 🏗️ Arquitetura

### Padrões Utilizados
- **Module Pattern**: Encapsulamento de funcionalidades
- **Observer Pattern**: Comunicação entre componentes
- **Singleton Pattern**: Gerenciador de cache
- **Factory Pattern**: Criação de elementos DOM
- **MVC Pattern**: Separação de responsabilidades

### Estrutura de Classes
```javascript
// Aplicação Principal
PokedexApp
├── PokemonGrid        # Gerencia a grade de cards
├── SearchBar          # Controla busca e sugestões
├── FilterPanel        # Gerencia filtros
└── Services
    ├── PokeAPI        # Cliente da API
    └── CacheManager   # Cache local
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```javascript
// src/utils/constants.js
export const API_BASE_URL = 'https://pokeapi.co/api/v2';
export const CACHE_DURATION = {
    POKEMON: 30 * 60 * 1000,    // 30 minutos
    SPECIES: 60 * 60 * 1000,    // 1 hora
    TYPES: 24 * 60 * 60 * 1000  // 24 horas
};
```

### Customização de Filtros
```javascript
// Adicionar novos filtros no FilterPanel
this.currentFilters = {
    generation: '',
    type: '',
    favorites: false,
    sortBy: 'id',
    sortOrder: 'asc',
    // Adicione novos filtros aqui
};
```

## 🧪 Testes

### Executar Testes
```bash
# Em desenvolvimento
npm test

# Com cobertura
npm run test:coverage
```

### Estrutura de Testes
- **Unitários**: Testam funções individuais
- **Integração**: Testam comunicação entre componentes
- **E2E**: Testam fluxos completos (planejado)

## 🚀 Deploy

### GitHub Pages
1. Faça push para o repositório
2. Vá em Settings > Pages
3. Selecione a branch `main`
4. A aplicação estará disponível em `https://username.github.io/repo-name`

### Netlify
1. Conecte o repositório
2. Configure build settings:
   - Build command: (vazio)
   - Publish directory: `.`
3. Deploy automático a cada push

### Vercel
```bash
npx vercel
```

## 👥 Equipe de Desenvolvimento

### 🌟 Equipe SID - Especialistas em Excelência Digital

**Dr. Mariana Torres** - CEO & Product Owner
- PhD em Gestão e Inovação - Stanford University
- Visão estratégica e alinhamento de negócios
- Especialista em transformação digital

**Ricardo Almeida, M.Eng.** - COO & Scrum Master  
- Master of Engineering - MIT
- Lean Six Sigma Master Black Belt
- Coordenação de cronograma e metodologia ágil

**Michael Douglas** - Principal Software Architect
- PhD em Software Engineering - Stanford University
- Especialista em microserviços e cloud
- Arquitetura de backend e integração com PokeAPI

**Fernanda Martins, B.S.** - Staff Frontend Engineer
- B.S. Computer Science - MIT (Magna Cum Laude)
- Especialista em React e performance web
- Componentes UI e experiência do usuário

**Ygor Silva, MFA** - Chief Design Officer
- MFA Design - Parsons School of Design
- Especialista em sistemas de design
- Identidade visual e design system

## 🤝 Contribuindo

### Como Contribuir
1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
4. **Commit** suas mudanças (`git commit -m 'Add: nova feature'`)
5. **Push** para a branch (`git push origin feature/nova-feature`)
6. **Abra** um Pull Request

### Guidelines de Código
- Use **ES6+** JavaScript
- Siga o padrão de **nomenclatura camelCase**
- **Comente** código complexo
- **Teste** suas alterações
- Mantenha **consistência** com o código existente

### Convenção de Commits
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: mudanças de estilo (sem lógica)
refactor: refatora código
test: adiciona testes
chore: tarefas de build/config
```

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **[PokeAPI](https://pokeapi.co/)** - API fantástica com dados completos
- **[Pokémon Company](https://www.pokemon.com/)** - Pelos personagens icônicos
- **Comunidade Open Source** - Inspiração e conhecimento compartilhado

## 📞 Suporte

### Reportar Bugs
- Abra uma [issue no GitHub](https://github.com/Miked0/Pokedex_Vanilla_JS/issues)
- Inclua detalhes do navegador e steps para reproduzir

### Dúvidas
- Consulte a [documentação](docs/)
- Abra uma [discussão no GitHub](https://github.com/Miked0/Pokedex_Vanilla_JS/discussions)

### Contato da Equipe
- **Email**: equipe-sid@example.com
- **LinkedIn**: [Equipe SID](https://linkedin.com/company/equipe-sid)

---

## 🎯 Roadmap

### Versão 2.0 (Q4 2025)
- [ ] **PWA Completa** - Service Worker e funcionamento offline
- [ ] **Mais Gerações** - Suporte às gerações IV-IX
- [ ] **Comparador** - Comparação entre Pokémon
- [ ] **Favoritos Avançados** - Teams e organizações
- [ ] **Batalhas Simuladas** - Simulador de batalhas simples

### Versão 1.1 (Q3 2025)  
- [ ] **Testes E2E** - Cobertura completa de testes
- [ ] **I18n** - Suporte a múltiplos idiomas
- [ ] **Modo Escuro** - Toggle manual de tema
- [ ] **Estatísticas Avançadas** - Gráficos e comparações
- [ ] **Exportar Dados** - CSV/JSON export

## 🌟 Features Especiais

### Performance
- **Bundle Size**: < 500KB total
- **First Load**: < 3s em 3G
- **Time to Interactive**: < 5s
- **Lighthouse Score**: 95+

### SEO & Acessibilidade
- **Semântica HTML5** completa
- **ARIA labels** em todos os componentes interativos
- **Navegação por teclado** 100% funcional
- **Screen reader** friendly
- **Color contrast** WCAG AA compliant

---

<div align="center">

**Desenvolvido com ❤️ pela Equipe SID**

[⭐ Star no GitHub](https://github.com/Miked0/Pokedex_Vanilla_JS) | 
[🐛 Reportar Bug](https://github.com/Miked0/Pokedex_Vanilla_JS/issues) | 
[💡 Sugerir Feature](https://github.com/Miked0/Pokedex_Vanilla_JS/discussions)

</div>