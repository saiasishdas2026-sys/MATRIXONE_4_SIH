"""Minimal test of MATRIXONE model creation with SQLite."""

import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from matrixone.backend.config import get_settings
from matrixone.backend.database import create_all
from matrixone.backend.database_base import metadata
from matrixone.backend import Models  # This registers all models

print("Registered model tables:", list(metadata.tables.keys()))

# Create all tables
create_all()
print("Tables created successfully!")