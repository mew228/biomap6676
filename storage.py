import uuid
import chromadb
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

class BioMapStorage:
    def __init__(self, persist_directory="./biomap_db"):
        # Uses local CPU/GPU for embeddings. Fast, free, and completely traditional ML.
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.persist_directory = persist_directory
        
        # We use a raw ChromaDB client to have full control over metadata and strict filtering
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name="biomap_raw_data"
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    def store_document(self, raw_text: str, continent: str, province: str, laboratory: str,
                       disease: str = "General / Unknown", disease_confidence: float = 0.0):
        """
        Stores the raw text in chunks, heavily tagged with the structural metadata,
        including the new disease classification fields.
        """
        chunks = self.text_splitter.split_text(raw_text)
        
        # Embed the chunks
        embeddings = self.embeddings.embed_documents(chunks)
        
        ids = [str(uuid.uuid4()) for _ in chunks]
        metadatas = [
            {
                "continent": continent,
                "province": province,
                "laboratory": laboratory,
                "disease": disease,
                "disease_confidence": disease_confidence,
            }
            for _ in chunks
        ]
        
        self.collection.add(
            documents=chunks,  # The raw, unmodified text
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Stored {len(chunks)} raw chunks in {continent} -> {province} -> {laboratory} | Disease: {disease} ({disease_confidence}%).")

    def search(self, query: str, province: str, n_results: int = 3):
        """
        Semantic search strictly scoped to a specific province (molecule).
        """
        query_embedding = self.embeddings.embed_query(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={"province": province}  # Strict scoping mechanism
        )
        
        return results
