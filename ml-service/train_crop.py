import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

print("Loading dataset...")
df = pd.read_csv("Crop_recommendation.csv")

X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training model... (this takes a few seconds)")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Model accuracy: {accuracy * 100:.2f}%")

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/crop_model.pkl")
print("Model saved to models/crop_model.pkl")
print("Done!")