from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import tempfile
import subprocess
import shutil
from pathlib import Path
import uuid
from typing import Optional, Dict, Any
import logging

from ai_service import AIService
from code_generator import CodeGenerator
from exe_builder import ExecutableBuilder

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Zerbot AI Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_service = AIService()
code_generator = CodeGenerator()
exe_builder = ExecutableBuilder()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class CodeGenerationRequest(BaseModel):
    description: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    is_code_generation: bool = False

class CodeGenerationResponse(BaseModel):
    response: str
    session_id: str
    download_url: Optional[str] = None
    file_id: Optional[str] = None

# In-memory storage for sessions and files
sessions: Dict[str, Dict[str, Any]] = {}
generated_files: Dict[str, str] = {}

@app.get("/")
async def root():
    return {"message": "Zerbot AI Backend is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # Initialize session if not exists
        if session_id not in sessions:
            sessions[session_id] = {"history": []}
        
        # Check if user is asking for executable generation
        is_exe_request = any(keyword in request.message.lower() for keyword in 
                           ["make executable", "create exe", "generate executable", 
                            "build exe", "compile to exe", "create program"])
        
        if is_exe_request:
            # Redirect to code generation endpoint
            return await generate_executable(CodeGenerationRequest(
                description=request.message,
                session_id=session_id
            ))
        
        # Regular chat response
        response = await ai_service.generate_response(
            message=request.message,
            session_history=sessions[session_id]["history"]
        )
        
        # Update session history
        sessions[session_id]["history"].append({
            "user": request.message,
            "assistant": response
        })
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            is_code_generation=False
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-executable", response_model=CodeGenerationResponse)
async def generate_executable(request: CodeGenerationRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # Initialize session if not exists
        if session_id not in sessions:
            sessions[session_id] = {"history": []}
        
        # Generate Python code based on description
        python_code = await code_generator.generate_code(request.description)
        
        # Create executable
        file_id = str(uuid.uuid4())
        exe_path = await exe_builder.create_executable(python_code, file_id)
        
        # Store file path for download
        generated_files[file_id] = exe_path
        
        response_text = f"I've generated an executable program based on your request: '{request.description}'. The program will open in a command prompt window and display the output. Click the download link to get your executable file."
        
        # Update session history
        sessions[session_id]["history"].append({
            "user": request.description,
            "assistant": response_text
        })
        
        return CodeGenerationResponse(
            response=response_text,
            session_id=session_id,
            download_url=f"/download/{file_id}",
            file_id=file_id
        )
        
    except Exception as e:
        logger.error(f"Error in generate_executable endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{file_id}")
async def download_file(file_id: str, background_tasks: BackgroundTasks):
    if file_id not in generated_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = generated_files[file_id]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    # Schedule file cleanup after download
    background_tasks.add_task(cleanup_file, file_id, file_path)
    
    return FileResponse(
        path=file_path,
        filename=f"zerbot_program_{file_id}.exe",
        media_type="application/octet-stream"
    )

def cleanup_file(file_id: str, file_path: str):
    """Clean up temporary files after download"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
        if file_id in generated_files:
            del generated_files[file_id]
        logger.info(f"Cleaned up file: {file_path}")
    except Exception as e:
        logger.error(f"Error cleaning up file {file_path}: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": {
        "ai_service": "running",
        "code_generator": "running",
        "exe_builder": "running"
    }}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)