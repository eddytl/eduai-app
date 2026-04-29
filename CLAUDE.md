# EduAI Cameroun — CLAUDE.md

## Projet
Application web IA d'aide à l'apprentissage pour les élèves du secondaire camerounais.
Développée en solo avec Claude Code.

## Stack Technique
- **Backend API** : Node.js + Express
- **MCP Server** : `@modelcontextprotocol/sdk`
- **Agent IA** : Mistral API (`mistral-large-latest`) + MCP Client
- **Base de données** : MongoDB + Mongoose
- **Frontend** : Vue.js 3 + Vite
- **Auth** : JWT + bcryptjs
- **Paiement** : MTN Mobile Money, Orange Money

## Principe Central

```
L'élève envoie un message
        ↓
L'agent récupère le profil de l'élève via MCP (classe, série, langue)
        ↓
L'agent répond en tenant compte de la classe de l'élève
        ↓
L'élève reçoit une réponse adaptée à son niveau
```

**L'agent sait toujours à qui il parle** grâce au profil stocké en base.

## Flux Technique

```
┌──────────────┐  POST /chat  ┌───────────────┐  get_student_profile  ┌──────────────┐
│  Vue.js 3    │ ──────────►  │   Agent IA    │ ───────────────────►  │  MCP Server  │
│  (chat UI)   │              │  (Port 3002)  │ ◄───────────────────  │  (Port 3001) │
└──────────────┘              └───────┬───────┘    {classe, série,    └──────┬───────┘
                                      │              langue}                 │
                                      │ Claude API                           │ Mongoose
                                      ▼                                      ▼
                              Génère réponse                            MongoDB
                              adaptée au niveau                    (collection users)
```

## Structure du Projet

```
edu-ai-app/
├── CLAUDE.md
├── backend/
│   ├── api/                        # CRUD REST (Port 3000)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── users.routes.js
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── users.controller.js
│   │   │   ├── models/
│   │   │   │   └── User.model.js
│   │   │   └── middleware/
│   │   │       └── auth.middleware.js
│   │   ├── .env
│   │   └── package.json
│   │
│   ├── mcp-server/                 # Expose outils à l'agent (Port 3001)
│   │   ├── src/
│   │   │   ├── tools/
│   │   │   │   └── student.tools.js  # get_student_profile
│   │   │   └── index.js
│   │   ├── .env
│   │   └── package.json
│   │
│   └── agent/                      # Agent IA (Port 3002)
│       ├── src/
│       │   ├── agent.js            # MCP Client + Claude API
│       │   ├── prompts/
│       │   │   └── tutor.prompt.js # Prompt système dynamique
│       │   └── routes/
│       │       └── chat.routes.js  # POST /chat
│       ├── .env
│       └── package.json
│
└── frontend/                       # Vue.js 3 + Vite (Port 5173)
    ├── src/
    │   ├── pages/
    │   │   ├── Login.vue
    │   │   ├── Register.vue
    │   │   ├── Dashboard.vue
    │   │   └── Chat.vue
    │   ├── components/
    │   │   ├── ChatMessage.vue
    │   │   └── ChatInput.vue
    │   ├── stores/
    │   │   ├── auth.store.js
    │   │   └── chat.store.js
    │   └── router/index.js
    └── package.json
```

## Modèle User (MongoDB)

```javascript
{
  name: String,
  email: String,
  password_hash: String,
  classe: String,   // '6eme' | '5eme' | '4eme' | '3eme' | 'seconde' | 'premiere' | 'terminale'
  serie: String,    // 'A' | 'C' | 'D' | 'E' | 'F' | 'O_Level' | 'A_Level'
  langue: String,   // 'fr' | 'en'
  plan: String,     // 'free' | 'premium'
  created_at: Date
}
```

## Outil MCP : get_student_profile

```javascript
// L'agent appelle cet outil au début de chaque conversation
// Input  : user_id
// Output : { name, classe, serie, langue }

// Exemple de retour :
{
  name: "Paul Mbarga",
  classe: "terminale",
  serie: "C",
  langue: "fr"
}
```

## Prompt Système Dynamique

```javascript
// tutor.prompt.js
const buildSystemPrompt = (student) => `
Tu es un professeur expert polyvalent du système éducatif camerounais (programmes MINESEC).
Tu aides ${student.name}, élève en classe de ${student.classe} ${student.serie}.

MATIÈRES : Tu maîtrises toutes les matières du secondaire camerounais :
Mathématiques, Physique-Chimie, SVT, Français, English, Histoire-Géographie,
Philosophie, Économie, Informatique, et toute autre matière demandée.

CE QUE TU PEUX FAIRE :
- Expliquer n'importe quelle notion ou concept, de façon simple ou approfondie
- Générer des exercices progressifs (faciles → difficiles) avec corrections détaillées
- Corriger les réponses de l'élève et expliquer les erreurs
- Faire des résumés de cours ou des fiches de révision
- Simuler des interrogations ou examens blancs
- Répondre à toute question de culture générale ou d'orientation

RÈGLES :
- Réponds toujours en ${student.langue === 'fr' ? 'français' : 'anglais'}
- Adapte le niveau de tes réponses à la classe ${student.classe} ${student.serie}
- Suis les programmes officiels MINESEC du Cameroun
- Pour les maths/sciences : montre chaque étape, aucun saut de calcul
- Utilise des exemples concrets du contexte camerounais quand c'est pertinent
- Si l'élève se trompe : corrige avec bienveillance et explique pourquoi
- Si l'élève demande des exercices : génère-en plusieurs avec les corrections
`
```

## Modèle Économique
- **Free** : 10 messages/jour
- **Premium** : ~2000-3000 FCFA/mois — messages illimités

## Règles de Développement
- Architecture simple — développeur solo
- Mobile-friendly (Android majoritaire au Cameroun)
- Valider tous les inputs côté backend
- Variables d'environnement pour toutes les clés API
- Optimiser les tokens Claude (prompt concis)

## Commandes
```bash
cd backend/api && npm run dev          # Port 3000
cd backend/mcp-server && npm run dev   # Port 3001
cd backend/agent && npm run dev        # Port 3002
cd frontend && npm run dev             # Port 5173
```

## Variables d'Environnement

**backend/api/.env**
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/eduai_cameroun
JWT_SECRET=
```

**backend/mcp-server/.env**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/eduai_cameroun
```

**backend/agent/.env**
```
PORT=3002
MISTRAL_API_KEY=your_mistral_api_key
MCP_SERVER_URL=http://mcp-server:3001/mcp
```

**frontend/.env**
```
VITE_API_URL=http://localhost:3000
VITE_AGENT_URL=http://localhost:3002
```
