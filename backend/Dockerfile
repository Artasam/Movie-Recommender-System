# ── Backend: Multi-stage Python build ────────────────────────────
FROM python:3.13-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Stage 1: Install dependencies
FROM base AS builder
COPY requirements.txt ./
RUN pip install --prefix=/install -r requirements.txt

# Stage 2: Production image
FROM base AS production
COPY --from=builder /install /usr/local
COPY ./app ./app

# Copy the model files directly into the image's /data directory
# (Assumes movies.pkl and similarity.pkl are copied into the backend directory)
ENV DATA_DIR=/data
COPY movies.pkl /data/movies.pkl
COPY similarity.pkl /data/similarity.pkl

# Non-root user for security
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup --home /home/appuser appuser && \
    mkdir -p /home/appuser && \
    chown appuser:appgroup /home/appuser
USER appuser

EXPOSE 8000
CMD ["gunicorn", "app.main:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--worker-tmp-dir", "/dev/shm"]
