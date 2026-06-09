"""FastAPI application factory.

Loads the pre-computed ML artifacts (movies + similarity matrix) during
startup via the lifespan context manager, and configures CORS, exception
handlers, and route mounting.
"""

import pickle
from contextlib import asynccontextmanager
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.services.recommender import RecommenderService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load pickle files into memory on startup; clean up on shutdown."""
    data_dir = Path(settings.DATA_DIR)

    movies_path = data_dir / "movies.pkl"
    similarity_path = data_dir / "similarity.pkl"

    print(f"Loading data from {data_dir}")

    with open(movies_path, "rb") as f:
        movies_dict = pickle.load(f)
    movies_df = pd.DataFrame(movies_dict)

    with open(similarity_path, "rb") as f:
        similarity = pickle.load(f)

    # Build the recommender service once and store in app state
    app.state.recommender = RecommenderService(movies_df, similarity)
    print(f"Loaded {len(movies_df)} movies + similarity matrix ({similarity.shape})")

    yield  # App is running

    # Cleanup
    del app.state.recommender
    print("Cleaned up recommender resources")


def create_app() -> FastAPI:
    """Construct and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="AI-powered movie recommendation engine using content-based filtering",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Exception Handlers ───────────────────────────────────────

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "data": None,
                "message": str(exc.detail),
                "errors": None,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "data": None,
                "message": "Validation error",
                "errors": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "data": None,
                "message": "Internal server error",
                "errors": str(exc) if settings.DEBUG else None,
            },
        )

    # ── Health Check ─────────────────────────────────────────────

    @app.get("/health", tags=["System"])
    async def health_check() -> dict:
        return {
            "success": True,
            "data": {"status": "ok", "version": settings.APP_VERSION},
            "message": "OK",
            "errors": None,
        }

    # ── Mount API Routers ────────────────────────────────────────
    app.include_router(api_v1_router, prefix="/api/v1")

    return app


app = create_app()
