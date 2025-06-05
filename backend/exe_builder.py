import os
import tempfile
import subprocess
import shutil
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class ExecutableBuilder:
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "zerbot_builds"
        self.temp_dir.mkdir(exist_ok=True)
        
        # Check if PyInstaller is available
        self._check_pyinstaller()
    
    def _check_pyinstaller(self):
        """Check if PyInstaller is installed"""
        try:
            subprocess.run(["pyinstaller", "--version"], 
                         capture_output=True, check=True)
            logger.info("PyInstaller is available")
        except (subprocess.CalledProcessError, FileNotFoundError):
            logger.warning("PyInstaller not found. Installing...")
            self._install_pyinstaller()
    
    def _install_pyinstaller(self):
        """Install PyInstaller"""
        try:
            subprocess.run(["pip", "install", "pyinstaller"], 
                         check=True, capture_output=True)
            logger.info("PyInstaller installed successfully")
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install PyInstaller: {e}")
            raise Exception("Could not install PyInstaller")
    
    async def create_executable(self, python_code: str, file_id: str) -> str:
        """Create an executable from Python code"""
        try:
            # Create a unique directory for this build
            build_dir = self.temp_dir / f"build_{file_id}"
            build_dir.mkdir(exist_ok=True)
            
            # Write Python code to file
            py_file = build_dir / "main.py"
            with open(py_file, 'w', encoding='utf-8') as f:
                f.write(python_code)
            
            # Create the executable using PyInstaller
            exe_path = await self._build_executable(py_file, build_dir, file_id)
            
            return exe_path
            
        except Exception as e:
            logger.error(f"Error creating executable: {str(e)}")
            raise Exception(f"Failed to create executable: {str(e)}")
    
    async def _build_executable(self, py_file: Path, build_dir: Path, file_id: str) -> str:
        """Build executable using PyInstaller"""
        try:
            # PyInstaller command
            cmd = [
                "pyinstaller",
                "--onefile",  # Create a single executable file
                "--console",  # Keep console window
                "--clean",    # Clean cache
                "--distpath", str(build_dir / "dist"),
                "--workpath", str(build_dir / "work"),
                "--specpath", str(build_dir),
                "--name", f"zerbot_program_{file_id}",
                str(py_file)
            ]
            
            # Run PyInstaller
            result = subprocess.run(
                cmd,
                cwd=build_dir,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode != 0:
                logger.error(f"PyInstaller failed: {result.stderr}")
                raise Exception(f"PyInstaller failed: {result.stderr}")
            
            # Find the created executable
            exe_path = build_dir / "dist" / f"zerbot_program_{file_id}.exe"
            
            if not exe_path.exists():
                raise Exception("Executable was not created")
            
            # Move executable to a permanent location
            final_exe_path = self.temp_dir / f"zerbot_program_{file_id}.exe"
            shutil.move(str(exe_path), str(final_exe_path))
            
            # Clean up build directory
            shutil.rmtree(build_dir, ignore_errors=True)
            
            logger.info(f"Successfully created executable: {final_exe_path}")
            return str(final_exe_path)
            
        except subprocess.TimeoutExpired:
            logger.error("PyInstaller timed out")
            raise Exception("Executable creation timed out")
        except Exception as e:
            logger.error(f"Error in _build_executable: {str(e)}")
            raise Exception(f"Failed to build executable: {str(e)}")