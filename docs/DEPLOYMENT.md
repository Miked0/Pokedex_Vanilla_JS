# 🚀 Guia de Deploy - Pokédx V2.0 PWA

## 🎯 **Estratégias de Deploy**

### **🥇 Vercel (Recomendado para PWA)**

**Por que Vercel:**
- ✅ Otimização automática para PWA
- ✅ HTTPS gratuito e automático
- ✅ Edge network global
- ✅ Deploy automático via Git
- ✅ Preview deployments

**Setup:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar domínio customizado (opcional)
vercel domains add pokedx.seudomain.com

# 4. Deploy production
vercel --prod
```

**Configuração (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/sw.js",
      "headers": {
        "Service-Worker-Allowed": "/"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/javascript"
        }
      ]
    }
  ]
}
```

---

### **🥈 Netlify**

**Configuração (_redirects):**
```
# PWA Service Worker
/sw.js   /sw.js   200!

# SPA fallback
/*    /index.html   200
```

**Deploy:**
```bash
# Via CLI
npm i -g netlify-cli
netlify init
netlify deploy --prod

# Via drag & drop
# Vá em https://app.netlify.com/drop
# Arraste pasta do projeto
```

---

### **🥉 GitHub Pages**

**Setup:**
```bash
# 1. Push para GitHub
git add .
git commit -m "deploy: Pokédx V2.0 PWA production ready"
git push origin main

# 2. Habilitar GitHub Pages
# GitHub repo > Settings > Pages
# Source: Deploy from branch 'main'

# 3. Configurar domínio (opcional)
echo "pokedx.seudomain.com" > CNAME
git add CNAME
git commit -m "add: custom domain"
git push
```

---

## 🔧 **Configurações Pré-Deploy**

### **📝 Checklist Técnico**

**✅ PWA Requirements:**
- [ ] manifest.json válido
- [ ] Service Worker funcionando  
- [ ] HTTPS habilitado
- [ ] Icons 192x192 e 512x512
- [ ] Start URL configurada
- [ ] Offline page disponível

**✅ Performance:**
- [ ] Lighthouse 95+ score
- [ ] Core Web Vitals otimizados
- [ ] Images otimizadas (WebP/AVIF)
- [ ] Bundle size < 1MB
- [ ] First Load < 3s

**✅ SEO & Meta:**
- [ ] Meta tags completas
- [ ] Open Graph configurado
- [ ] Sitemap.xml gerado
- [ ] robots.txt configurado
- [ ] Schema.org markup

---

## 📊 **Monitoramento Pós-Deploy**

### **🎯 Métricas Chave para Acompanhar**

**Performance:**
- 📈 **PageSpeed Score**: Target 95+
- ⚡ **Core Web Vitals**: LCP, FID, CLS
- 📦 **Bundle Size**: Manter < 1MB
- 🔄 **Cache Hit Rate**: Target 85%+

**Engagement:**
- 👥 **PWA Installs**: Taxa de instalação
- 🔄 **Return Rate**: Usuários recorrentes  
- ⏱️ **Time on App**: Tempo médio de uso
- 📱 **Device Types**: Mobile vs Desktop

**Technical:**
- 🚨 **Error Rate**: < 1% target
- 🔌 **Offline Usage**: Funcionalidade offline
- 🔄 **SW Update Rate**: Atualizações automáticas
- 🌐 **API Response**: Tempos da PokeAPI

---

## 🛠️ **Deploy Scripts Automatizados**

### **Build & Deploy Pipeline**
```bash
#!/bin/bash
# Complete deployment script

echo "🚀 Pokédx V2.0 - Auto Deploy Starting..."

# 1. Pre-deployment checks
./scripts/test.sh

# 2. Optimize assets  
# (In future: minify, compress, optimize images)

# 3. Deploy to production
if command -v vercel > /dev/null 2>&1; then
    echo "📤 Deploying to Vercel..."
    vercel --prod --confirm
elif command -v netlify > /dev/null 2>&1; then
    echo "📤 Deploying to Netlify..."
    netlify deploy --prod
else
    echo "📤 Pushing to GitHub..."
    git push origin main
fi

# 4. Post-deploy validation
echo "🧪 Running post-deploy tests..."
curl -f https://your-domain.com > /dev/null && echo "✅ Site accessible"

echo "✅ Deploy completed successfully!"
```

---

## 🌐 **Configurações de Produção**

### **🔒 Security Headers**
```javascript
// Em vercel.json ou netlify.toml
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https://pokeapi.co https://*.githubusercontent.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*"
        }
      ]
    }
  ]
}
```

### **⚡ Performance Headers**
```javascript
{
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2))",
      "headers": [
        {
          "key": "Cache-Control", 
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📋 **Deploy Checklist Final**

### **🔍 Pré-Deploy**
- [ ] ✅ Todos testes passando
- [ ] ✅ Performance otimizada (Lighthouse 95+)
- [ ] ✅ PWA requirements atendidos
- [ ] ✅ Cross-browser testing completo
- [ ] ✅ Mobile testing em dispositivos reais
- [ ] ✅ Offline functionality validada

### **🚀 Durante Deploy**
- [ ] ✅ Environment variables configuradas
- [ ] ✅ Domain/subdomain configurado
- [ ] ✅ SSL certificate ativo
- [ ] ✅ CDN cache configurado
- [ ] ✅ Error pages customizadas

### **✅ Pós-Deploy**
- [ ] ✅ Site acessível via URL
- [ ] ✅ PWA install prompt funciona
- [ ] ✅ Service Worker ativo
- [ ] ✅ Offline mode testado
- [ ] ✅ Analytics configurado
- [ ] ✅ Monitoring ativo

---

## 🆘 **Troubleshooting Deploy**

### **❌ Problemas Comuns**

**PWA não instala:**
- Verificar HTTPS ativo
- Validar manifest.json syntax
- Confirmar Service Worker registrado
- Testar em different browsers

**Service Worker fails:**
- Checar Content-Type headers
- Verificar scope do SW
- Validar cache strategies
- Debug no DevTools

**Performance baixa:**
- Otimizar images
- Enable compression (gzip/brotli)
- Configure CDN caching
- Minify assets

**CORS errors:**
- Configurar headers adequados
- Verificar API endpoints
- Check preflight requests
- Update CSP policies

---

## 📊 **Monitoring & Analytics**

### **📈 Ferramentas Recomendadas**
- **Google Analytics 4**: User behavior
- **Google PageSpeed**: Performance monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Hotjar**: User experience insights

### **🎯 KPIs para Monitorar**
- **PWA Install Rate**: % de instalações
- **Offline Usage**: Uso sem conexão
- **Performance Score**: Lighthouse score
- **User Engagement**: Tempo médio, pages/session
- **Error Rate**: Bugs e crashes
- **API Response**: Latência PokeAPI

---

**🎉 Com este guia, sua Pokédx V2.0 PWA estará rodando em produção com excelência técnica garantida!**

*Deploy realizado com padrões enterprise pela Equipe SID Elite*