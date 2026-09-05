import sys
import uvicorn

if __name__ == "__main__":
    print("Starting AI Final-Year Project Mentor Backend on http://localhost:8000 ...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
