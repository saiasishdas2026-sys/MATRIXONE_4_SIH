from sqlalchemy import MetaData
from sqlalchemy.orm import declarative_base

metadata = MetaData()

Base = declarative_base(metadata=metadata)


class BaseMixIn:
    """Base mixin - provides no columns since each model defines its own."""
    pass