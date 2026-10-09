import uvicorn
import socket
import os
import sys

DEFAULT_PORT = 8080

def find_available_port(start_port=8080, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start_port

def start_real_server():
    port = find_available_port(DEFAULT_PORT)
    print("============================================================")
    print("  TRISEAL BAYORA SECURE ENGINE & LOGIC CORE (REAL FASTAPI/WS)")
    print(f"  URL: http://localhost:{port}")
    print(f"  VERIFY CLI: python -m backend.verify_ledger")
    print("============================================================")
    uvicorn.run("backend.app:app", host="127.0.0.1", port=port, log_level="info")

if __name__ == "__main__":
    try:
        start_real_server()
    except KeyboardInterrupt:
        print("\nTriSeal Server Stopped.")
        sys.exit(0)
