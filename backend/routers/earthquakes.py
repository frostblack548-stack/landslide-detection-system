from typing import Optional

from fastapi import APIRouter, Query

from backend.services.earthquake_service import earthquake_service

router = APIRouter(prefix="/api/earthquakes", tags=["Official NCS Earthquakes"])


@router.get("")
def get_recent_earthquakes(
    latitude: Optional[float] = Query(None, ge=-90, le=90),
    longitude: Optional[float] = Query(None, ge=-180, le=180),
    radius_km: float = Query(500.0, gt=0, le=2000),
    limit: int = Query(100, gt=0, le=200),
):
    """Return validated, recent earthquake events from the official NCS RISEQ feed."""
    return earthquake_service.get_earthquakes(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        limit=limit,
    )
