import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from schemas import BioMapClassification
from classifier import classify_document
from storage import BioMapStorage

app = FastAPI(title="BioMap Local API")

# Setup CORS to allow Vite frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize storage engine globally
storage = BioMapStorage()

class IngestRequest(BaseModel):
    raw_text: str

class SearchRequest(BaseModel):
    query: str
    province: str

@app.get("/")
def read_root():
    return {"status": "BioMap Offline AI Engine Running"}

@app.post("/ingest")
def ingest_document(request: IngestRequest):
    try:
        print("Classifying raw document (zero extraction)...")
        classification = classify_document(request.raw_text)
        print(f"-> Classified into Continent: {classification.continent}")
        print(f"-> Classified into Province: {classification.province}")
        print(f"-> Classified into Laboratory: {classification.laboratory}")
        print(f"-> Disease Identified: {classification.disease} ({classification.disease_confidence}% confidence)")

        print("\nStoring document in strictly mapped location...")
        storage.store_document(
            raw_text=request.raw_text,
            continent=classification.continent,
            province=classification.province,
            laboratory=classification.laboratory,
            disease=classification.disease,
            disease_confidence=classification.disease_confidence
        )
        
        return {
            "status": "success",
            "classification": {
                "continent": classification.continent,
                "province": classification.province,
                "laboratory": classification.laboratory,
                "disease": classification.disease,
                "disease_confidence": classification.disease_confidence
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
def search_documents(request: SearchRequest):
    try:
        print(f"Searching for '{request.query}' strictly within Province: '{request.province}'...")
        results = storage.search(query=request.query, province=request.province)
        
        docs = results['documents'][0] if results['documents'] else []
        metas = results['metadatas'][0] if results['metadatas'] else []
        
        formatted_results = []
        for i in range(len(docs)):
            formatted_results.append({
                "text": docs[i].strip(),
                "metadata": metas[i]
            })
            
        return {
            "status": "success",
            "results": formatted_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
