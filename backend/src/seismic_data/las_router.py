import json
import os
import numpy as np
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path

# Try to import lasio
try:
    import lasio
    LASIO_AVAILABLE = True
except ImportError:
    LASIO_AVAILABLE = False

router = APIRouter()

# Get the directory of this file to construct the path to las-list.json
BASE_DIR = Path(__file__).parent.parent.parent
LAS_LIST_FILE = BASE_DIR / "file_data" / "las-list.json"
LAS_DATA_DIR = BASE_DIR / "file_data" / "las"

# Pydantic models
class LasFileRequest(BaseModel):
    filename: str
    maxDepth: Optional[int] = None  # Optional: limit number of depth points
    dtMultiplier: int = 1  # Optional: sampling multiplier (default 1 = no spacing)
    curves: Optional[List[str]] = None  # Optional: specific curves to extract

class LasResponse(BaseModel):
    info: Dict[str, Any]
    data: Dict[str, List[float]]  # Dictionary with curve names as keys
    headers: Optional[List[Any]] = None  # Optional: depth/time values

@router.get("/list", response_model=List[Dict[str, Any]])
async def get_las_list():
    """
    Get the list of LAS files from las-list.json
    """
    try:
        if not LAS_LIST_FILE.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"LAS list file not found at {LAS_LIST_FILE}"
            )
        
        with open(LAS_LIST_FILE, 'r', encoding='utf-8') as file:
            las_data = json.load(file)
        
        return las_data
    
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error parsing LAS list file: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error reading LAS list: {str(e)}"
        )

@router.get("/list/{file_name}")
async def get_las_file_info(file_name: str):
    """
    Get information about a specific LAS file
    """
    try:
        las_list = await get_las_list()
        
        for las_file in las_list:
            if las_file.get("name") == file_name:
                return las_file
        
        raise HTTPException(
            status_code=404, 
            detail=f"LAS file '{file_name}' not found"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error retrieving LAS file info: {str(e)}"
        )

@router.get("/count")
async def get_las_count():
    """
    Get the total count of LAS files
    """
    try:
        las_list = await get_las_list()
        return {"count": len(las_list)}
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error counting LAS files: {str(e)}"
        )

@router.post("/read", response_model=LasResponse)
async def read_las_file(request: LasFileRequest):
    """
    Read a LAS file and return its info and data
    """
    if not LASIO_AVAILABLE:
        raise HTTPException(
            status_code=500,
            detail="lasio library not available. Please install it to read LAS files."
        )
    
    try:
        # Construct the file path
        file_path = LAS_DATA_DIR / request.filename
        
        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"LAS file '{request.filename}' not found in {LAS_DATA_DIR}"
            )
        
        # Get file info from the list
        las_list = await get_las_list()
        file_info = None
        for las_file in las_list:
            if las_file.get("name") == request.filename:
                file_info = las_file
                break
        
        if not file_info:
            raise HTTPException(
                status_code=404,
                detail=f"LAS file '{request.filename}' not found in the file list"
            )
        
        # Read LAS file using lasio
        las = lasio.read(str(file_path))
        
        # Get the index curve (usually DEPT or TIME)
        index_curve = las.index
        total_points = len(index_curve)
        
        # Determine number of data points to read
        max_points = request.maxDepth if request.maxDepth is not None else total_points
        num_points_to_read = min(max_points, total_points)
        
        # Apply sampling if dtMultiplier > 1
        if request.dtMultiplier > 1:
            indices = range(0, num_points_to_read, request.dtMultiplier)
            sampled_index = index_curve[indices]
        else:
            indices = range(num_points_to_read)
            sampled_index = index_curve[:num_points_to_read]
        
        # Prepare data dictionary
        data = {}
        
        # Determine which curves to extract using las.curves method
        if request.curves:
            # Use specified curves - filter available curves
            available_curve_names = [curve.mnemonic for curve in las.curves]
            curves_to_extract = [curve_name for curve_name in request.curves if curve_name in available_curve_names]
        else:
            # Use all available curves
            curves_to_extract = [curve.mnemonic for curve in las.curves]
        
        # Extract curve data using las.curves iteration method
        for curve in las.curves:
            curve_name = curve.mnemonic
            
            # Only extract if this curve is in our list to extract
            if curve_name in curves_to_extract:
                curve_data = curve.data
                
                # Apply sampling if dtMultiplier > 1
                if request.dtMultiplier > 1:
                    sampled_data = curve_data[indices]
                else:
                    sampled_data = curve_data[:num_points_to_read]
                
                # Format values to 5 significant digits
                formatted_data = []
                for value in sampled_data:
                    if np.isnan(value) or value is None:
                        formatted_data.append(None)
                    elif value == 0:
                        formatted_data.append(0.0)
                    else:
                        # Format to 5 significant digits
                        formatted_value = float(f"{value:.4g}")
                        formatted_data.append(formatted_value)
                
                data[curve_name] = formatted_data
        
        # Format index values (depth/time) for headers
        headers = []
        for value in sampled_index:
            if np.isnan(value) or value is None:
                headers.append(None)
            elif value == 0:
                headers.append(0.0)
            else:
                formatted_value = float(f"{value:.4g}")
                headers.append(formatted_value)
        
        # Prepare response
        response = {
            "info": file_info,
            "data": data,
            "headers": headers  # Index values (depth/time)
        }
        
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading LAS file: {str(e)}"
        )