import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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

  const handleCheckIn = async () => {
    if (!coords) return alert("Lokasi belum tersedia!");

    try {
      await axios.post(
        "http://localhost:3000/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Check-in berhasil");
    } catch {
      alert("Gagal check-in");
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Check-out berhasil");
    } catch {
      alert("Gagal check-out");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Halaman Presensi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {coords && (
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
      )}

      <button onClick={handleCheckIn}>Check-in</button>
      <button onClick={handleCheckOut} style={{ marginLeft: 10 }}>
        Check-out
      </button>
    </div>
  );
}

export default PresensiPage;
