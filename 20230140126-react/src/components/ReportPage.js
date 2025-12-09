import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportPage() {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const getImageUrl = (path) => {
    if (!path) return null;
    return `http://localhost:3001/${path.replace(/\\/g, "/")}`;
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
            <th>Bukti Foto</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.user ? (d.user.username || d.user.nama) : "User Dihapus"}</td> 
              
              <td>{d.checkIn ? new Date(d.checkIn).toLocaleString() : "-"}</td>
              <td>{d.checkOut ? new Date(d.checkOut).toLocaleString() : "-"}</td>
              <td>{d.latitude}</td>
              <td>{d.longitude}</td>
              
              <td style={{ textAlign: "center" }}>
                {d.buktiFoto ? (
                  <img 
                    src={getImageUrl(d.buktiFoto)} 
                    alt="Bukti" 
                    style={{ 
                      width: "60px", 
                      height: "60px", 
                      objectFit: "cover", 
                      cursor: "pointer", 
                      borderRadius: "4px"
                    }}
                    onClick={() => setSelectedImage(getImageUrl(d.buktiFoto))}
                  />
                ) : (
                  <span style={{ fontSize: "12px", color: "gray" }}>No Photo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedImage && (
        <div 
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setSelectedImage(null)} 
        >
          <div style={{ position: "relative", padding: "10px", background: "#fff", borderRadius: "8px" }}>
             <button 
                onClick={() => setSelectedImage(null)}
                style={{
                  position: "absolute", top: "-10px", right: "-10px",
                  background: "red", color: "white", border: "none",
                  borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", fontWeight: "bold"
                }}
             >
               X
             </button>
             <img 
                src={selectedImage} 
                alt="Full Size" 
                style={{ maxHeight: "80vh", maxWidth: "90vw", display: "block" }} 
             />
          </div>
        </div>
      )}

    </div>
  );
}

export default ReportPage;