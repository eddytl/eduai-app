# EduAI Cameroun

Tuteur IA personnalisé pour les élèves du secondaire camerounais (programmes MINESEC).  
L'agent adapte chaque réponse à la classe, la série et la langue de l'élève.

---

## Aperçu

```
L'élève envoie un message
        ↓
L'agent récupère le profil via MCP (classe, série, langue)
        ↓
Mistral génère une réponse en streaming SSE
        ↓
L'élève reçoit une réponse adaptée à son niveau
```

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Vue.js 3, Vite, Tailwind CSS, Pinia |
| API REST | Node.js, Express, MongoDB, Mongoose |
| Agent IA | Mistral AI (`mistral-large-latest`), MCP Client |
| MCP Server | `@modelcontextprotocol/sdk` |
| Auth | JWT + bcryptjs |
| Streaming | SSE (Server-Sent Events) natif |
| Déploiement | Docker Compose, nginx |

---

## Architecture

```
┌─────────────────┐   POST /chat/stream   ┌──────────────────┐   get_student_profile   ┌──────────────┐
│   Vue.js 3      │ ───────────────────►  │   Agent IA       │ ──────────────────────► │  MCP Server  │
│   (Port 5173)   │   SSE streaming       │   (Port 3002)    │ ◄────────────────────── │  (Port 3001) │
└─────────────────┘                       └────────┬─────────┘   {classe, série...}    └──────┬───────┘
                                                   │                                          │
         ┌─────────────────────────────────────────┘                                          │ Mongoose
         │ Mistral API                                                                         ▼
         ▼                                                                               MongoDB
 Réponse adaptée                                                                    (collection users)
 au niveau MINESEC
                                          ┌──────────────────┐
                                          │   API CRUD       │
                                          │   (Port 3000)    │
                                          │ /api/auth        │
                                          │ /api/users       │
                                          └──────────────────┘
```

En production, le frontend nginx proxifie `/api/` → `api:3000` et `/chat` → `agent:3002`.

---

## Fonctionnalités

- **Tuteur adaptatif** — répond selon la classe (6e→Terminale), la série (A, C, D, F…) et la langue (fr/en)
- **Streaming temps réel** — réponses affichées mot par mot via SSE
- **Markdown + LaTeX** — rendu des équations mathématiques (KaTeX)
- **Historique multi-conversations** — persisté en localStorage, recherche full-text
- **Vue Discussions** — liste complète des conversations avec temps relatif
- **Light / Dark mode** — toggle dans le sidebar, mémorisé
- **Profil éditable** — mise à jour classe, série, langue
- **Design Claude-like** — interface épurée, sidebar collapsable

---

## Structure du projet

```
eduai-app/
├── docker-compose.yml
├── backend/
│   ├── api/                    # API REST (Port 3000)
│   │   └── src/
│   │       ├── controllers/    # auth, users
│   │       ├── models/         # User.model.js
│   │       ├── routes/         # auth, users
│   │       └── middleware/     # JWT auth
│   ├── mcp-server/             # Serveur MCP (Port 3001)
│   │   └── src/
│   │       └── tools/          # get_student_profile
│   └── agent/                  # Agent IA (Port 3002)
│       └── src/
│           ├── agent.js        # MCP Client + Mistral streaming
│           ├── prompts/        # Prompt système dynamique
│           └── routes/         # POST /chat/stream
└── frontend/                   # Vue.js 3 + Vite
    └── src/
        ├── pages/              # Chat, Login, Register, Profile
        ├── stores/             # auth.store, chat.store (Pinia)
        └── router/
```

---

## Démarrage rapide (développement)

### Prérequis
- Node.js 20+
- MongoDB en local ou Atlas
- Clé API Mistral (`mistral-large-latest`)

### 1. Variables d'environnement

**`backend/api/.env`**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/eduai_cameroun
JWT_SECRET=ton_secret_jwt
```

**`backend/mcp-server/.env`**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/eduai_cameroun
```

**`backend/agent/.env`**
```env
PORT=3002
MISTRAL_API_KEY=ta_cle_mistral
MCP_SERVER_URL=http://localhost:3001/mcp
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
VITE_AGENT_URL=http://localhost:3002
```

### 2. Lancer les services

```bash
# Terminal 1 — API CRUD
cd backend/api && npm install && npm run dev

# Terminal 2 — MCP Server
cd backend/mcp-server && npm install && npm run dev

# Terminal 3 — Agent IA
cd backend/agent && npm install && npm run dev

# Terminal 4 — Frontend
cd frontend && npm install && npm run dev
```

L'application est accessible sur `http://localhost:5173`

---

## Déploiement Docker

```bash
# Copier et renseigner les .env
cp backend/api/.env.example backend/api/.env
cp backend/mcp-server/.env.example backend/mcp-server/.env
cp backend/agent/.env.example backend/agent/.env

# Lancer tous les services
docker compose up -d --build
```

L'application est accessible sur `http://localhost`

---

## API — Endpoints principaux

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion → token JWT |
| GET | `/api/auth/me` | Profil courant |

### Utilisateurs
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users/profile` | Lire le profil |
| PUT | `/api/users/profile` | Mettre à jour le profil |

### Agent IA
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/chat/stream` | Réponse en streaming SSE |

**Corps de la requête `/chat/stream` :**
```json
{
  "userId": "664abc...",
  "messages": [
    { "role": "user", "content": "Explique-moi les dérivées" }
  ]
}
```

**Réponse SSE :**
```
data: {"delta":"Bien"}
data: {"delta":" sûr"}
data: [DONE]
```

---

## Modèle utilisateur

```javascript
{
  name:          String,   // Nom complet
  email:         String,   // Email unique
  password_hash: String,
  classe:        String,   // '6eme' | '5eme' | ... | 'terminale'
  serie:         String,   // 'A' | 'C' | 'D' | 'E' | 'F' | 'O_Level' | 'A_Level' | 'sans'
  langue:        String,   // 'fr' | 'en'
  plan:          String,   // 'free' | 'premium'
  created_at:    Date
}
```

---

## Modèle économique

| Plan | Prix | Limite |
|------|------|--------|
| Gratuit | 0 FCFA | 10 messages / jour |
| Premium | ~2 500 FCFA / mois | Messages illimités |

Paiement prévu : MTN Mobile Money, Orange Money.

---

## Développé avec

- [Mistral AI](https://mistral.ai) — modèle `mistral-large-latest`
- [Model Context Protocol](https://modelcontextprotocol.io) — communication agent ↔ base de données
- [Vue.js 3](https://vuejs.org) — interface utilisateur
- [Tailwind CSS](https://tailwindcss.com) — styles utilitaires
- [KaTeX](https://katex.org) — rendu LaTeX
