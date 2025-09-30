# 🔍 Pokédx V2.0

Uma Pokédex moderna e completa desenvolvida com **Vanilla JavaScript**, oferecendo uma experiência interativa para explorar o mundo Pokémon com todas as 9 gerações disponíveis.

![Pokédx V2.0](https://via.placeholder.com/800x400/667eea/white?text=Pok%C3%A9dx+V2.0)

## ✨ Funcionalidades

### 🗂️ Pokédex Completa
- **Todas as 9 gerações** (Kanto até Paldea)
- **1025+ Pokémon** disponíveis
- Busca por nome ou número
- Filtro por geração
- Carregamento progressivo otimizado
- Imagens em alta qualidade

### ⚖️ Comparador de Pokémon
- Compare estatísticas base
- Análise de tipos e efetividade
- Comparação visual interativa
- Informações detalhadas

### 👥 Construtor de Equipes
- Monte equipes de até 6 Pokémon
- Salve múltiplas equipes
- Diferentes categorias (PvP, PvE, Competitivo, Casual)
- Exportação e importação de equipes
- Armazenamento local persistente

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com Grid e Flexbox
- **Vanilla JavaScript** - Lógica de aplicação pura
- **PokéAPI** - Fonte de dados oficial
- **LocalStorage** - Persistência de dados local

## 🎨 Design e UX

- **Responsivo** - Funciona perfeitamente em dispositivos móveis
- **Acessibilidade** - Seguindo padrões WCAG
- **Loading States** - Feedback visual durante carregamentos
- **Animações Suaves** - Transições CSS otimizadas
- **Dark Mode** - Suporte automático baseado em preferência do sistema

## 📦 Instalação e Uso

### Opção 1: Uso Direto
1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pokedx-v2.git
cd pokedx-v2
```

2. Abra o arquivo `index.html` em seu navegador

### Opção 2: Servidor de Desenvolvimento
1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor local:
```bash
npm run dev
```

3. Acesse `http://localhost:3000`

### Opção 3: Deploy
Para deploy em produção, use:
```bash
npm run build
```

## 🛠️ Estrutura do Projeto

```
pokedx-v2/
├── index.html              # Página principal
├── css/
│   ├── style.css          # Estilos principais
│   └── responsive.css     # Media queries
├── js/
│   ├── main.js            # Aplicação principal
│   ├── pokemon-api.js     # Gerenciador da PokéAPI
│   ├── comparison.js      # Módulo de comparação
│   └── team-builder.js    # Construtor de equipes
├── package.json           # Configurações do projeto
├── vercel.json           # Configuração de deploy
└── README.md             # Documentação
```

## 🔧 Configuração para Deploy

### Vercel
Arquivo `vercel.json` incluído com configurações otimizadas:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "."
}
```

### Netlify
Para deploy no Netlify, configure:
- Build command: `npm run build`
- Publish directory: `.`

### GitHub Pages
1. Faça push do código para GitHub
2. Vá em Settings > Pages
3. Selecione a branch main como fonte
4. A aplicação estará disponível em `https://seu-usuario.github.io/pokedx-v2`

## 🐛 Correções Implementadas

Esta versão V2.0 corrige os seguintes problemas da versão anterior:

✅ **Imagens dos Pokémon** - Sistema robusto de fallback para sprites  
✅ **Correção Ortográfica** - "Podedx" → "Pokédx" em toda aplicação  
✅ **Suporte Completo** - Todas as 9 gerações implementadas  
✅ **Comparador Funcional** - Event listeners corrigidos  
✅ **Construtor de Equipes** - Sistema completo e persistente  

## 🔄 API e Cache

- **Cache inteligente** para reduzir requisições
- **Fallback de imagens** para garantir carregamento
- **Tratamento de erros** robusto
- **Rate limiting** respeitoso com a PokéAPI

## 📱 Responsividade

- **Mobile First** - Otimizado para celulares
- **Tablet** - Layout adaptado para tablets
- **Desktop** - Aproveitamento completo de telas grandes
- **Print** - Estilos otimizados para impressão

## 🧪 Testes

Para executar testes básicos:
```bash
npm test
```

## 📈 Performance

- **Lazy Loading** de imagens
- **Pagination** inteligente
- **Debounce** em buscas
- **Cache** eficiente
- **Bundle** otimizado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Desenvolvido por SID

**SID - Soluções Digitais de Excelência**

Seguindo nossos valores fundamentais:
- **Excelência** - Código limpo e otimizado
- **Inovação** - Tecnologias modernas e boas práticas
- **Transparência** - Código open source e documentado
- **Colaboração** - Interface intuitiva e acessível
- **Educação** - Comentários e estrutura didática

## 🙏 Agradecimentos

- [PokéAPI](https://pokeapi.co/) - Fonte oficial de dados Pokémon
- [The Pokémon Company](https://www.pokemon.com/) - Criadores do universo Pokémon
- Comunidade open source - Inspiração e suporte

---

⭐ Se este projeto foi útil, considere dar uma estrela no repositório!

🐛 Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/pokedx-v2/issues)

💡 Tem uma sugestão? [Inicie uma discussão](https://github.com/seu-usuario/pokedx-v2/discussions)