from transformers import pipeline
from schemas import BioMapClassification
import warnings
import re

# Suppress warnings for a cleaner output
warnings.filterwarnings("ignore")

print("Loading advanced local NLP models (this takes a moment the first time)...")

# 1. Advanced Zero-Shot Classification Pipeline for Routing
# Uses Natural Language Inference (NLI) to probabilistically categorize text.
zsc_classifier = pipeline(
    "zero-shot-classification", 
    model="cross-encoder/nli-distilroberta-base"
)

CONTINENT_LABELS = ["Oncology", "Neurology", "Cardiology", "Infectious Disease", "Immunology"]
LAB_LABELS = ["in vitro", "in vivo animal model", "human clinical trial", "computational modeling"]

# Disease taxonomy for the new Disease Identification feature
DISEASE_LABELS = [
    "Non-Small Cell Lung Cancer", "Breast Cancer", "Colorectal Cancer",
    "Prostate Cancer", "Leukemia", "Lymphoma", "Melanoma",
    "Alzheimer's Disease", "Parkinson's Disease", "Multiple Sclerosis",
    "Epilepsy", "Glioblastoma",
    "Coronary Artery Disease", "Heart Failure", "Atrial Fibrillation",
    "Hypertrophic Cardiomyopathy",
    "HIV/AIDS", "Tuberculosis", "COVID-19", "Hepatitis",
    "Rheumatoid Arthritis", "Systemic Lupus Erythematosus", "Type 1 Diabetes",
    "General Research / Unknown Condition"
]

DISEASE_CONFIDENCE_THRESHOLD = 0.30


def classify_document(raw_text: str) -> BioMapClassification:
    """
    Advanced NLP Routing Engine.
    Runs 100% locally using probabilistic ML models to understand the text mathematically.
    """
    print("Classifying Continent and Laboratory using Zero-Shot Inference...")
    continent_result = zsc_classifier(raw_text, CONTINENT_LABELS)
    continent = continent_result['labels'][0]

    lab_result = zsc_classifier(raw_text, LAB_LABELS)
    laboratory = lab_result['labels'][0]

    print("Extracting Province using Semantic Candidate Verification...")
    # Step 1: Find potential candidates (e.g. acronyms, genes, proteins)
    candidates = list(set(re.findall(r'\b(?![0-9]+\b)[A-Za-z0-9]{3,8}\b', raw_text)))
    
    # Step 2: Use the NLI model to semantically score each candidate in context
    best_province = "Unknown Province"
    highest_score = 0.0
    
    for candidate in candidates:
        hypothesis_labels = ["target molecule or gene", "unrelated text"]
        res = zsc_classifier(candidate, hypothesis_labels)
        
        if res['labels'][0] == "target molecule or gene":
            score = res['scores'][0]
            if score > highest_score and score > 0.6:
                highest_score = score
                best_province = candidate

    print("Identifying disease condition using Disease Classification Engine...")
    disease_result = zsc_classifier(raw_text, DISEASE_LABELS)
    top_disease = disease_result['labels'][0]
    top_confidence = disease_result['scores'][0]

    # Apply confidence threshold to avoid false positives
    if top_confidence < DISEASE_CONFIDENCE_THRESHOLD or top_disease == "General Research / Unknown Condition":
        disease = "General / Unknown"
        disease_confidence = 0.0
    else:
        disease = top_disease
        disease_confidence = round(top_confidence * 100, 1)

    return BioMapClassification(
        continent=continent.title(),
        province=best_province.upper(),
        laboratory=laboratory.title(),
        disease=disease,
        disease_confidence=disease_confidence
    )
