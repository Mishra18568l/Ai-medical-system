# Live Demo: ai-medical-system-roan.vercel.app

# Login: doctor / 1234

# 🧬 AI Medical System – Antibiotic Resistance Predictor

An AI-powered web application that predicts antibiotic resistance based on location, antibiotic type, and hospital zone.

This project helps doctors and researchers quickly analyze potential resistance patterns using a trained machine learning model.

---

# 🚀 Live Demo

Frontend (User Interface):
ai-medical-system-roan.vercel.app

Backend API:
https://ai-medical-system.onrender.com

---

# 🔐 Login Credentials (For Judges)

Use these credentials to access the system:

Username:
doctor

Password:
1234

---

# 📊 Features

• Doctor login system  
• Predict antibiotic resistance using AI model  
• Stores prediction history in database  
• Interactive dashboard  
• Full-stack deployment (React + Flask)  
• Cloud deployment (Vercel + Render)

---

# 🧠 Tech Stack

Frontend:
React.js  
Axios  
CSS  

Backend:
Python  
Flask  
Flask-CORS  
Gunicorn  

Machine Learning:
Scikit-learn  
Joblib  

Database:
SQLite  

Deployment:
Vercel (Frontend)  
Render (Backend)

---

# 🧬 How Prediction Works

The system takes three inputs:

• Location  
• Antibiotic  
• Hospital Zone  

These inputs are encoded using trained encoders and passed to a trained ML model.

The model predicts whether resistance is:

• Resistant  
• Sensitive

The result is displayed on the dashboard and stored in the history database.

---

# 🖥 Project Structure

Ai-Medical-System
│
├── antibiotic-resistance-ai
│ ├── app.py
│ ├── model.pkl
│ ├── location_encoder.pkl
│ ├── antibiotic_encoder.pkl
│ ├── result_encoder.pkl
│ ├── requirements.txt
│
├── frontend
│ ├── src
│ ├── public
│ ├── package.json


---

# 👨‍💻 Team / Author

Hackathon Project

Developed for AI Healthcare Analytics.

---

# 📜 License

This project is for educational and research purposes.
