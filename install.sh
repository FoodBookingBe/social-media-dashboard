#!/bin/bash

# 🚀 Super Slim AI Marketing Dashboard - Installatie Script
echo "🚀 Super Slim AI Marketing Dashboard Installatie"
echo "================================================"

# Controleer of Node.js is geïnstalleerd
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is niet geïnstalleerd. Installeer Node.js 18+ eerst."
    exit 1
fi

# Controleer Node.js versie
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versie 18+ is vereist. Huidige versie: $(node -v)"
    exit 1
fi

echo "✅ Node.js versie $(node -v) gedetecteerd"

# Installeer dependencies
echo "📦 Dependencies installeren..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Fout bij installeren dependencies"
    exit 1
fi

echo "✅ Dependencies geïnstalleerd"

# Controleer of Ollama is geïnstalleerd
if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama is niet geïnstalleerd."
    echo "📥 Download van: https://ollama.ai/download"
    echo "🔧 Installeer en start Ollama, dan run dit script opnieuw"
    echo ""
    echo "📋 Vereiste modellen:"
    echo "   ollama pull llama3.3:70b"
    echo "   ollama pull mistral:7b"
    echo "   ollama pull deepseek-r1:8b"
else
    echo "✅ Ollama gedetecteerd"

    # Controleer of modellen zijn geïnstalleerd
    echo "🤖 AI modellen controleren..."

    if ! ollama list | grep -q "llama3.3:70b"; then
        echo "📥 Llama 3.3 70B downloaden..."
        ollama pull llama3.3:70b
    fi

    if ! ollama list | grep -q "mistral:7b"; then
        echo "📥 Mistral 7B downloaden..."
        ollama pull mistral:7b
    fi

    if ! ollama list | grep -q "deepseek-r1"; then
        echo "📥 DeepSeek R1 downloaden..."
        ollama pull deepseek-r1:8b
    fi

    echo "✅ AI modellen klaar"
fi

# Controleer of n8n is geïnstalleerd
if ! command -v npx &> /dev/null || ! npx n8n --version &> /dev/null; then
    echo "⚠️  n8n is niet geïnstalleerd."
    echo "📦 Installeer met: npm install -g n8n"
    echo "🔧 Start n8n met: npx n8n"
else
    echo "✅ n8n beschikbaar"
fi

# Environment bestand kopiëren
if [ ! -f .env.local ]; then
    echo "📋 Environment configuratie..."
    cp .env.example .env.local
    echo "✅ .env.local aangemaakt - configureer je API keys!"
    echo ""
    echo "📝 Vereiste configuratie:"
    echo "   - Supabase project aanmaken: https://supabase.com"
    echo "   - OpenRouter API key: https://openrouter.ai"
    echo "   - Replicate API token: https://replicate.com"
    echo "   - Social media API keys (optioneel)"
else
    echo "✅ Environment bestand bestaat al"
fi

# Supabase setup
echo "🗄️  Supabase configuratie..."
if command -v supabase &> /dev/null; then
    echo "📦 Supabase CLI beschikbaar"

    # Initialiseer Supabase project
    if [ ! -d "supabase" ]; then
        echo "🔧 Supabase project initialiseren..."
        supabase init
    fi

    echo "💾 Database migraties toepassen..."
    supabase db push

    echo "✅ Supabase klaar"
else
    echo "⚠️  Supabase CLI niet geïnstalleerd."
    echo "📦 Installeer met: npm install -g supabase"
fi

echo ""
echo "🎉 Installatie compleet!"
echo ""
echo "🚀 Om te starten:"
echo "   1. Configureer .env.local met je API keys"
echo "   2. Start Supabase: supabase start"
echo "   3. Start n8n: npx n8n"
echo "   4. Start dashboard: npm run dev"
echo ""
echo "📊 Dashboard URL: http://localhost:3000"
echo "🗄️  Supabase Studio: http://localhost:54323"
echo "⚙️  n8n Workflow Editor: http://localhost:5678"
echo ""
echo "📚 Documentatie: zie README.md"
echo ""
echo "❓ Hulp nodig? Check de docs of open een issue."
