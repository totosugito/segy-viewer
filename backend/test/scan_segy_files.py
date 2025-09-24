#!/usr/bin/env python3
"""
SEGY File Scanner

This script scans SEGY files in the file_data/segy directory and extracts
metadata to populate the segy-list.json file.

Requires: segyio library (pip install segyio)
"""

from math import ceil, floor
import os
import json
import segyio
from pathlib import Path
from typing import List, Dict, Any


def get_file_size_mb(file_path: str) -> float:
    """Get file size in MB."""
    return floor(os.path.getsize(file_path) / (1))


def scan_segy_file(file_path: str) -> Dict[str, Any]:
    """Scan a single SEGY file and extract metadata."""
    try:
        with segyio.open(file_path, 'r', strict=False) as segy:
            # Extract basic information
            name = os.path.basename(file_path)
            ntrc = len(segy.trace)  # Number of traces
            nsp = len(segy.samples)  # Number of samples per trace
            dt = segy.bin[segyio.BinField.Interval] / 1000  # Sample interval in ms
            size = round(get_file_size_mb(file_path), 0)  # File size in MB
            
            # Additional useful metadata
            # inline_range = (int(segy.ilines[0]), int(segy.ilines[-1])) if len(segy.ilines) > 0 else (0, 0)
            # xline_range = (int(segy.xlines[0]), int(segy.xlines[-1])) if len(segy.xlines) > 0 else (0, 0)
            
            return {
                "name": name,
                "ntrc": ntrc,
                "nsp": nsp,
                "dt": dt,
                "header": "cdp",  # Keeping as requested
                "size": get_file_size_mb(file_path),
                # "inline_range": inline_range,
                # "xline_range": xline_range,
                "format": str(segy.format),
                "dtMultiplier": ceil(nsp/1501)
                # "sorting": segy.sorting
            }
    except Exception as e:
        print(f"Error scanning {file_path}: {str(e)}")
        # Return a default structure with error info
        return {
            "name": os.path.basename(file_path),
            "ntrc": 0,
            "nsp": 0,
            "dt": 0,
            "header": "cdp",
            "size": round(get_file_size_mb(file_path), 1),
            "error": str(e)
        }


def scan_segy_directory(segy_dir: str) -> List[Dict[str, Any]]:
    """Scan all SEGY files in the specified directory."""
    segy_files = []
    
    if not os.path.exists(segy_dir):
        print(f"Directory {segy_dir} does not exist.")
        return segy_files
    
    # Look for common SEGY file extensions
    segy_extensions = ['.sgy', '.segy', '.SGY', '.SEGY']
    
    for file in os.listdir(segy_dir):
        file_path = os.path.join(segy_dir, file)
        if os.path.isfile(file_path) and any(file.endswith(ext) for ext in segy_extensions):
            print(f"Scanning: {file}")
            segy_data = scan_segy_file(file_path)
            segy_files.append(segy_data)
    
    return segy_files


def update_segy_list_json(segy_data: List[Dict[str, Any]], json_file: str):
    """Update the segy-list.json file with scanned data."""
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(segy_data, f, indent=4)
        print(f"Successfully updated {json_file}")
    except Exception as e:
        print(f"Error writing to {json_file}: {str(e)}")


def main():
    """Main function to scan SEGY files and update JSON."""
    # Get the script directory and construct paths
    script_dir = Path(__file__).parent
    segy_dir = script_dir.parent / "file_data" / "segy"
    json_file = script_dir.parent / "file_data" / "segy-list.json"
    
    print(f"Scanning SEGY files in: {segy_dir}")
    print(f"Output JSON file: {json_file}")
    
    # Scan SEGY files
    segy_data = scan_segy_directory(str(segy_dir))
    
    if segy_data:
        print(f"\nFound {len(segy_data)} SEGY files:")
        for segy in segy_data:
            print(f"  - {segy['name']}: {segy['ntrc']} traces, {segy['nsp']} samples, {segy['size']} MB")
        
        # Update JSON file
        update_segy_list_json(segy_data, str(json_file))
    else:
        print("No SEGY files found or all files failed to scan.")


if __name__ == "__main__":
    main()