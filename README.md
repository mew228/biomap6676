# BioMap: Neural Disease Identification & Research Platform

BioMap is an advanced medical research tool designed for high-precision document ingestion, zero-shot disease classification, and semantic data exploration. Built with a focus on privacy and local-first intelligence, BioMap allows researchers to structure unedited clinical trials, lab notes, and genomic records without relying on external APIs.

## 🚀 Key Features

- **Zero-Shot Disease Engine:** Uses Hugging Face Transformers for intelligent classification into a custom medical taxonomy.
- **Strict Semantic Routing:** Automatically categorizes records into Continents (Primary Domain), Provinces (Target Molecule), and Laboratories (Context).
- **Glassmorphic UI:** A Meta-inspired dashboard with dark mode, fluid micro-animations, and high-density data visualizations.
- **Local Vector Storage:** Powered by ChromaDB for fast, persistent, and private semantic search across indexed records.
- **Real-time Confidence Metrics:** Visualizes classification precision with dynamic progress bars and badges.

## 🛠️ Technology Stack

- **Backend:** FastAPI (Python)
- **ML Intelligence:** Hugging Face `transformers` (Zero-Shot NLI)
- **Vector DB:** ChromaDB
- **Frontend:** React + Vite
- **Styling:** Vanilla CSS (Meta Design System implementation)

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

### Backend Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Usage Workflow

1. **Ingest:** Paste raw clinical or genomic text into the Ingestion Pipeline.
2. **Route:** The system automatically identifies the Continent, Province, and Disease.
3. **Explore:** Use the Exploration Engine to perform semantic searches filtered by Province.

## 📜 License

MIT License - Copyright (c) 2026 Maharshi Nath
