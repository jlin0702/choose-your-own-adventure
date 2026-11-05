# 🗺️ Choose Your Own Adventure

An AI-powered, interactive branching story generator and web game. Enter any theme, genre, or premise, and the system uses Google Gemini via LangChain to generate an entire non-linear story tree—complete with branching choices, varied storylines, and multiple winning or losing endings.

---

## ✨ Features

- **Prompt-to-Adventure Generation**: Generate custom, multi-level branching stories dynamically based on any theme or scenario.
- **Asynchronous Background Generation**: Long-running LLM story generation jobs run in the background with real-time status polling on the client.
- **Interactive Gameplay**: Step through the narrative branch-by-branch, make choices that steer the story, explore alternative paths, or restart from the beginning.
- **Structured Story Graph**: Generates deep story trees (3–4 levels) with root nodes, branching decisions, and designated winning and losing endings.
- **End-to-End Type Safety**: Automatically generate TypeScript definitions from FastAPI's OpenAPI specification for frontend client calls via `openapi-fetch`.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **LLM Orchestration**: [LangChain](https://www.langchain.com/) & [LangChain Google GenAI](https://python.langchain.com/docs/integrations/chat/google_generative_ai/) (`gemini-3.8-flash`)
- **Database & ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) with [PostgreSQL](https://www.postgresql.org/) (`psycopg2-binary`)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **API Client**: [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) + [openapi-typescript](https://openapi-ts.dev/openapi-typescript/)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter)

---

## 📁 Repository Structure

```text
choose-your-own-adventure/
├── backend/
│   ├── core/                  # App configuration, prompts, and story generator logic
│   │   ├── config.py          # Pydantic BaseSettings and env variables
│   │   ├── models.py          # Pydantic schemas for LLM structured output
│   │   ├── prompts.py         # System prompt and JSON structure templates
│   │   └── story_generator.py # LangChain story graph generation and DB insertion
│   ├── db/                    # SQLAlchemy database engine and session setup
│   │   └── database.py
│   ├── models/                # SQLAlchemy database models (Story, StoryNode, StoryJob)
│   ├── routers/               # FastAPI route controllers
│   │   ├── job.py             # Story job status polling endpoints
│   │   └── story.py           # Story creation & retrieval endpoints
│   ├── schemas/               # API request and response Pydantic models
│   ├── main.py                # FastAPI entry point & CORS configuration
│   ├── pyproject.toml         # Backend project dependencies and scripts
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── api/               # API client and generated OpenAPI TypeScript types
│   │   ├── components/        # React components (StoryGame, StoryGenerator, StoryLoader, etc.)
│   │   ├── App.tsx            # Main router and shell layout
│   │   └── main.tsx           # React DOM root entry
│   ├── package.json           # Frontend dependencies & npm scripts
│   ├── tsconfig.json          # TypeScript configuration
│   └── vite.config.ts         # Vite configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Python**: `>= 3.12`
- **uv**: Fast Python package installer and resolver (`curl -LsSf https://astral.sh/uv/install.sh | sh` or `brew install uv`)
- **Node.js**: `>= 18` and `npm`
- **PostgreSQL**: Running locally or hosted (e.g. Supabase, Neon, Docker)
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file from the following template:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database_name>
   API_PREFIX=/api
   DEBUG=True
   ALLOWED_ORIGINS=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Start the backend development server:
   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *Tables are automatically created on initial startup.*

   The API will be available at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Configure environment variables in `frontend/.env` if using a custom backend port:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | string | *Required* | PostgreSQL database connection string (e.g. `postgresql://user:pass@localhost:5432/dbname`) |
| `GEMINI_API_KEY` | string | *Required* | Google Gemini API key for story generation |
| `ALLOWED_ORIGINS` | string | `""` | Comma-separated list of allowed CORS origins (e.g. `http://localhost:5173`) |
| `API_PREFIX` | string | `/api` | Root route prefix for the mounted API routes |
| `DEBUG` | boolean | `False` | Enables debug mode |

### Frontend (`frontend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | string | `http://localhost:8000/api` | Base URL pointing to the FastAPI backend API prefix |

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/story/create` | Initiates an asynchronous story generation job with the specified theme |
| `GET` | `/api/job/{job_id}` | Checks status of a generation job (`pending`, `processing`, `completed`, `failed`) |
| `GET` | `/api/story/{story_id}/complete` | Fetches the full story tree and all node connections for gameplay |

Interactive documentation is available at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🔄 Updating API Client Types

When you add or update endpoints on the backend, you can regenerate the frontend TypeScript types directly from the live OpenAPI schema:

1. Ensure the backend server is running on `http://localhost:8000`.
2. Run the type generator from `frontend/`:
   ```bash
   cd frontend
   npm run generate-types
   ```
   This will update `frontend/src/api/schema.ts`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
