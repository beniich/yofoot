from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Placeholder for loaded model
# model = joblib.load("model.pkl")

class PredictionRequest(BaseModel):
    home_form: float
    away_form: float
    xg_home: float
    xg_away: float

@app.post("/predict")
def predict(data: PredictionRequest):
    # Dummy logic until model is trained
    home_prob = 0.45
    draw_prob = 0.25
    away_prob = 0.30
    
    return {
      "home": home_prob,
      "draw": draw_prob,
      "away": away_prob
    }
