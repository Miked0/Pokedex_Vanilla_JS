#!/bin/bash
# 🎮 Pokédx V2.0 PWA - Setup Script
# Equipe SID Elite

echo "🚀 Pokédx V2.0 PWA - Setup Iniciando..."
echo "======================================="

# Verificar se Node.js está disponível
if command -v node > /dev/null 2>&1; then
    echo "✅ Node.js encontrado: $(node --version)"
else
    echo "⚠️  Node.js não encontrado - usando servidor Python"
fi

# Verificar se estamos no diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute no diretório do projeto Pokédx"
    exit 1
fi

echo "📋 Validando arquivos do projeto..."

required_files=("index.html" "manifest.json" "sw.js" "offline.html")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - MISSING"
        exit 1
    fi
done

echo ""
echo "🎯 Projeto Pokédx V2.0 validado com sucesso!"
echo ""
echo "🚀 Para iniciar o servidor de desenvolvimento:"
echo "   Option 1: python -m http.server 8000"
echo "   Option 2: npx serve ."
echo "   Option 3: php -S localhost:8000"
echo ""
echo "📱 Após iniciar, acesse: http://localhost:8000"
echo "📲 Para testar PWA: abra no Chrome e clique 'Instalar'"
echo ""
echo "✨ Desenvolvido pela Equipe SID Elite"
echo "🌟 Where Gaming Meets Technology Excellence"
