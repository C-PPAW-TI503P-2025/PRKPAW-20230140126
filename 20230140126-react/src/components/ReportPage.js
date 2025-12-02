import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReport();
  }, []);

const fetchReport = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get("http://localhost:3001/api/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    setData(res.data.data);
  } catch (error) {
    console.error("Gagal ambil laporan:", error);
    alert("Gagal ambil data: " + (error.response?.data?.message || error.message));
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Report Presensi Semua User</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>User</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.user ? (d.user.username || d.user.nama) : "User Dihapus"}</td> 
              
              <td>{d.checkIn}</td>
              <td>{d.checkOut || "-"}</td>
              <td>{d.latitude}</td>
              <td>{d.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage;