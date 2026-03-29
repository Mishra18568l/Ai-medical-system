import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load processed dataset
df = pd.read_csv("processed_data.csv")

# Encode categorical features
le_location = LabelEncoder()
le_antibiotic = LabelEncoder()
le_result = LabelEncoder()

df["Location"] = le_location.fit_transform(df["Location"])
df["Antibiotic"] = le_antibiotic.fit_transform(df["Antibiotic"])
df["Result"] = le_result.fit_transform(df["Result"])

# Features and target
X = df[["Location", "Antibiotic", "Zone"]]
y = df["Result"]

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)
print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "model.pkl")

# Save encoders
joblib.dump(le_location, "location_encoder.pkl")
joblib.dump(le_antibiotic, "antibiotic_encoder.pkl")
joblib.dump(le_result, "result_encoder.pkl")

print("Model and encoders saved successfully")