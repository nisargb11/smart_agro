import joblib

model = joblib.load("models/crop_model.pkl")

sample = [[90, 40, 40, 25, 80, 6.5, 200]]  # realistic values
print(model.predict(sample))