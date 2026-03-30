import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./App.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {
  const [location, setLocation] = useState("");
  const [antibiotic, setAntibiotic] = useState("");
  const [zone, setZone] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const reportRef = useRef();

  const predict = async () => {
    const res = await axios.post("https://ai-medical-system-5olk.onrender.com/predict", {
      location,
      antibiotic,
      zone: parseInt(zone),
    });

    setResult(res.data.prediction);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await axios.get("https://ai-medical-system-5olk.onrender.com/history");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 📄 PDF DOWNLOAD
  const downloadPDF = () => {
    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("report.pdf");
    });
  };

  return (
    <div className="main">
      <Sidebar />

      <div className="content fade-in" ref={reportRef}>
        <h1>Doctor Dashboard</h1>

        {/* KPI CARDS */}
        <div className="kpi-container">
  <div className="kpi fade-in">Total Cases: {history.length}</div>
  <div className="kpi fade-in">Last Result: {result}</div>
  <div className="kpi fade-in">Status: Active</div>
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

          <input placeholder="Zone" onChange={(e) => setZone(e.target.value)} />

          <button onClick={predict}>Predict</button>

          <h2 style={{ color: result === "Susceptible" ? "#00ff9f" : "#ff4d4d" }}>
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

        {/* HISTORY TABLE */}
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

        <button onClick={downloadPDF}>Download Report</button>
      </div>
    </div>
  );
}

export default Dashboard;