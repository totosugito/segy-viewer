#!/usr/bin/env python3
"""
LAS File Scanner

This script scans LAS files in the file_data/las directory and extracts
metadata to populate the las-list.json file.

Requires: lasio library (pip install lasio)
"""

from math import floor
import os
import json
from pathlib import Path
from typing import List, Dict, Any

# Try to import lasio
try:
    import lasio
    LASIO_AVAILABLE = True
except ImportError:
    print("Warning: lasio library not found. Install with: pip install lasio")
    print("Falling back to basic file information only.")
    LASIO_AVAILABLE = False


def get_file_size_mb(file_path: str) -> float:
    """Get file size in MB."""
    return floor(os.path.getsize(file_path))


def scan_las_file(file_path: str) -> Dict[str, Any]:
    """Scan a single LAS file and extract metadata."""
    name = os.path.basename(file_path)
    size = round(get_file_size_mb(file_path), 0)  # File size in MB
    
    if not LASIO_AVAILABLE:
        return {
            "name": name,
            "size": size,
            "error": "lasio library not available"
        }
    
    try:
        # Read LAS file
        las = lasio.read(file_path)

        # for curve in las.curves:
            # print(curve.mnemonic + ": " + str(curve.data))

        # Extract basic information
        num_curves = len(las.curves)
        num_data_points = len(las.data) if las.data is not None else 0
        
        # Get depth/time range
        # depth_start = las.well.START.value if las.well.START else None
        # depth_stop = las.well.STOP.value if las.well.STOP else None
        # depth_step = las.well.STEP.value if las.well.STEP else None
        
        # Get well information
        well_name = las.well.WELL.value if las.well.WELL else "Unknown"
        api_number = las.well.API.value if hasattr(las.well, 'API') and las.well.API else None
        
        # Get curve names
        curve_names = [curve.mnemonic for curve in las.curves]
        
        return {
            "name": name,
            "size": size,
            "well_name": well_name,
            "api_number": api_number,
            "num_curves": num_curves,
            "num_data_points": num_data_points,
            # "depth_start": depth_start,
            # "depth_stop": depth_stop,
            # "depth_step": depth_step,
            "curve_names": curve_names,
            "version": las.version.VERS.value if las.version.VERS else None,
            "wrap": las.version.WRAP.value if las.version.WRAP else None
        }
    except Exception as e:
        print(f"Error scanning {file_path}: {str(e)}")
        # Return a default structure with error info
        return {
            "name": name,
            "size": size,
            "error": str(e)
        }


def scan_las_directory(las_dir: str) -> List[Dict[str, Any]]:
    """Scan all LAS files in the specified directory."""
    las_files = []
    
    if not os.path.exists(las_dir):
        print(f"Directory {las_dir} does not exist.")
        return las_files
    
    # Look for common LAS file extensions
    las_extensions = ['.las', '.LAS']
    
    for file in os.listdir(las_dir):
        file_path = os.path.join(las_dir, file)
        if os.path.isfile(file_path) and any(file.endswith(ext) for ext in las_extensions):
            print(f"Scanning: {file}")
            las_data = scan_las_file(file_path)
            las_files.append(las_data)
    
    return las_files


def update_las_list_json(las_data: List[Dict[str, Any]], json_file: str):
    """Update the las-list.json file with scanned data."""
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(las_data, f, indent=4)
        print(f"Successfully updated {json_file}")
    except Exception as e:
        print(f"Error writing to {json_file}: {str(e)}")


def main():
    """Main function to scan LAS files and update JSON."""
    # Get the script directory and construct paths
    script_dir = Path(__file__).parent
    las_dir = script_dir.parent / "file_data" / "las"
    json_file = script_dir.parent / "file_data" / "las-list.json"
    
    print(f"Scanning LAS files in: {las_dir}")
    print(f"Output JSON file: {json_file}")
    
    # Scan LAS files
    las_data = scan_las_directory(str(las_dir))
    
    if las_data:
        print(f"\nFound {len(las_data)} LAS files:")
        for las in las_data:
            curves = las.get('num_curves', 0)
            points = las.get('num_data_points', 0)
            print(f"  - {las['name']}: {curves} curves, {points} data points, {las['size']} MB")
        
        # Update JSON file
        update_las_list_json(las_data, str(json_file))
    else:
        print("No LAS files found or all files failed to scan.")


if __name__ == "__main__":
    main()