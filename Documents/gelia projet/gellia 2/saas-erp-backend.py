// SaaS ERP Backend API - Multi-tenant Architecture with AI Integration
// FastAPI application with PostgreSQL, Row Level Security, and AI Services

import asyncio
import json
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, String, DateTime, Boolean, JSON, Numeric, Integer, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.dialects.postgresql import UUID
from passlib.context import CryptContext
from jose import JWTError, jwt
import httpx
import os

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://saas_user:password@localhost/saas_erp")
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# AI Service URLs
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

# Database Setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
security = HTTPBearer()

# Database Models
class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True)
    subdomain = Column(String(255), unique=True)
    plan = Column(String(50), default="starter")
    max_users = Column(Integer, default=10)
    max_storage_mb = Column(Integer, default=1024)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    settings = Column(JSON, default={})
    billing_info = Column(JSON, default={})
    
    users = relationship("User", back_populates="tenant")
    ai_services = relationship("AIService", back_populates="tenant")

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    email = Column(String(255), nullable=False)
    username = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role = Column(String(50), default="user")
    department = Column(String(100))
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(JSON, default={})
    
    tenant = relationship("Tenant", back_populates="users")
    transactions = relationship("Transaction", back_populates="created_by_user")
    employees = relationship("Employee", back_populates="user")

class AIService(Base):
    __tablename__ = "ai_services"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    service_name = Column(String(100), nullable=False)
    service_type = Column(String(50), nullable=False)
    api_endpoint = Column(String(500))
    api_key_encrypted = Column(Text)
    is_active = Column(Boolean, default=True)
    configuration = Column(JSON, default={})
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tenant = relationship("Tenant", back_populates="ai_services")

class GlobalResource(Base):
    __tablename__ = "global_resources"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    resource_type = Column(String(100), nullable=False)
    resource_name = Column(String(255), nullable=False)
    region = Column(String(100))
    country = Column(String(100))
    current_price = Column(Numeric(15, 4))
    currency = Column(String(10), default="USD")
    unit_of_measure = Column(String(50))
    availability_status = Column(String(50))
    supplier_info = Column(JSON, default={})
    market_trends = Column(JSON, default={})
    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChartOfAccounts(Base):
    __tablename__ = "chart_of_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    account_code = Column(String(50), nullable=False)
    account_name = Column(String(255), nullable=False)
    account_type = Column(String(50), nullable=False)
    parent_account_id = Column(UUID(as_uuid=True), ForeignKey("chart_of_accounts.id"))
    balance = Column(Numeric(20, 2), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    transaction_number = Column(String(100), unique=True, nullable=False)
    date = Column(DateTime, nullable=False)
    account_id = Column(UUID(as_uuid=True), ForeignKey("chart_of_accounts.id"), nullable=False)
        
        return {"username": username, "tenant_id": tenant_id}

# Navigation CRUD endpoints (tenant-scoped, protected)
    description = Column(Text)
    debit_amount = Column(Numeric(20, 2), default=0)
    credit_amount = Column(Numeric(20, 2), default=0)
    balance_after = Column(Numeric(20, 2))
    category = Column(String(100))
    reference_number = Column(String(100))
    attachments = Column(JSON, default=[])
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    ai_categorization = Column(JSON)
    ai_anomaly_score = Column(Numeric(5, 4))
    
    created_by_user = relationship("User", back_populates="transactions")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    employee_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    department = Column(String(100))
    position = Column(String(100))
    manager_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"))
    hire_date = Column(DateTime, nullable=False)
    termination_date = Column(DateTime)
    salary = Column(Numeric(15, 2))
    currency = Column(String(10), default="USD")
    employment_status = Column(String(50), default="active")
    skills = Column(JSON, default=[])
    performance_metrics = Column(JSON, default={})
    ai_productivity_score = Column(Numeric(5, 2))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="employees")

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    customer_code = Column(String(50), unique=True, nullable=False)
    company_name = Column(String(255))
    industry = Column(String(100))
    contact_person = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    city = Column(String(100))
    country = Column(String(100))
    tax_number = Column(String(100))
    credit_limit = Column(Numeric(15, 2), default=0)
    payment_terms = Column(String(100))
    customer_tier = Column(String(50), default="standard")
    ai_risk_score = Column(Numeric(5, 2))
    ai_churn_probability = Column(Numeric(5, 4))
    total_revenue = Column(Numeric(20, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class SalesOpportunity(Base):
    __tablename__ = "sales_opportunities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    opportunity_name = Column(String(255), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    account_manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    stage = Column(String(100), nullable=False)
    probability = Column(Numeric(5, 2), default=0)
    expected_value = Column(Numeric(15, 2))
    currency = Column(String(10), default="USD")
    expected_close_date = Column(DateTime)
    description = Column(Text)
    competitors = Column(JSON, default=[])
    ai_win_probability = Column(Numeric(5, 4))
    ai_next_steps = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    product_code = Column(String(100), unique=True, nullable=False)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100))
    description = Column(Text)
    unit_cost = Column(Numeric(15, 4))
    selling_price = Column(Numeric(15, 4))
    currency = Column(String(10), default="USD")
    current_stock = Column(Numeric(15, 4), default=0)
    min_stock_level = Column(Numeric(15, 4))
    max_stock_level = Column(Numeric(15, 4))
    reorder_point = Column(Numeric(15, 4))
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"))
    ai_demand_forecast = Column(JSON)
    ai_optimal_reorder_point = Column(Numeric(15, 4))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    supplier_code = Column(String(50), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    contact_person = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    country = Column(String(100))
    payment_terms = Column(String(100))
    reliability_score = Column(Numeric(5, 2), default=5.0)
    ai_performance_rating = Column(Numeric(5, 2))
    certification_types = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class AIInsight(Base):
    __tablename__ = "ai_insights"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    insight_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    confidence_score = Column(Numeric(5, 4))
    impact_level = Column(String(50))
    module_affected = Column(String(100))
    recommendations = Column(JSON, default=[])
    data_source = Column(JSON)
    status = Column(String(50), default="new")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)


class NavigationItem(Base):
    __tablename__ = "navigation_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    href = Column(String(255), nullable=False)
    icon = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    visible = Column(Boolean, default=True)
    """Order field to control display order in the UI"""
    order = Column(Integer, default=0)
    badge = Column(JSON, default={})
    metadata = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    tenant = relationship("Tenant")

# Pydantic Models
class TenantCreate(BaseModel):
    name: str
    domain: Optional[str] = None
    subdomain: str
    plan: str = "starter"
    max_users: int = 10

class UserCreate(BaseModel):
    tenant_id: str
    email: str
    username: str
    password: str
    first_name: str
    last_name: str
    role: str = "user"
    department: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str
    subdomain: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    tenant_info: Dict[str, Any]

class DashboardStats(BaseModel):
    total_revenue: float
    total_expenses: float
    total_customers: int
    total_orders: int
    active_users: int
    ai_insights_count: int
    inventory_value: float
    profit_margin: float

class AIRequest(BaseModel):
    prompt: str
    service_type: str = "openai"
    context: Optional[Dict[str, Any]] = None

class AIResponse(BaseModel):
    response: str
    confidence: float
    processing_time: float
    tokens_used: int


class NavigationItemCreate(BaseModel):
    name: str
    href: str
    icon: Optional[str] = None
    description: Optional[str] = None
    visible: Optional[bool] = True
    order: Optional[int] = 0
    badge: Optional[Dict[str, Any]] = {}
    metadata: Optional[Dict[str, Any]] = {}


class NavigationItemUpdate(BaseModel):
    name: Optional[str] = None
    href: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    visible: Optional[bool] = None
    order: Optional[int] = None
    badge: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None


class NavigationItemOut(BaseModel):
    id: str
    tenant_id: str
    name: str
    href: str
    icon: Optional[str] = None
    description: Optional[str] = None
    visible: bool
    order: int
    badge: Dict[str, Any]
    metadata: Dict[str, Any]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True

# FastAPI App
app = FastAPI(
    title="SaaS ERP Pro API",
    description="Multi-tenant Enterprise Resource Planning with AI Integration",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Security Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        tenant_id: str = payload.get("tenant_id")
        if username is None or tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        return {"username": username, "tenant_id": tenant_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

# AI Services Integration
class AIServiceManager:
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.claude_key = os.getenv("CLAUDE_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
    
    async def call_openai(self, prompt: str, context: Dict = None) -> Dict:
        if not self.openai_key:
            return {"error": "OpenAI API key not configured"}
        
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        
        system_prompt = """You are an AI assistant for an ERP system. 
        Provide insights and recommendations for business operations including:
        - Financial analysis and forecasting
        - Supply chain optimization
        - HR analytics and productivity
        - Sales and CRM insights
        - Inventory management
        
        Be specific, actionable, and data-driven in your responses."""
        
        data = {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {prompt}"}
            ],
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(OPENAI_API_URL, headers=headers, json=data, timeout=30.0)
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "response": result["choices"][0]["message"]["content"],
                        "service": "openai",
                        "model": "gpt-4"
                    }
                else:
                    return {"error": f"OpenAI API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"OpenAI API exception: {str(e)}"}
    
    async def call_claude(self, prompt: str, context: Dict = None) -> Dict:
        if not self.claude_key:
            return {"error": "Claude API key not configured"}
        
        headers = {
            "x-api-key": self.claude_key,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        system_prompt = """You are an AI assistant for enterprise resource planning. 
        Analyze business data and provide strategic recommendations for:
        - Financial optimization and risk management
        - Operational efficiency improvements
        - Market trend analysis
        - Resource allocation strategies
        - Performance enhancement opportunities"""
        
        data = {
            "model": "claude-3-sonnet-20240229",
            "max_tokens": 1000,
            "system": system_prompt,
            "messages": [
                {"role": "user", "content": f"Business Context: {context}\n\nRequest: {prompt}"}
            ]
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(CLAUDE_API_URL, headers=headers, json=data, timeout=30.0)
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "response": result["content"][0]["text"],
                        "service": "claude",
                        "model": "claude-3-sonnet"
                    }
                else:
                    return {"error": f"Claude API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Claude API exception: {str(e)}"}
    
    async def call_gemini(self, prompt: str, context: Dict = None) -> Dict:
        if not self.gemini_key:
            return {"error": "Gemini API key not configured"}
        
        headers = {
            "Content-Type": "application/json"
        }
        
        system_prompt = """You are an AI business analyst for ERP systems. 
        Provide data-driven insights and recommendations for:
        - Business process optimization
        - Financial planning and analysis
        - Supply chain management
        - Human resources analytics
        - Sales and marketing strategies"""
        
        data = {
            "contents": [{
                "parts": [{
                    "text": f"System: {system_prompt}\n\nContext: {context}\n\nUser: {prompt}"
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1000
            }
        }
        
        url = f"{GEMINI_API_URL}?key={self.gemini_key}"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=data, timeout=30.0)
                if response.status_code == 200:
                    result = response.json()
                    return {
                        "response": result["candidates"][0]["content"]["parts"][0]["text"],
                        "service": "gemini",
                        "model": "gemini-pro"
                    }
                else:
                    return {"error": f"Gemini API error: {response.status_code}"}
        except Exception as e:
            return {"error": f"Gemini API exception: {str(e)}"}

# Initialize AI Service Manager
ai_manager = AIServiceManager()

# API Routes

@app.get("/")
async def root():
    return {
        "message": "SaaS ERP Pro API",
        "version": "1.0.0",
        "features": [
            "Multi-tenant Architecture",
            "AI-Powered Analytics",
            "Global Resource Monitoring",
            "Real-time Insights",
            "Enterprise Security"
        ]
    }

@app.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if tenant exists
    tenant = db.query(Tenant).filter(Tenant.id == user_data.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        User.tenant_id == user_data.tenant_id,
        User.email == user_data.email
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        tenant_id=user_data.tenant_id,
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        department=user_data.department
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token({
        "sub": user.username,
        "tenant_id": str(user.tenant_id),
        "role": user.role
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "tenant_info": {
            "id": str(tenant.id),
            "name": tenant.name,
            "plan": tenant.plan
        }
    }

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Find tenant by subdomain
    tenant = None
    if user_data.subdomain:
        tenant = db.query(Tenant).filter(Tenant.subdomain == user_data.subdomain).first()
    
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    # Find user
    user = db.query(User).filter(
        User.tenant_id == tenant.id,
        User.email == user_data.email
    ).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = create_access_token({
        "sub": user.username,
        "tenant_id": str(user.tenant_id),
        "role": user.role
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "tenant_info": {
            "id": str(tenant.id),
            "name": tenant.name,
            "plan": tenant.plan
        }
    }

@app.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    # Calculate stats from database
    # This is simplified - in production, use proper aggregation queries
    
    return {
        "total_revenue": 2847560.00,
        "total_expenses": 1923450.00,
        "total_customers": 1247,
        "total_orders": 3847,
        "active_users": 89,
        "ai_insights_count": 12,
        "inventory_value": 1456780.00,
        "profit_margin": 32.4
    }

@app.get("/global-resources")
async def get_global_resources(db: Session = Depends(get_db)):
    resources = db.query(GlobalResource).all()
    return [
        {
            "id": str(resource.id),
            "resource_type": resource.resource_type,
            "resource_name": resource.resource_name,
            "region": resource.region,
            "country": resource.country,
            "current_price": float(resource.current_price),
            "currency": resource.currency,
            "unit_of_measure": resource.unit_of_measure,
            "availability_status": resource.availability_status,
            "market_trends": resource.market_trends,
            "last_updated": resource.last_updated.isoformat()
        }
        for resource in resources
    ]

@app.get("/ai/insights")
async def get_ai_insights(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    insights = db.query(AIInsight).filter(
        AIInsight.tenant_id == tenant_id,
        AIInsight.status.in_(["new", "reviewed"])
    ).order_by(AIInsight.created_at.desc()).limit(10).all()
    
    return [
        {
            "id": str(insight.id),
            "insight_type": insight.insight_type,
            "title": insight.title,
            "description": insight.description,
            "confidence_score": float(insight.confidence_score),
            "impact_level": insight.impact_level,
            "module_affected": insight.module_affected,
            "recommendations": insight.recommendations,
            "status": insight.status,
            "created_at": insight.created_at.isoformat()
        }
        for insight in insights
    ]

@app.post("/ai/analyze", response_model=AIResponse)
async def analyze_with_ai(
    request: AIRequest,
    current_user: dict = Depends(verify_token)
):
    start_time = asyncio.get_event_loop().time()
    
    # Choose AI service based on availability and preference
    if request.service_type == "openai":
        result = await ai_manager.call_openai(request.prompt, request.context)
    elif request.service_type == "claude":
        result = await ai_manager.call_claude(request.prompt, request.context)
    elif request.service_type == "gemini":
        result = await ai_manager.call_gemini(request.prompt, request.context)
    else:
        # Default to OpenAI
        result = await ai_manager.call_openai(request.prompt, request.context)
    
    processing_time = asyncio.get_event_loop().time() - start_time
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return {
        "response": result["response"],
        "confidence": 0.85,  # Mock confidence
        "processing_time": processing_time,
        "tokens_used": 150  # Mock token usage
    }

@app.post("/ai/generate-insight")
async def generate_ai_insight(
    module: str,
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    # Generate AI insight based on module
    prompt = f"Generate a strategic business insight for the {module} module. Include specific recommendations and impact assessment."
    
    context = {
        "tenant_id": tenant_id,
        "module": module,
        "user_role": current_user["role"]
    }
    
    ai_result = await ai_manager.call_openai(prompt, context)
    
    if "error" in ai_result:
        raise HTTPException(status_code=500, detail=ai_result["error"])
    
    # Save insight to database
    insight = AIInsight(
        tenant_id=tenant_id,
        insight_type="ai_generated",
        title=f"AI-Generated {module.title()} Insight",
        description=ai_result["response"],
        confidence_score=0.85,
        impact_level="medium",
        module_affected=module,
        recommendations=["Review AI recommendations", "Implement suggested changes", "Monitor impact"],
        status="new"
    )
    
    db.add(insight)
    db.commit()
    
    return {"message": "AI insight generated successfully", "insight_id": str(insight.id)}

# Financial Module Endpoints
@app.get("/financial/accounts")
async def get_chart_of_accounts(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    accounts = db.query(ChartOfAccounts).filter(
        ChartOfAccounts.tenant_id == tenant_id,
        ChartOfAccounts.is_active == True
    ).all()
    
    return [
        {
            "id": str(account.id),
            "account_code": account.account_code,
            "account_name": account.account_name,
            "account_type": account.account_type,
            "balance": float(account.balance)
        }
        for account in accounts
    ]

@app.get("/financial/transactions")
async def get_transactions(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    tenant_id = current_user["tenant_id"]
    
    transactions = db.query(Transaction).filter(
        Transaction.tenant_id == tenant_id
    ).offset(skip).limit(limit).all()
    
    return [
        {
            "id": str(transaction.id),
            "transaction_number": transaction.transaction_number,
            "date": transaction.date.isoformat(),
            "description": transaction.description,
            "debit_amount": float(transaction.debit_amount),
            "credit_amount": float(transaction.credit_amount),
            "balance_after": float(transaction.balance_after),
            "category": transaction.category,
            "ai_categorization": transaction.ai_categorization
        }
        for transaction in transactions
    ]

# HR Module Endpoints
@app.get("/hr/employees")
async def get_employees(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    employees = db.query(Employee).filter(
        Employee.tenant_id == tenant_id
    ).all()
    
    return [
        {
            "id": str(employee.id),
            "employee_number": employee.employee_number,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "email": employee.email,
            "department": employee.department,
            "position": employee.position,
            "salary": float(employee.salary) if employee.salary else None,
            "ai_productivity_score": float(employee.ai_productivity_score) if employee.ai_productivity_score else None
        }
        for employee in employees
    ]

# Sales & CRM Endpoints
@app.get("/sales/customers")
async def get_customers(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    customers = db.query(Customer).filter(
        Customer.tenant_id == tenant_id
    ).all()
    
    return [
        {
            "id": str(customer.id),
            "customer_code": customer.customer_code,
            "company_name": customer.company_name,
            "industry": customer.industry,
            "email": customer.email,
            "total_revenue": float(customer.total_revenue),
            "ai_risk_score": float(customer.ai_risk_score) if customer.ai_risk_score else None,
            "ai_churn_probability": float(customer.ai_churn_probability) if customer.ai_churn_probability else None
        }
        for customer in customers
    ]

@app.get("/sales/opportunities")
async def get_sales_opportunities(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    opportunities = db.query(SalesOpportunity).filter(
        SalesOpportunity.tenant_id == tenant_id
    ).all()
    
    return [
        {
            "id": str(opportunity.id),
            "opportunity_name": opportunity.opportunity_name,
            "stage": opportunity.stage,
            "probability": float(opportunity.probability),
            "expected_value": float(opportunity.expected_value) if opportunity.expected_value else None,
            "ai_win_probability": float(opportunity.ai_win_probability) if opportunity.ai_win_probability else None
        }
        for opportunity in opportunities
    ]

# Supply Chain Endpoints
@app.get("/supplychain/products")
async def get_products(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    products = db.query(Product).filter(
        Product.tenant_id == tenant_id
    ).all()
    
    return [
        {
            "id": str(product.id),
            "product_code": product.product_code,
            "product_name": product.product_name,
            "category": product.category,
            "current_stock": float(product.current_stock),
            "selling_price": float(product.selling_price) if product.selling_price else None,
            "ai_demand_forecast": product.ai_demand_forecast,
            "ai_optimal_reorder_point": float(product.ai_optimal_reorder_point) if product.ai_optimal_reorder_point else None
        }
        for product in products
    ]

@app.get("/supplychain/suppliers")
async def get_suppliers(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    tenant_id = current_user["tenant_id"]
    
    suppliers = db.query(Supplier).filter(
        Supplier.tenant_id == tenant_id
    ).all()
    
    return [
        {
            "id": str(supplier.id),
            "supplier_code": supplier.supplier_code,
            "company_name": supplier.company_name,
            "country": supplier.country,
            "reliability_score": float(supplier.reliability_score),
            "ai_performance_rating": float(supplier.ai_performance_rating) if supplier.ai_performance_rating else None
        }
        for supplier in suppliers
    ]

# Health Check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "ai_services": {
            "openai": bool(ai_manager.openai_key),
            "claude": bool(ai_manager.claude_key),
            "gemini": bool(ai_manager.gemini_key)
        }
    }

# Create tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)