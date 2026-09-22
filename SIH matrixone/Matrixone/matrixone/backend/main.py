from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and auto-seed demo dataset on boot.
    try:
        from .database import create_all, SessionLocal
        create_all()
        db = SessionLocal()
        try:
            from .api.v1.router import seed_demo_auth_internal
            seed_demo_auth_internal(db)
        finally:
            db.close()
    except Exception as exc:  # never block boot
        import logging
        logging.getLogger(__name__).warning("create_all/seed on startup failed: %s", exc)
    yield


# Create app first
app = FastAPI(
    title="MATRIXONE Material Harmonization Platform",
    description="AI-Driven Standardization and Harmonization of Material Codes Across CPSEs",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS — allow every common local dev origin.
# NOTE: browsers treat http://localhost:3000 and http://127.0.0.1:3000 as
# different origins, and vite serves on 127.0.0.1 (see vite.config.ts).
# allow_credentials=True forbids "*", so list them explicitly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

# Import and include API router after app creation to avoid circular imports
from .api.v1.router import router
app.include_router(router, prefix="/api")
app.include_router(router, prefix="/api/v1")
app.include_router(router, prefix="/v1")


@app.get("/")
async def root():
    return {"message": "MATRIXONE API is running", "version": "0.1.0"}


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "matrixone-api"}