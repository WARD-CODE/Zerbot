import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Check if required environment variables are set
if not os.getenv("GEMINI_API_KEY"):
    print("ERROR: GEMINI_API_KEY environment variable is not set!")
    print("Please create a .env file with your Gemini API key.")
    sys.exit(1)

# Import and run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    from main import app
    
    print("Starting Zerbot AI Backend...")
    print("API Documentation available at: http://localhost:8000/docs")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )