from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
    func,
)
from sqlalchemy.orm import relationship

from .database_base import Base, BaseMixIn


class BaseMixIn:
    """Base mixin providing common columns for all models."""

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


# 1. AttributeObservation
class AttributeObservation(Base, BaseMixIn):
    __tablename__ = "attribute_observations"

    source_material_id = Column(Integer, ForeignKey("source_materials.id"), nullable=False)
    attribute_name = Column(String(100), nullable=False)
    raw_value = Column(Text, nullable=False)
    normalized_value = Column(Text, nullable=True)
    unit = Column(String(50), nullable=True)
    source_field_or_text_span = Column(String(200), nullable=True)
    extraction_method = Column(String(100), nullable=False)
    extraction_confidence = Column(Float, nullable=True)
    parser_or_model_version = Column(String(50), nullable=True)
    validation_status = Column(
        String(50), default="pending", nullable=False
    )
    is_identity_critical = Column(Boolean, default=False, nullable=False)
    is_context_dependent = Column(Boolean, default=False, nullable=False)
    is_descriptive = Column(Boolean, default=False, nullable=False)
    is_optional = Column(Boolean, default=False, nullable=False)

    # Relationships
    source_material = relationship("SourceMaterial", back_populates="attribute_observations")


# 2. CategorySchema
class CategorySchema(Base, BaseMixIn):
    __tablename__ = "category_schemas"

    name = Column(String(100), nullable=False, unique=True)
    family = Column(String(50), nullable=False)
    schema_definition = Column(Text, nullable=False)
    is_versioned = Column(Boolean, default=True, nullable=False)
    version = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    category_mappings = relationship("CategoryMapping", back_populates="category_schema", cascade="all, delete-orphan")


# 2. CategoryMapping
class CategoryMapping(Base, BaseMixIn):
    __tablename__ = "category_mappings"

    category_schema_id = Column(
        Integer, ForeignKey("category_schemas.id"), nullable=False
    )
    source_material_id = Column(Integer, ForeignKey("source_materials.id"), nullable=False)
    mapped_attributes = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    review_status = Column(String(50), default="pending", nullable=False)
    reviewed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    category_schema = relationship("CategorySchema", back_populates="category_mappings")
    source_material = relationship("SourceMaterial", back_populates="category_mappings")
    reviewed_by = relationship("User")


# 3. Organization
class Organization(Base, BaseMixIn):
    __tablename__ = "organizations"

    name = Column(String(200), nullable=False, unique=True)
    code = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=False, nullable=False)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    source_systems = relationship("SourceSystem", back_populates="organization", cascade="all, delete-orphan")
    source_materials = relationship("SourceMaterial", back_populates="organization", cascade="all, delete-orphan")
    tenants = relationship("Tenant", back_populates="organization", cascade="all, delete-orphan")
    procurement_snapshots = relationship("ProcurementSnapshot", back_populates="organization", cascade="all, delete-orphan")
    migration_plans = relationship("MigrationPlan", back_populates="organization", cascade="all, delete-orphan")


# 4. Tenant
class Tenant(Base, BaseMixIn):
    __tablename__ = "tenants"

    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), nullable=False, unique=True)
    is_default = Column(Boolean, default=False, nullable=False)

    # Relationships
    organization = relationship("Organization", back_populates="tenants")
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")


# 5. Role
class Role(Base, BaseMixIn):
    __tablename__ = "roles"

    name = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_system = Column(Boolean, default=False, nullable=False)

    # Relationships
    users = relationship("User", back_populates="role", cascade="all, delete-orphan")


# 6. User
class User(Base, BaseMixIn):
    __tablename__ = "users"

    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    email = Column(String(200), nullable=False, unique=True)
    full_name = Column(String(200), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    tenant = relationship("Tenant", back_populates="users")
    role = relationship("Role", back_populates="users")
    import_batches = relationship("ImportBatch", back_populates="uploaded_by", cascade="all, delete-orphan")
    review_requests = relationship("ReviewRequest", back_populates="reviewer", cascade="all, delete-orphan")
    approved_mappings = relationship("CanonicalMapping", back_populates="approved_by", cascade="all, delete-orphan")


# 7. SourceSystem
class SourceSystem(Base, BaseMixIn):
    __tablename__ = "source_systems"

    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    name = Column(String(200), nullable=False)
    client_or_namespace = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    organization = relationship("Organization", back_populates="source_systems")
    source_materials = relationship("SourceMaterial", back_populates="source_system", cascade="all, delete-orphan")


# 7. ImportBatch
class ImportBatch(Base, BaseMixIn):
    __tablename__ = "import_batches"

    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    source_system_id = Column(Integer, ForeignKey("source_systems.id"), nullable=False)
    uploaded_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    format = Column(String(50), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    total_rows = Column(Integer, nullable=True)
    processed_rows = Column(Integer, nullable=True, default=0)
    error_count = Column(Integer, nullable=True, default=0)
    error_details = Column(Text, nullable=True)
    progress_percent = Column(Integer, nullable=True, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    s3_key_or_path = Column(String(500), nullable=True)

    # Relationships
    uploaded_by = relationship("User", back_populates="import_batches")
    source_materials = relationship("SourceMaterial", back_populates="import_batch", cascade="all, delete-orphan")


# 8. SourceMaterial
class SourceMaterial(Base, BaseMixIn):
    __tablename__ = "source_materials"

    import_batch_id = Column(Integer, ForeignKey("import_batches.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    source_system_id = Column(Integer, ForeignKey("source_systems.id"), nullable=False)
    local_material_code = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    description_raw = Column(Text, nullable=True)
    classification = Column(String(100), nullable=True)
    uom = Column(String(50), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    identity_key = Column(String(300), nullable=False, index=True)

    # Relationships
    import_batch = relationship("ImportBatch", back_populates="source_materials")
    organization = relationship("Organization", back_populates="source_materials")
    source_system = relationship("SourceSystem", back_populates="source_materials")
    attribute_observations = relationship("AttributeObservation", back_populates="source_material", cascade="all, delete-orphan")
    category_mappings = relationship("CategoryMapping", back_populates="source_material", cascade="all, delete-orphan")


# 9. SubstituteRelation
class SubstituteRelation(Base, BaseMixIn):
    __tablename__ = "substitute_relations"

    id = Column(Integer, primary_key=True, index=True)
    canonical_material_id = Column(
        Integer, ForeignKey("canonical_materials.id"), nullable=False
    )
    related_canonical_material_id = Column(
        Integer, ForeignKey("canonical_materials.id"), nullable=False
    )
    relationship_type = Column(String(50), nullable=False)
    scope = Column(String(100), nullable=True)
    engineering_approval = Column(String(50), nullable=True)
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    approved_by = relationship("User")
    canonical_material = relationship("CanonicalMaterial", foreign_keys=[canonical_material_id], overlaps="substitute_relations")
    related_canonical_material = relationship("CanonicalMaterial", foreign_keys=[related_canonical_material_id], overlaps="related_substitute_relations")


# 10. CanonicalMaterial
class CanonicalMaterial(Base, BaseMixIn):
    __tablename__ = "canonical_materials"

    common_code = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    description_raw = Column(Text, nullable=True)
    classification = Column(String(100), nullable=True)
    classification_source = Column(String(100), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
    is_active = Column(Boolean, default=True, nullable=False)
    effective_from = Column(DateTime(timezone=True), nullable=True)
    effective_to = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    mappings = relationship("CanonicalMapping", back_populates="canonical_material", cascade="all, delete-orphan")
    substitute_relations = relationship("SubstituteRelation", foreign_keys="[SubstituteRelation.canonical_material_id]", cascade="all, delete-orphan", overlaps="canonical_material")
    related_substitute_relations = relationship("SubstituteRelation", foreign_keys="[SubstituteRelation.related_canonical_material_id]", cascade="all, delete-orphan", overlaps="related_canonical_material")


# 11. CanonicalMapping
class CanonicalMapping(Base, BaseMixIn):
    __tablename__ = "canonical_mappings"

    canonical_material_id = Column(
        Integer, ForeignKey("canonical_materials.id"), nullable=False
    )
    source_material_id = Column(
        Integer, ForeignKey("source_materials.id"), nullable=False
    )
    mapping_status = Column(String(50), default="pending", nullable=False)
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    review_evidence_summary = Column(Text, nullable=True)
    conflict_attributes = Column(Text, nullable=True)
    resolved_by = Column(Text, nullable=True)

    # Relationships
    canonical_material = relationship("CanonicalMaterial", back_populates="mappings")
    source_material = relationship("SourceMaterial")
    approved_by = relationship("User", back_populates="approved_mappings")


# 12. MatchRun
class MatchRun(Base, BaseMixIn):
    __tablename__ = "match_runs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    source_system_id = Column(Integer, ForeignKey("source_systems.id"), nullable=True)
    status = Column(String(50), default="pending", nullable=False)
    trigger = Column(String(50), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)
    total_pairs = Column(Integer, nullable=True)
    completed_pairs = Column(Integer, nullable=True, default=0)
    execution_time_ms = Column(Integer, nullable=True)

    # Relationships
    created_by = relationship("User")
    candidate_pairs = relationship("CandidatePair", back_populates="match_run", cascade="all, delete-orphan")


# 13. CandidatePair
class CandidatePair(Base, BaseMixIn):
    __tablename__ = "candidate_pairs"

    match_run_id = Column(Integer, ForeignKey("match_runs.id"), nullable=False)
    source_material_a_id = Column(Integer, ForeignKey("source_materials.id"), nullable=False)
    source_material_b_id = Column(Integer, ForeignKey("source_materials.id"), nullable=False)
    retrieval_similarity = Column(Float, nullable=True)
    attribute_agreement = Column(Float, nullable=True)
    evidence_completeness = Column(Float, nullable=True)
    conflict_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    decision_category = Column(String(50), nullable=False)

    # Relationships
    match_run = relationship("MatchRun", back_populates="candidate_pairs")
    source_material_a = relationship("SourceMaterial", foreign_keys=[source_material_a_id])
    source_material_b = relationship("SourceMaterial", foreign_keys=[source_material_b_id])
    evidence_records = relationship("EvidenceRecord", back_populates="candidate_pair", cascade="all, delete-orphan")
    review_request = relationship("ReviewRequest", back_populates="candidate_pair", uselist=False, cascade="all, delete-orphan")


# 13. EvidenceRecord
class EvidenceRecord(Base, BaseMixIn):
    __tablename__ = "evidence_records"

    candidate_pair_id = Column(Integer, ForeignKey("candidate_pairs.id"), nullable=False)
    attribute_name = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    value_a = Column(Text, nullable=True)
    value_b = Column(Text, nullable=True)
    normalization_applied = Column(Text, nullable=True)
    evidence_level = Column(String(50), default="weak", nullable=False)
    model_version = Column(String(50), nullable=True)
    rule_version = Column(String(50), nullable=True)

    # Relationships
    candidate_pair = relationship("CandidatePair", back_populates="evidence_records")


# 14. ReviewRequest
class ReviewRequest(Base, BaseMixIn):
    __tablename__ = "review_requests"

    id = Column(Integer, primary_key=True, index=True)
    candidate_pair_id = Column(Integer, ForeignKey("candidate_pairs.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    required_role = Column(String(50), nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    decision = Column(String(50), nullable=True)
    decision_reason = Column(Text, nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    requested_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    candidate_pair = relationship("CandidatePair", back_populates="review_request")
    reviewer = relationship("User", back_populates="review_requests")


# 15. ProcurementSnapshot
class ProcurementSnapshot(Base, BaseMixIn):
    __tablename__ = "procurement_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    source_material_id = Column(Integer, ForeignKey("source_materials.id"), nullable=True)
    canonical_material_id = Column(Integer, ForeignKey("canonical_materials.id"), nullable=True)
    purchase_order_count = Column(Integer, nullable=True)
    total_quantity = Column(Float, nullable=True)
    total_value = Column(Float, nullable=True)
    currency = Column(String(50), nullable=True)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    snapshot_date = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    organization = relationship("Organization", back_populates="procurement_snapshots")
    source_material = relationship("SourceMaterial")
    canonical_material = relationship("CanonicalMaterial")


# 16. MigrationPlan
class MigrationPlan(Base, BaseMixIn):
    __tablename__ = "migration_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    source_system_id = Column(Integer, ForeignKey("source_systems.id"), nullable=True)
    status = Column(String(50), default="draft", nullable=False)
    mapping_set_id = Column(Integer, ForeignKey("canonical_mappings.id"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    executed_at = Column(DateTime(timezone=True), nullable=True)
    rollback_plan = Column(Text, nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="migration_plans")
    source_system = relationship("SourceSystem")
    created_by = relationship("User")
    canonical_mapping = relationship("CanonicalMapping")


# 17. AuditEvent
class AuditEvent(Base, BaseMixIn):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(100), nullable=False, unique=True)
    timestamp = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=True)
    previous_version_reference = Column(String(100), nullable=True)
    new_version_reference = Column(String(100), nullable=True)
    reason = Column(Text, nullable=True)
    request_id = Column(String(100), nullable=True)
    previous_event_hash = Column(String(64), nullable=True)
    event_hash = Column(String(64), nullable=False)

    # Relationships
    actor = relationship("User")
    organization = relationship("Organization")