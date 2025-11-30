import google.generativeai as genai
import os
from typing import Dict
import json
import logging
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

api_key = os.environ.get('GEMINI_API_KEY')
if api_key:
    genai.configure(api_key=api_key)
else:
    logger.warning("GEMINI_API_KEY not found in environment")

def generate_job_posting_script(
    product_name: str,
    target_audience: str,
    tone: str
) -> Dict:
    
    prompt = f"""Create a 30-second video script for marketing "{product_name}" to {target_audience}.

Tone: {tone}
Product: {product_name}
Target Audience: {target_audience}

Structure:
- Hook (grab attention in 2-3 seconds)
- Body (deliver message in 15-20 seconds)
- CTA (call to action in 5-7 seconds)

Return JSON with: script, visual_hook, hook, body, cta, estimated_duration"""

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        try:
            raw_data = json.loads(response_text.strip())
            
            script_data = {
                "script": "",
                "visual_hook": "",
                "hook": "",
                "body": "",
                "cta": "",
                "estimated_duration": 30
            }
            
            if isinstance(raw_data.get('script'), str):
                script_data['script'] = raw_data['script']
            elif isinstance(raw_data.get('script'), list):
                script_data['script'] = ' '.join([
                    item.get('text', str(item)) if isinstance(item, dict) else str(item) 
                    for item in raw_data['script']
                ])
            
            script_data['visual_hook'] = str(raw_data.get('visual_hook', 'Product showcase'))
            script_data['hook'] = str(raw_data.get('hook', 'Check this out!'))
            script_data['body'] = str(raw_data.get('body', ''))
            script_data['cta'] = str(raw_data.get('cta', 'Get it now!'))
            
            duration = raw_data.get('estimated_duration', 30)
            if isinstance(duration, str):
                duration = int(''.join(filter(str.isdigit, duration)) or 30)
            script_data['estimated_duration'] = int(duration)
            
        except json.JSONDecodeError:
            script_data = {
                "script": response_text,
                "visual_hook": "Product showcase with bright lighting",
                "hook": "Check this out!",
                "body": response_text,
                "cta": "Get it now!",
                "estimated_duration": 30
            }
        
        return script_data
        
    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        raise

def generate_job_description(
    job_title: str,
    company: str,
    target_profile: str,
    tone: str = "Professional"
) -> Dict:
    
    prompt = f"""Create a job posting for:

Job Title: {job_title}
Company: {company}
Ideal Candidate: {target_profile}
Tone: {tone}

Return JSON with: job_title, company, job_description, key_responsibilities (list), required_skills (list), nice_to_have (list), why_join_us, salary_range, location, job_type"""

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        try:
            raw_data = json.loads(response_text.strip())
            
            job_data = {
                "job_title": str(raw_data.get('job_title', job_title)),
                "company": str(raw_data.get('company', company)),
                "job_description": str(raw_data.get('job_description', '')),
                "key_responsibilities": raw_data.get('key_responsibilities', []) if isinstance(raw_data.get('key_responsibilities'), list) else [],
                "required_skills": raw_data.get('required_skills', []) if isinstance(raw_data.get('required_skills'), list) else [],
                "nice_to_have": raw_data.get('nice_to_have', []) if isinstance(raw_data.get('nice_to_have'), list) else [],
                "why_join_us": str(raw_data.get('why_join_us', '')),
                "salary_range": str(raw_data.get('salary_range', 'Competitive')),
                "location": str(raw_data.get('location', 'Remote')),
                "job_type": str(raw_data.get('job_type', 'Full-time'))
            }
            
        except json.JSONDecodeError:
            job_data = {
                "job_title": job_title,
                "company": company,
                "job_description": response_text,
                "key_responsibilities": [],
                "required_skills": [],
                "nice_to_have": [],
                "why_join_us": "",
                "salary_range": "Competitive",
                "location": "Remote",
                "job_type": "Full-time"
            }
        
        return job_data
        
    except Exception as e:
        logger.error(f"Error generating job description: {str(e)}")
        raise
