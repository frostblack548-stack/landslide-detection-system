from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from backend.database.database import get_db
from backend.database.models import HazardZoneModel
from backend.ml.susceptibility import susceptibility_engine

router = APIRouter(prefix="/api/zones", tags=["Susceptibility & Hazard Zones"])

class SusceptibilityRequest(BaseModel):
    slope_deg: float
    soil_saturation_pct: float
    elevation_m: float
    lithology_index: float = 0.8
    drainage_density_km: float = 2.4

@router.get("")
def get_hazard_zones(
    state: Optional[str] = Query(None, description="Filter by NER state (e.g., sikkim, assam)"),
    critical_only: bool = Query(False, description="Filter only critical zones"),
    db: Session = Depends(get_db)
):
    query = db.query(HazardZoneModel)
    if state and state.lower() != "all":
        query = query.filter(HazardZoneModel.state == state.lower())
    if critical_only:
        query = query.filter(HazardZoneModel.isCritical == True)
    
    zones = query.all()
    return zones

@router.get("/{zone_id}")
def get_hazard_zone_by_id(zone_id: str, db: Session = Depends(get_db)):
    zone = db.query(HazardZoneModel).filter(HazardZoneModel.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hazard zone not found")
    return zone

@router.post("/calculate-susceptibility")
def calculate_custom_susceptibility(req: SusceptibilityRequest):
    return susceptibility_engine.calculate_susceptibility(
        slope_deg=req.slope_deg,
        soil_saturation_pct=req.soil_saturation_pct,
        elevation_m=req.elevation_m,
        lithology_index=req.lithology_index,
        drainage_density_km=req.drainage_density_km,
    )
