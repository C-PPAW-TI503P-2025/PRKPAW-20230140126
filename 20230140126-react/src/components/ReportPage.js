import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:3000/api/report/presensi", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setData(res.data.data);
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
              <td>{d.user.username}</td>
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
