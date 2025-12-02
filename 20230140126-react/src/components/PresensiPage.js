import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Pastikan CSS leaflet diimport agar peta tidak berantakan

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => setError("Gagal mengambil lokasi: " + err.message)
    );
  };

  const token = localStorage.getItem("token");

  // --- PERBAIKAN DI SINI ---
  const handleCheckIn = async () => {
    if (!coords) return alert("Lokasi belum tersedia!");

    try {
      // GANTI PORT KE 3001 (Port Backend), BUKAN 3000 (Port Frontend)
      await axios.post(
        "http://localhost:3001/api/presensi/check-in", 
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Check-in berhasil");
    } catch (err) {
      console.error("Error Check-in:", err); // Cek Console (F12) untuk detail
      // Tampilkan pesan error yang spesifik dari backend jika ada
      const pesan = err.response?.data?.message || err.message;
      alert("Gagal check-in: " + pesan);
    }
  };

  const handleCheckOut = async () => {
    try {
      // GANTI PORT KE 3001
      await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Check-out berhasil");
    } catch (err) {
      console.error("Error Check-out:", err);
      const pesan = err.response?.data?.message || err.message;
      alert("Gagal check-out: " + pesan);
    }
  };
  // -------------------------

  return (
    <div style={{ padding: 20 }}>
      <h2>Halaman Presensi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {coords && (
        <div className="my-4 border rounded-lg overflow-hidden">
            <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%", margin: "20px 0" }}
            >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Anda saat ini</Popup>
            </Marker>
            </MapContainer>
        </div>
      )}

      <button onClick={handleCheckIn} className="btn-primary" style={{ marginRight: 10 }}>Check-in</button>
      <button onClick={handleCheckOut} className="btn-secondary">Check-out</button>
    </div>
  );
}

export default PresensiPage;