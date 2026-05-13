# BioMap Architecture

## System Overview
BioMap uses a decoupled architecture with a FastAPI backend and a React frontend.

### 1. NLP Pipeline (`classifier.py`)
- Employs `valhalla/distilbart-mnli-12-1` for zero-shot classification.
- Implements a custom thresholding logic (30%) for disease identification.

### 2. Vector Storage (`storage.py`)
- ChromaDB handles persistent document embedding and retrieval.
- Documents are partitioned by "Continent" and "Province" metadata for strict filtering.

### 3. API Layer (`main.py`)
- RESTful endpoints for ingestion and multi-parameter search.
- Integrates all core services into a unified workflow.

### 4. Frontend Design (`frontend/src`)
- Implements glassmorphic principles with a centralized CSS variable system.
- Component-based architecture for high reusability.
