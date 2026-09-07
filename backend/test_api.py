"""
Test Suite for LandslideGuard Backend API
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("[PASS] Health check endpoint passed")

def test_hazard_zones():
    response = client.get("/api/zones")
    assert response.status_code == 200
    zones = response.json()
    assert len(zones) >= 5
    assert any(z["id"] == "zone-sk-01" for z in zones)
    print(f"[PASS] Hazard zones endpoint passed ({len(zones)} zones loaded)")

def test_susceptibility_calculation():
    payload = {
        "slope_deg": 48.5,
        "soil_saturation_pct": 85.0,
        "elevation_m": 1420.0
    }
    response = client.post("/api/zones/calculate-susceptibility", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "susceptibility_index" in data
    assert data["risk_status"] in ["CRITICAL RED", "ADVISORY ORANGE", "NOMINAL GREEN"]
    print(f"[PASS] Susceptibility calculation passed: {data['risk_status']} ({data['susceptibility_index']})")

def test_predict_lstm():
    response = client.get("/api/predict/lstm?extra_rainfall=25")
    assert response.status_code == 200
    data = response.json()
    assert "hazard_score" in data
    assert "simulated_fos" in data
    assert "simulated_pwp" in data
    assert "lead_time_display" in data
    print(f"[PASS] LSTM dynamic trigger passed: Hazard Score={data['hazard_score']}, FoS={data['simulated_fos']}, Lead Time={data['lead_time_display']}")

def test_crowdsource_reports():
    response = client.get("/api/reports")
    assert response.status_code == 200
    reports = response.json()
    assert len(reports) >= 1
    print(f"[PASS] Crowdsource reports passed ({len(reports)} reports)")

def test_report_submission_and_cv():
    payload = {
        "location": "NH-10 Near Dikchu Bend (Km 36.2)",
        "subDivision": "Mangan Sub-Division",
        "state": "sikkim",
        "description": "Active rotational blowout with tension cracks across roadway."
    }
    response = client.post("/api/reports/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["urgency"] == "CRITICAL"
    assert len(data["boundingBoxes"]) > 0
    print(f"[PASS] Citizen report upload + AI CV vision passed: {data['code']} ({data['cvLabel']})")

def test_sensor_nodes():
    response = client.get("/api/sensors")
    assert response.status_code == 200
    sensors = response.json()
    assert len(sensors) >= 4
    print(f"[PASS] IoT Sensor telemetry nodes passed ({len(sensors)} sensors)")

def test_cap_alert():
    response = client.get("/api/alerts/cap")
    assert response.status_code == 200
    data = response.json()
    assert "alert" in data
    assert "raw_xml" in data
    assert "MANDATORY EVACUATION" in data["alert"]["headline"]
    print(f"[PASS] CAP 1.2 Alert generation passed: {data['alert']['identifier']}")

def test_live_weather():
    response = client.get("/api/weather/live?state=sikkim")
    assert response.status_code == 200
    data = response.json()
    assert "current_temperature_c" in data
    assert "soil_saturation_pct" in data
    print(f"[PASS] Live meteorological & soil moisture feed passed: {data['station_name']} ({data['current_temperature_c']}C, {data['soil_saturation_pct']}% Saturation)")

def test_sms_broadcast():
    payload = {
        "headline": "MANDATORY EVACUATION NH-10",
        "instruction": "Move to Singtam Relief Camp immediately.",
        "state": "sikkim"
    }
    response = client.post("/api/alerts/sms-broadcast", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "delivered"
    print(f"[PASS] Emergency SMS Broadcast gateway passed: {data['gateway']}")

if __name__ == "__main__":
    print("\nRunning LandslideGuard Backend API Tests...\n")
    test_health()
    test_hazard_zones()
    test_susceptibility_calculation()
    test_predict_lstm()
    test_crowdsource_reports()
    test_report_submission_and_cv()
    test_sensor_nodes()
    test_cap_alert()
    test_live_weather()
    test_sms_broadcast()
    print("\nAll 10 Backend API tests passed successfully!\n")
