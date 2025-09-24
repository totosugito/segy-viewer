import json
import os
import numpy as np
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path

# Try to import segyio
try:
    import segyio
    SEGYIO_AVAILABLE = True
except ImportError:
    SEGYIO_AVAILABLE = False

router = APIRouter()

# Get the directory of this file to construct the path to segy-list.json
BASE_DIR = Path(__file__).parent.parent.parent
SEGY_LIST_FILE = BASE_DIR / "file_data" / "segy-list.json"
SEGY_DATA_DIR = BASE_DIR / "file_data" / "segy"

# Pydantic models
class SegyFileRequest(BaseModel):
    filename: str
    maxNtrc: Optional[int] = None  # Optional: limit number of traces
    dtMultiplier: int = 1  # Optional: sampling multiplier (default 1 = no spacing)
    header: Optional[str] = None  # Optional: header field to extract (e.g., "cdp", "inline", "xline")

class SegyResponse(BaseModel):
    info: Dict[str, Any]
    data: List[List[Optional[float]]]  # Allow None values in trace data
    headers: Optional[List[Optional[Any]]] = None  # Optional: header values if requested, allowing None values

@router.get("/list", response_model=List[Dict[str, Any]])
async def get_segy_list():
    """
    Get the list of SEGY files from segy-list.json
    """
    try:
        if not SEGY_LIST_FILE.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"SEGY list file not found at {SEGY_LIST_FILE}"
            )
        
        with open(SEGY_LIST_FILE, 'r', encoding='utf-8') as file:
            segy_data = json.load(file)
        
        return segy_data
    
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error parsing SEGY list file: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error reading SEGY list: {str(e)}"
        )

@router.get("/list/{file_name}")
async def get_segy_file_info(file_name: str):
    """
    Get information about a specific SEGY file
    """
    try:
        segy_list = await get_segy_list()
        
        for segy_file in segy_list:
            if segy_file.get("name") == file_name:
                return segy_file
        
        raise HTTPException(
            status_code=404, 
            detail=f"SEGY file '{file_name}' not found"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error retrieving SEGY file info: {str(e)}"
        )

@router.get("/count")
async def get_segy_count():
    """
    Get the total count of SEGY files
    """
    try:
        segy_list = await get_segy_list()
        return {"count": len(segy_list)}
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error counting SEGY files: {str(e)}"
        )

@router.post("/read", response_model=SegyResponse)
async def read_segy_file(request: SegyFileRequest):
    """
    Read a SEGY file and return its info and data
    """
    if not SEGYIO_AVAILABLE:
        raise HTTPException(
            status_code=500,
            detail="segyio library not available. Please install it to read SEGY files."
        )
    
    try:
        # Construct the file path
        file_path = SEGY_DATA_DIR / request.filename
        
        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"SEGY file '{request.filename}' not found in {SEGY_DATA_DIR}"
            )
        
        # Get file info from the list
        segy_list = await get_segy_list()
        file_info = None
        for segy_file in segy_list:
            if segy_file.get("name") == request.filename:
                file_info = segy_file
                break
        
        if not file_info:
            raise HTTPException(
                status_code=404,
                detail=f"SEGY file '{request.filename}' not found in the file list"
            )
        
        # Read SEGY file using segyio
        with segyio.open(str(file_path), 'r', strict=False) as segy:
            # Determine number of traces to read
            total_traces = len(segy.trace)
            max_traces = request.maxNtrc if request.maxNtrc is not None else total_traces
            num_traces_to_read = min(max_traces, total_traces)
            
            # Read trace data into a 2D array with sampling
            # Shape: (num_traces, num_samples)
            data = []
            headers = []  # To store header values if requested
            
            # Read each trace up to the limit
            for trace_num in range(num_traces_to_read):
                trace_data = segy.trace[trace_num]
                
                # Extract header information if requested, or use default sequential numbering
                if request.header:
                    try:
                        # Get trace header
                        trace_header = segy.header[trace_num]
                        
                        # Map common header names to segyio fields
                        header_field_map = {
                            "ffid": segyio.TraceField.FieldRecord,
                            "sp": segyio.TraceField.EnergySourcePoint,
                            "cdp": segyio.TraceField.CDP,
                            "inline": segyio.TraceField.INLINE_3D,
                            "xline": segyio.TraceField.CROSSLINE_3D,
                            "offset": segyio.TraceField.offset,
                            "elevation": segyio.TraceField.ReceiverGroupElevation,
                            "traceno": segyio.TraceField.TRACE_SEQUENCE_LINE
                        }
                        
                        header_field = header_field_map.get(request.header.lower())
                        if header_field:
                            header_value = trace_header[header_field]
                            headers.append(header_value)
                        else:
                            headers.append(None)
                    except Exception as e:
                        headers.append(None)
                else:
                    # When no header parameter is given, use sequential numbering [1, 2, 3, ...]
                    headers.append(trace_num + 1)
            
            # Read each trace up to the limit
            for trace_num in range(num_traces_to_read):
                trace_data = segy.trace[trace_num]
                
                # Apply dtMultiplier sampling (every nth sample)
                if request.dtMultiplier > 1:
                    sampled_data = trace_data[::request.dtMultiplier]
                else:
                    sampled_data = trace_data
                
                # Format each value to 5 significant digits
                formatted_trace = []
                for value in sampled_data:
                    if np.isnan(value) or value is None:
                        formatted_trace.append(None)
                    elif value == 0:
                        formatted_trace.append(0.0)
                    else:
                        # Format to 5 significant digits
                        formatted_value = float(f"{value:.4g}")
                        formatted_trace.append(formatted_value)
                        
                # Only include trace if it has at least one non-null value
                if any(val is not None for val in formatted_trace):
                    data.append(formatted_trace)
            
            # Prepare response
            response = {
                "info": file_info,
                "data": data
            }
            
            # Add headers (either requested header field or default sequential numbering)
            if headers:
                response["headers"] = headers
            
            return response
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading SEGY file: {str(e)}"
        )