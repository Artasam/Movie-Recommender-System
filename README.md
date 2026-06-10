# 🎬 CineMatch — AI Movie Recommender

> Discover your next favorite movie with AI-powered content-based recommendations from 4,800+ titles.

**🌍 Live Demo:** [https://cinematch-eight-lime.vercel.app](https://cinematch-eight-lime.vercel.app)

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Local)](#quick-start-local)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Docker Setup (Backend)](#docker-setup-backend)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CineMatch is a full-stack movie recommendation system that uses **content-based filtering** with **cosine similarity** to suggest movies similar to ones you love. The ML pipeline processes movie metadata (genres, keywords, cast, crew, and plot overview) into TF-IDF vectors and computes a 4,806 × 4,806 similarity matrix for instant recommendations.

**How it works:**
1. Movie tags (genres, keywords, overview, cast, crew) are combined and stemmed
2. Count Vectorization creates numerical vectors from the text
3. Cosine similarity measures the "distance" between all movie pairs
4. When you select a movie, the top-N most similar movies are returned instantly

---

## Features

- 🔍 **Instant Search** — Debounced autocomplete search across 4,806 movie titles
- 🎯 **AI Recommendations** — Content-based filtering using cosine similarity
- 🖼️ **Movie Posters** — Real-time poster fetching from TMDB API
- 🌙 **Dark/Light Mode** — System-aware theme with manual toggle
- 📱 **Fully Responsive** — Mobile-first design, 320px → 1920px
- ♿ **Accessible** — WCAG 2.1 AA compliant, keyboard navigation, ARIA labels
- ⚡ **Fast** — Code-split routes, lazy-loaded images, pre-computed similarity matrix
- 📖 **API Docs** — Interactive Swagger/ReDoc at `/docs` and `/redoc`

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + TypeScript | UI framework with strict type safety |
| Vite 8 | Build tool and dev server |
| Vanilla CSS | Custom design system with CSS variables |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state management and caching |
| Zustand | Client state (theme) |
| Axios | HTTP client |
| Lucide React | Icon library |
| React Hot Toast | Notification system |

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.13 | Runtime |
| FastAPI | Async web framework |
| Pydantic v2 | Request/response validation |
| pandas + NumPy | Data manipulation |
| scikit-learn | ML pipeline (cosine similarity) |
| httpx | Async HTTP client (TMDB API) |
| Uvicorn + Gunicorn | ASGI server |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Vercel | Frontend deployment and proxying |
| AWS EC2 | Backend hosting |
| Docker | Backend containerization |

---

## Project Structure

```text
Movie-Recommender-System/
├── frontend/                    # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-level pages
│   │   ├── services/api.ts      # Centralized API layer
│   │   ├── store/               # Zustand theme store
│   │   ├── styles/              # CSS design system
│   │   ├── types/               # TypeScript interfaces
│   │   ├── hooks/               # Custom React hooks
│   │   ├── App.tsx              # Root component + routing
│   │   └── main.tsx             # Entry point
│   └── vercel.json              # Vercel configuration for API proxy and rewrites
│
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── api/v1/endpoints/    # Route handlers
│   │   ├── core/config.py       # Pydantic BaseSettings
│   │   ├── schemas/             # Pydantic v2 models
│   │   ├── services/            # Business logic (recommender, TMDB)
│   │   └── main.py              # App factory + lifespan
│   ├── Dockerfile               # Multi-stage Python build
│   └── requirements.txt         # Pinned dependencies
│
├── movies.pkl                   # Pre-computed movie database (4,806 movies)
├── similarity.pkl               # Cosine similarity matrix
├── movierec.py                  # Original Streamlit app (preserved)
├── docker-compose.yml           # Backend orchestration
└── README.md                    # This file
```

---

## Prerequisites

- **Node.js** 22+ (LTS) — [Download](https://nodejs.org)
- **Python** 3.11+ — [Download](https://python.org)
- **Git** — [Download](https://git-scm.com)
- **Docker** (optional, for backend) — [Download](https://docker.com)
- **TMDB API Key** (free) — [Get one here](https://www.themoviedb.org/settings/api)

---

## Quick Start (Local)

### 1. Clone the repository

```bash
git clone https://github.com/Artasam/Movie-Recommender-System.git
cd Movie-Recommender-System
```

### 2. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your TMDB_API_KEY

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is now running at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API docs.

### 3. Start the Frontend

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app is now running at `http://localhost:5173`. The Vite dev server automatically proxies API requests to the backend.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TMDB_API_KEY` | Yes | — | TMDB API key for poster fetching |
| `CORS_ORIGINS` | No | `["http://localhost:5173"]` | Allowed CORS origins (JSON array) |
| `DATA_DIR` | No | `../` (project root) | Path to pickle files directory |
| `DEBUG` | No | `false` | Enable detailed error responses |
| `HOST` | No | `0.0.0.0` | Server bind host |
| `PORT` | No | `8000` | Server bind port |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `/api/v1` | Backend API URL (handled by proxies in dev/prod) |

---

## API Documentation

### Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/movies?page=1&limit=20` | List movies (paginated) |
| `GET` | `/api/v1/movies/search?q=avatar&limit=10` | Search by title |
| `GET` | `/api/v1/movies/{movie_id}` | Get movie by TMDB ID |
| `GET` | `/api/v1/movies/{movie_id}/poster` | Get poster URL |
| `POST` | `/api/v1/recommend` | Get recommendations |

### Example: Get Recommendations

```bash
curl -X POST http://localhost:8000/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"movie_title": "Avatar", "count": 5}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "source_movie": {"movie_id": 19995, "title": "Avatar"},
    "recommendations": [
      {
        "movie_id": 76338,
        "title": "Thor: The Dark World",
        "poster_url": "https://image.tmdb.org/t/p/w500/...",
        "similarity_score": 0.2432
      }
    ]
  },
  "message": "Found 5 recommendations for 'Avatar'",
  "errors": null
}
```

Interactive docs available at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## Docker Setup (Backend)

The project includes a `docker-compose.yml` for easily running the FastAPI backend locally or on a server.

### Quick Start with Docker Compose

```bash
# Set your TMDB API key
export TMDB_API_KEY=your_key_here

# Build and start the backend service
docker-compose up --build

# Access the API at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Build Individual Container

```bash
# Build and run backend only
cd backend
docker build -t cinematch-api .
docker run -p 8000:8000 -e TMDB_API_KEY=your_key -v ../movies.pkl:/data/movies.pkl:ro -v ../similarity.pkl:/data/similarity.pkl:ro cinematch-api
```

---

## Testing

### Backend

```bash
cd backend
source venv/bin/activate

# Health check
curl http://localhost:8000/health

# Search
curl "http://localhost:8000/api/v1/movies/search?q=batman"

# Recommendations
curl -X POST http://localhost:8000/api/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"movie_title": "The Dark Knight", "count": 5}'
```

### Frontend

```bash
cd frontend
npm run build    # TypeScript compilation check
npm run dev      # Visual verification
```

---

## Deployment

The application utilizes a distributed deployment architecture for optimal performance:

1. **Frontend (Vercel)**
   - Deployed on [Vercel](https://vercel.com/) for fast global edge delivery.
   - **Live URL:** [https://cinematch-eight-lime.vercel.app](https://cinematch-eight-lime.vercel.app)
   - API requests are proxied seamlessly to the backend using `vercel.json` rewrites.
2. **Backend (AWS EC2)**
   - Hosted on an AWS EC2 instance.
   - The FastAPI backend handles recommendation calculations using the pre-computed `similarity.pkl` and `movies.pkl` datasets.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by Artasam — Powered by Machine Learning*