from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from llm_service import generate_job_posting_script, generate_job_description


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(
    mongo_url,
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000
)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ScriptGenerationRequest(BaseModel):
    product_name: str
    target_audience: str
    tone: str

class ScriptGenerationResponse(BaseModel):
    script: str
    visual_hook: str
    hook: Optional[str] = None
    body: Optional[str] = None
    cta: Optional[str] = None
    estimated_duration: Optional[int] = 30

class JobPostingRequest(BaseModel):
    job_title: str
    company: str
    target_profile: str
    tone: Optional[str] = "Professional"
    product_name: Optional[str] = None
    target_audience: Optional[str] = None
    script_tone: Optional[str] = None

class JobPosting(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_title: str
    company: str
    job_description: str
    key_responsibilities: List[str] = []
    required_skills: List[str] = []
    nice_to_have: List[str] = []
    why_join_us: str = ""
    salary_range: str = ""
    location: str = ""
    job_type: str = ""
    script: Optional[str] = None
    visual_hook: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: str = "admin"

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/generate-script", response_model=ScriptGenerationResponse)
async def generate_script(request: ScriptGenerationRequest):
    try:
        script_data = generate_job_posting_script(
            product_name=request.product_name,
            target_audience=request.target_audience,
            tone=request.tone
        )
        return ScriptGenerationResponse(**script_data)
    except Exception as e:
        logger.error(f"Error in script generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate script: {str(e)}")

@api_router.post("/generate-job", response_model=JobPosting)
async def generate_job_posting(request: JobPostingRequest):
    try:
        job_description_data = generate_job_description(
            job_title=request.job_title,
            company=request.company,
            target_profile=request.target_profile,
            tone=request.tone
        )
        
        script_data = None
        if request.product_name and request.target_audience and request.script_tone:
            script_data = generate_job_posting_script(
                product_name=request.product_name,
                target_audience=request.target_audience,
                tone=request.script_tone
            )
        
        job_posting = JobPosting(
            job_title=job_description_data.get("job_title", request.job_title),
            company=job_description_data.get("company", request.company),
            job_description=job_description_data.get("job_description", ""),
            key_responsibilities=job_description_data.get("key_responsibilities", []),
            required_skills=job_description_data.get("required_skills", []),
            nice_to_have=job_description_data.get("nice_to_have", []),
            why_join_us=job_description_data.get("why_join_us", ""),
            salary_range=job_description_data.get("salary_range", ""),
            location=job_description_data.get("location", ""),
            job_type=job_description_data.get("job_type", ""),
            script=script_data.get("script") if script_data else None,
            visual_hook=script_data.get("visual_hook") if script_data else None,
        )
        
        doc = job_posting.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        result = await db.job_postings.insert_one(doc)
        
        logger.info(f"Job posting created: {result.inserted_id}")
        return job_posting
        
    except Exception as e:
        logger.error(f"Error generating job posting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate job posting: {str(e)}")

@api_router.get("/jobs", response_model=List[JobPosting])
async def get_job_postings():
    jobs = await db.job_postings.find({}, {"_id": 0}).to_list(1000)
    
    for job in jobs:
        if isinstance(job.get('created_at'), str):
            job['created_at'] = datetime.fromisoformat(job['created_at'])
    
    return jobs

@api_router.get("/jobs/{job_id}", response_model=JobPosting)
async def get_job_posting(job_id: str):
    job = await db.job_postings.find_one({"id": job_id}, {"_id": 0})
    
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    if isinstance(job.get('created_at'), str):
        job['created_at'] = datetime.fromisoformat(job['created_at'])
    
    return job

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()