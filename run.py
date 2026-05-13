import subprocess
import sys
import time
import os

def main():
    print("Starting BioMap Backend (FastAPI)...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    
    # Give the backend a second to initialize
    time.sleep(2)

    print("Starting BioMap Frontend (Vite)...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend"),
        shell=True # Shell=True required on Windows for npm
    )

    print("\n=======================================================")
    print("[SUCCESS] BioMap Local Stack is Running!")
    print("Backend API: http://localhost:8000")
    print("Frontend UI: http://localhost:5173")
    print("Press Ctrl+C to stop both services.")
    print("=======================================================\n")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down services...")
        backend_process.terminate()
        frontend_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
