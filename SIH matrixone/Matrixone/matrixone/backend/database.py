from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool, StaticPool
import logging

from .config import get_settings

settings = get_settings()

logger = logging.getLogger(__name__)


def _build_engine():
    """Build the database engine, supporting SQLite (dev) and PostgreSQL (production)."""
    url = settings.database_url
    logger.info(f"Building database engine with URL: {url}")

    # Parse the URL to determine dialect
    if url.startswith("sqlite://"):
        # SQLite setup — StaticPool keeps ONE shared connection.
        # Required for :memory: (each pooled connection would otherwise get
        # its own empty database → random "no such table" errors across requests).
        engine = create_engine(
            url,
            poolclass=StaticPool,
            echo=False,
            connect_args={"check_same_thread": False},
        )
    elif url.startswith("postgresql"):
        # PostgreSQL with pgvector
        engine = create_engine(
            url,
            poolclass=QueuePool,
            pool_size=5,
            max_overflow=10,
            pool_recycle=3600,
            echo=False,
        )
    else:
        raise ValueError(f"Unsupported database URL: {url}")

    return engine


engine = _build_engine()

SessionLocal = sessionmaker(bind=engine, class_=Session, autoflush=False, autocommit=False)


def get_db() -> Session:
    """Dependency to get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all():
    """Create all database tables (for development / testing)."""
    from . import Models  # noqa: F401 - registers all models
    from .database_base import metadata
    metadata.create_all(bind=engine)
    logger.info("All database tables created successfully.")


def drop_all():
    """Drop all database tables."""
    from . import Models  # noqa: F401 - registers all models
    from .database_base import metadata
    metadata.drop_all(bind=engine)
    logger.info("All database tables dropped.")