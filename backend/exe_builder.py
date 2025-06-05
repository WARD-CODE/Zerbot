import os
import tempfile
import subprocess
import shutil
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class ExecutableBuilder:
    def __init__(self):
        self.temp_dir = tempfile.mkdtemp(prefix="zerbot_")
        
    async def create_executable(self, python_code: str, file_id: str) -> str:
        """
        Convert Python code to an executable file using PyInstaller
        """
        try:
            # Create a temporary Python file
            python_file_path = os.path.join(self.temp_dir, f"program_{file_id}.py")
            
            with open(python_file_path, 'w', encoding='utf-8') as f:
                f.write(python_code)
            
            # Output directory for the executable
            output_dir = os.path.join(self.temp_dir, f"dist_{file_id}")
            os.makedirs(output_dir, exist_ok=True)
            
            # PyInstaller command
            cmd = [
                'pyinstaller',
                '--onefile',  # Create a single executable file
                '--noconsole',  # Don't show console window initially
                '--distpath', output_dir,
                '--workpath', os.path.join(self.temp_dir, f"build_{file_id}"),
                '--specpath', self.temp_dir,
                '--name', f'zerbot_program_{file_id}',
                python_file_path
            ]
            
            # Run PyInstaller
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True,
                cwd=self.temp_dir
            )
            
            if result.returncode != 0:
                logger.error(f"PyInstaller failed: {result.stderr}")
                # Fallback: create a simple batch file that runs Python
                return await self._create_batch_fallback(python_code, file_id)
            
            # Find the created executable
            exe_name = f'zerbot_program_{file_id}.exe'
            exe_path = os.path.join(output_dir, exe_name)
            
            if not os.path.exists(exe_path):
                logger.error(f"Executable not found at {exe_path}")
                return await self._create_batch_fallback(python_code, file_id)
            
            # Move executable to a permanent location
            permanent_dir = os.path.join(tempfile.gettempdir(), "zerbot_executables")
            os.makedirs(permanent_dir, exist_ok=True)
            
            final_exe_path = os.path.join(permanent_dir, exe_name)
            shutil.move(exe_path, final_exe_path)
            
            logger.info(f"Successfully created executable: {final_exe_path}")
            return final_exe_path
            
        except Exception as e:
            logger.error(f"Error creating executable: {str(e)}")
            return await self._create_batch_fallback(python_code, file_id)
    
    async def _create_batch_fallback(self, python_code: str, file_id: str) -> str:
        """
        Fallback method: create a batch file that runs the Python code
        """
        try:
            permanent_dir = os.path.join(tempfile.gettempdir(), "zerbot_executables")
            os.makedirs(permanent_dir, exist_ok=True)
            
            # Create Python file
            python_file = os.path.join(permanent_dir, f"program_{file_id}.py")
            with open(python_file, 'w', encoding='utf-8') as f:
                f.write(python_code)
            
            # Create batch file
            batch_content = f'''@echo off
echo Starting Zerbot Program...
echo.
python "{python_file}"
if errorlevel 1 (
    echo.
    echo Error: Python is not installed or not in PATH.
    echo Please install Python from https://python.org
    pause
) else (
    echo.
    echo Program completed successfully.
)
'''
            
            batch_file = os.path.join(permanent_dir, f"zerbot_program_{file_id}.bat")
            with open(batch_file, 'w', encoding='utf-8') as f:
                f.write(batch_content)
            
            logger.info(f"Created batch file fallback: {batch_file}")
            return batch_file
            
        except Exception as e:
            logger.error(f"Error creating batch fallback: {str(e)}")
            raise
    
    def cleanup(self):
        """Clean up temporary files"""
        try:
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
        except Exception as e:
            logger.error(f"Error cleaning up temp directory: {str(e)}")
    
    def __del__(self):
        """Cleanup when object is destroyed"""
        self.cleanup()