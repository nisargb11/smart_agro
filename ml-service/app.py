from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import json, os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

print("Loading crop recommendation model...")
crop_model = joblib.load("models/crop_model_xgb.pkl")
le = joblib.load("models/label_encoder.pkl")
print("Crop model loaded!")

print("Loading plant classifier model...")
plant_model = load_model("models/plant_classifier_model.keras")
with open("models/plant_class_indices.json") as f:
    plant_indices = json.load(f)
PLANT_NAMES = {v: k for k, v in plant_indices.items()}
print(f"Plant classifier loaded! Classes: {len(PLANT_NAMES)}")

print("Loading disease detection model...")
disease_model = load_model("models/plant_disease_model_final.keras")
with open("models/class_indices.json") as f:
    disease_indices = json.load(f)
DISEASE_NAMES = {v: k for k, v in disease_indices.items()}
print(f"Disease model loaded! Classes: {len(DISEASE_NAMES)}")

CROP_EMOJI = {
    "rice": "🌾", "maize": "🌽", "chickpea": "🫘", "kidneybeans": "🫘",
    "pigeonpeas": "🫘", "mothbeans": "🫘", "mungbean": "🫘", "blackgram": "🫘",
    "lentil": "🫘", "pomegranate": "🍎", "banana": "🍌", "mango": "🥭",
    "grapes": "🍇", "watermelon": "🍉", "muskmelon": "🍈", "apple": "🍎",
    "orange": "🍊", "papaya": "🍈", "coconut": "🥥", "cotton": "🌿",
    "jute": "🌿", "coffee": "☕", "adzukibeans": "🫘", "groundnut": "🫘",
    "peas": "🫘", "rubber": "🌿", "sugarcane": "🌿", "tea": "🌿",
    "tobacco": "🌿"
}

FEATURE_COLUMNS = ["nitrogen", "phosphorous", "potassium", "temperature", "humidity", "ph", "rainfall"]

VALID_RANGES = {
    "nitrogen":     (0,   140),
    "phosphorous":  (5,   145),
    "potassium":    (5,   205),
    "temperature":  (8,   45),
    "humidity":     (14,  100),
    "ph":           (3.5, 9.5),
    "rainfall":     (20,  300),
}

def preprocess_image(file):
    temp_path = "temp_upload.jpg"
    file.save(temp_path)
    img = image.load_img(temp_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    os.remove(temp_path)
    return img_array


@app.route("/predict", methods=["POST"])
def predict_crop():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "error": "No input data received"}), 400

        try:
            N        = float(data["nitrogen"])
            P        = float(data["phosphorous"])
            K        = float(data["potassium"])
            temp     = float(data["temperature"])
            humidity = float(data["humidity"])
            ph       = float(data["ph"])
            rainfall = float(data["rainfall"])
        except (KeyError, ValueError):
            return jsonify({"success": False, "error": "Invalid or missing input fields"}), 400

        inputs = {
            "nitrogen": N, "phosphorous": P, "potassium": K,
            "temperature": temp, "humidity": humidity,
            "ph": ph, "rainfall": rainfall
        }

        out_of_range = []
        for field, value in inputs.items():
            min_val, max_val = VALID_RANGES[field]
            if value < min_val or value > max_val:
                out_of_range.append(
                    f"{field.capitalize()} ({value}) must be between {min_val} and {max_val}"
                )
        if out_of_range:
            return jsonify({
                "success": False,
                "error": "Input values are outside valid agronomic ranges",
                "details": out_of_range
            }), 400

        features = pd.DataFrame([inputs], columns=FEATURE_COLUMNS)
        probabilities = crop_model.predict_proba(features)[0]
        top3_indices = np.argsort(probabilities)[::-1][:3]

        top_confidence = float(probabilities[top3_indices[0]]) * 100
        if top_confidence < 15:
            return jsonify({
                "success": False,
                "error": "The provided conditions do not match any known crop profile. Please check your inputs."
            }), 400

        predictions = []
        for i in top3_indices:
            crop_name = le.inverse_transform([i])[0]
            confidence = round(float(probabilities[i]) * 100, 1)
            predictions.append({
                "crop": crop_name.capitalize(),
                "confidence": confidence,
            })

        return jsonify({"success": True, "predictions": predictions})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/predict-disease", methods=["POST"])
def predict_disease():
    try:
        if "image" not in request.files:
            return jsonify({"success": False, "error": "No image uploaded"}), 400

        file = request.files["image"]

        allowed_extensions = {'jpg', 'jpeg', 'png'}
        ext = file.filename.rsplit('.', 1)[-1].lower()
        if ext not in allowed_extensions:
            return jsonify({"success": False, "error": "Only JPG/PNG images allowed"}), 400

        img_array = preprocess_image(file)
        plant_preds = plant_model.predict(img_array)[0]
        top_plant_idx = int(np.argmax(plant_preds))
        plant_confidence = float(np.max(plant_preds)) * 100

        if plant_confidence < 60:
            return jsonify({
                "success": False,
                "error": "Could not identify a recognizable plant leaf in the image. Please upload a clear leaf image."
            }), 400

        detected_plant = PLANT_NAMES[top_plant_idx]
        clean_plant = (
            detected_plant
            .replace("_(including_sour)", "")
            .replace("_(maize)", "")
            .replace(",_bell", " Bell")
            .replace("_", " ")
        )

        disease_preds = disease_model.predict(img_array)[0]

        filtered_indices = [
            i for i, name in DISEASE_NAMES.items()
            if name.startswith(detected_plant)
        ]
        if not filtered_indices:
            filtered_indices = list(DISEASE_NAMES.keys())

        filtered_scores = {i: disease_preds[i] for i in filtered_indices}
        top3_indices = sorted(filtered_scores, key=filtered_scores.get, reverse=True)[:3]

        results = []
        for i in top3_indices:
            class_name = DISEASE_NAMES[i]
            _, condition = class_name.split("___") if "___" in class_name else (class_name, "Unknown")
            results.append({
                "plant": clean_plant,
                "disease": condition.replace("_", " "),
                "confidence": round(float(disease_preds[i]) * 100, 1),
            })

        return jsonify({
            "success": True,
            "detected_plant": clean_plant,
            "plant_confidence": round(plant_confidence, 1),
            "predictions": results
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)