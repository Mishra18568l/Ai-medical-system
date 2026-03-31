import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./App.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {
  const [location, setLocation] = useState("");
  const [antibiotic, setAntibiotic] = useState("");
  const [zone, setZone] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const reportRef = useRef();

  // 🔗 Backend URL (change if needed)
  const API = "https://ai-medical-system-5olk.onrender.com";

  // 🔮 Predict
  const predict = async () => {
    try {
      const res = await axios.post(`${API}/predict`, {
        location,
        antibiotic,
        zone: parseInt(zone),
      });

      setResult(res.data.prediction);
      fetchHistory();
    } catch (err) {
      alert("Prediction failed!");
      console.error(err);
    }
  };

  // 📊 Fetch history
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 📄 DOWNLOAD PDF (FIXED)
  const downloadPDF = () => {
    const input = reportRef.current;

    if (!input) {
      alert("Report not ready!");
      return;
    }

    setTimeout(() => {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("AI_Medical_Report.pdf");
      });
    }, 500);
  };

  return (
    <div className="main">
      <Sidebar />

      <div className="content fade-in">
        <h1>Doctor Dashboard</h1>

        {/* KPI */}
        <div className="kpi-container">
          <div className="kpi">Total Cases: {history.length}</div>
          <div className="kpi">Last Result: {result}</div>
          <div className="kpi">Status: Active</div>
        </div>

        {/* INPUT */}
        <div className="card">
          <h3>Prediction</h3>

          <select onChange={(e) => setLocation(e.target.value)}>
            <option>Select Location</option>
            <option>IFE-T</option>
          </select>

          <select onChange={(e) => setAntibiotic(e.target.value)}>
            <option>Select Antibiotic</option>
            <option>IMIPENEM</option>
            <option>CEFTAZIDIME</option>
            <option>GENTAMICIN</option>
            <option>AUGMENTIN</option>
            <option>CIPROFLOXACIN</option>
          </select>

          <input
            placeholder="Zone"
            onChange={(e) => setZone(e.target.value)}
          />

          <button onClick={predict}>Predict</button>

          <h2
            style={{
              color: result === "Susceptible" ? "#00ff9f" : "#ff4d4d",
            }}
          >
            {result}
          </h2>
        </div>

        {/* CHART */}
        <div className="card">
          <h3>Resistance Analysis</h3>

          <BarChart width={600} height={300} data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="antibiotic" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="zone" fill="#00c6ff" />
          </BarChart>
        </div>

        {/* HISTORY */}
        <div className="card">
          <h3>Patient History</h3>

          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Antibiotic</th>
                <th>Zone</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.location}</td>
                  <td>{h.antibiotic}</td>
                  <td>{h.zone}</td>
                  <td>{h.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📄 CLEAN REPORT (FOR PDF) */}
        <div
          ref={reportRef}
          style={{
            background: "#fff",
            color: "#000",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h1 style={{ textAlign: "center" }}>AI Medical Report</h1>
          <hr />

          <p><b>Location:</b> {location}</p>
          <p><b>Antibiotic:</b> {antibiotic}</p>
          <p><b>Zone:</b> {zone}</p>
          <p><b>Result:</b> {result}</p>

          <p style={{ marginTop: "20px" }}>
            Generated on: {new Date().toLocaleString()}
          </p>
        </div>

        <button onClick={downloadPDF}>Download Report</button>
      </div>
    </div>
  );
}

export default Dashboard;