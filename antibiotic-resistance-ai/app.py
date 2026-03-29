from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import sqlite3

app = Flask(__name__)
CORS(app)

# ==============================
# 🔹 LOAD ML MODEL
# ==============================
model = joblib.load("model.pkl")
le_location = joblib.load("location_encoder.pkl")
le_antibiotic = joblib.load("antibiotic_encoder.pkl")
le_result = joblib.load("result_encoder.pkl")

# ==============================
# 🔹 INIT DATABASE
# ==============================
def init_db():
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()

    # USERS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)

    # HISTORY TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT,
            antibiotic TEXT,
            zone INTEGER,
            result TEXT
        )
    """)

    # DEFAULT USER (doctor / 1234)
    cursor.execute("""
        INSERT OR IGNORE INTO users (id, username, password)
        VALUES (1, 'doctor', '1234')
    """)

    conn.commit()
    conn.close()

init_db()

# ==============================
# 🔐 LOGIN API
# ==============================
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (username, password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "fail"})


# ==============================
# 🔮 PREDICT API
# ==============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        location = data.get("location")
        antibiotic = data.get("antibiotic")
        zone = data.get("zone")

        # Encode
        location_encoded = le_location.transform([location])[0]
        antibiotic_encoded = le_antibiotic.transform([antibiotic])[0]

        # Predict
        prediction = model.predict([[location_encoded, antibiotic_encoded, zone]])
        result = le_result.inverse_transform(prediction)[0]

        # SAVE TO DB
        conn = sqlite3.connect("app.db")
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO history (location, antibiotic, zone, result) VALUES (?, ?, ?, ?)",
            (location, antibiotic, zone, result)
        )

        conn.commit()
        conn.close()

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)})


# ==============================
# 📊 HISTORY API
# ==============================
@app.route("/history", methods=["GET"])
def history():
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()

    cursor.execute("SELECT location, antibiotic, zone, result FROM history")
    rows = cursor.fetchall()

    conn.close()

    data = []
    for r in rows:
        data.append({
            "location": r[0],
            "antibiotic": r[1],
            "zone": r[2],
            "result": r[3]
        })

    return jsonify(data)


# ==============================
# 🏠 HOME ROUTE
# ==============================
@app.route("/")
def home():
    return "✅ Antibiotic Resistance API Running"


# ==============================
# 🚀 RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(debug=True)