import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from matrixone.backend.database import create_all
from matrixone.backend import Models

# Create all tables
create_all()
print("Tables created successfully!")

# Verify table structure using engine
from sqlalchemy import inspect
inspector = inspect(engine)
for table_name in Models.metadata.tables.keys():
    columns = inspector.get_columns(table_name)
    print(f"\nTable: {table_name}")
    for col in columns:
        print(f"  - {col['name']}: {col['type']}")