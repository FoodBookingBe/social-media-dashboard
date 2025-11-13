# 🚀 Super Slim Autonoom AI Marketing Dashboard

Een intelligente AI-marketingbuddy die automatisch sociale media monitort, content genereert, leert van prestaties en volledig autonoom opereert.

## 🎯 Kernfunctionaliteiten

- **Automatische monitoring**: Sociale media, reviews, events en weer
- **AI-gedreven content creatie**: Posts, slogans en afbeeldingen in huisstijl
- **Voorspellende analytics**: Optimaliseert timing, format en kanalen
- **Sentiment analyse**: Automatische responses op feedback
- **Self-learning**: Continu leren van wat werkt
- **Realtime dashboard**: KPI tracking en alerts

## 🛠 Tech Stack

| Component | Technologie | Rol |
|-----------|-------------|-----|
| **AI** | Ollama + Llama 3.3/Mistral 7B/DeepSeek R1 | Lokale AI modellen |
| **Database** | Supabase | Data opslag en realtime |
| **Workflows** | n8n | Automatisering en data ingestie |
| **Frontend** | Next.js + Vercel | Dashboard en serverless functies |
| **Afbeeldingen** | Replicate | AI-afbeelding generatie |

## 📁 Project Structuur

```
├── backend/           # Server-side logica en API's
│   └── src/
│       ├── ai/        # AI modules en integraties
│       ├── api/       # API endpoints
│       └── workflows/ # Workflow handlers
├── frontend/          # Next.js dashboard
│   └── src/
│       ├── components/# React componenten
│       ├── pages/     # Next.js pagina's
│       ├── lib/       # Utility functies
│       └── hooks/     # Custom React hooks
├── database/          # Supabase schema's
│   ├── migrations/    # Database migraties
│   └── seed/          # Seed data
├── ai-models/         # AI configuraties
│   ├── config/        # Model configuraties
│   └── prompts/       # AI prompts
├── workflows/         # n8n workflows
│   ├── n8n/           # Workflow definities
│   └── templates/     # Workflow templates
└── docs/              # Documentatie
```

## 🚀 Installatie

1. **Dependencies installeren:**
   ```bash
   npm install
   ```

2. **Environment variabelen configureren:**
   ```bash
   cp .env.example .env.local
   ```

3. **Supabase opzetten:**
   ```bash
   npm run db:push
   ```

4. **Ollama installeren en modellen downloaden:**
   ```bash
   # Ollama installeren
   # Modellen downloaden
   ollama pull llama3.3:70b
   ollama pull mistral:7b
   ```

5. **n8n opzetten:**
   ```bash
   npx n8n
   ```

6. **Development server starten:**
   ```bash
   npm run dev
   ```

## 🔧 Configuratie

### Environment Variabelen (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs
REPLICATE_API_TOKEN=your_replicate_token
OPENROUTER_API_KEY=your_openrouter_key

# Social Media APIs
FACEBOOK_APP_ID=your_facebook_app_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
LINKEDIN_ACCESS_TOKEN=your_linkedin_token

# Weather API
OPENWEATHER_API_KEY=your_weather_api_key
```

## 📊 Data Flow

```
Social Media/Reviews/Events/Weather
          ↓ (n8n workflows)
      Data Ingestie & Processing
          ↓ (Supabase)
      Database Storage
          ↓ (AI Modules)
  Content AI ←→ Predictive AI ←→ Sentiment AI
          ↓ (Self-Learning Loop)
      Geoptimaliseerde Content
          ↓ (Dashboard)
  Realtime KPI's & Alerts
```

## 🎨 AI Routing Strategie

| Taak | Model | Reden |
|------|-------|-------|
| Eenvoudige tekst | Mistral 7B | Razendsnel, weinig resources |
| Content creatie | Llama 3.3 70B | GPT-4 kwaliteit, lokaal |
| Complexe analyse | Claude/OpenRouter | Advanced reasoning |
| Afbeeldingen | Replicate | Kosten-effectief |

## 📈 Dashboard Features

- **Realtime metrics**: Engagement, sentiment, ROI
- **Predictive insights**: Post performance voorspellingen
- **Automated alerts**: Negatieve feedback, kansen
- **A/B testing**: Automatische optimalisatie
- **Competitor monitoring**: Leer van concurrenten
- **Multi-language support**: Automatische vertalingen

## 🤖 AI Modules

### Content AI
- Caption en hashtag generatie
- Huisstijl toepassen op visuals
- Content recycling en optimalisatie

### Predictive Analytics
- Engagement voorspellingen
- Optimale posting tijden
- Kanaal performance analyse

### Sentiment Analysis
- Review en comment analyse
- Automatische responses
- Crisis detection

### Contextual Intelligence
- Weer-gebaseerde content aanpassing
- Event-aware marketing
- Seasonal optimalisatie

## 🔄 Self-Learning Loop

1. **Monitor**: Performance van alle content
2. **Analyse**: Wat werkt en wat niet
3. **Leer**: Update modellen en strategieën
4. **Optimaliseer**: Verbeter toekomstige content
5. **Herhaal**: Continue verbetering

## 📞 Support

Voor vragen of ondersteuning, bekijk de [documentatie](./docs/) of open een issue.

---

**Kosten**: Quasi gratis - lokale AI modellen + strategische externe API gebruik
