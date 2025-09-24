import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

# Import routers
from src.seismic_data.las_router import router as las_router
from src.seismic_data.segy_router import router as segy_router

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Seismic Data API",
    description="API for managing LAS and SEGY seismic data files",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(las_router, prefix="/api/seismic-data/las", tags=["LAS Files"])
app.include_router(segy_router, prefix="/api/seismic-data/segy", tags=["SEGY Files"])

@app.get("/")
async def root():
    return {"message": "Seismic Data API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    host = os.getenv("HOST_SEISMIC_DATA", "127.0.0.1")
    port = int(os.getenv("PORT_SEISMIC_DATA", 8051))
    
    uvicorn.run(
        "app-seismic-data:app",
        host=host,
        port=port,
        reload=True
    )