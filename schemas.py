from pydantic import BaseModel, Field

class BioMapClassification(BaseModel):
    continent: str = Field(description="The Therapeutic Area (e.g., Oncology, Neurology, Cardiology, Infectious Disease)")
    province: str = Field(description="The specific Target Molecule, Gene, or Protein (e.g., TP53, HER2, EGFR)")
    laboratory: str = Field(description="The Experiment Type (e.g., in vitro, in vivo, clinical trial, assay)")
    disease: str = Field(default="Unknown", description="The identified disease or condition")
    disease_confidence: float = Field(default=0.0, description="The precision/confidence percentage of the disease identification")
