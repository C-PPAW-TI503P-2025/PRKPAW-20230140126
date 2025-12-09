import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PresensiPage() {
  // State Lokasi
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  
  // State Kamera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  // Ambil Lokasi saat load
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

  // Fungsi Capture Foto (dari Modul)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const token = localStorage.getItem("token");

  // --- FUNGSI CHECK-IN (DIPERBARUI PAKE FORMDATA) ---
  const handleCheckIn = async () => {
    if (!coords || !image) {
      alert("Lokasi dan Foto wajib ada!");
      return;
    }

    try {
      // 1. Ubah Base64 image jadi Blob
      const blob = await (await fetch(image)).blob();

      // 2. Masukkan ke FormData (Wajib untuk upload file)
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg'); // Nama field harus 'image' sesuai backend (upload.single('image'))

      // 3. Kirim ke Backend
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Header penting buat upload
          }
        }
      );

      alert(response.data.message || "Check-in berhasil!");
    } catch (err) {
      console.error("Error Check-in:", err);
      const pesan = err.response?.data?.message || err.message;
      alert("Gagal check-in: " + pesan);
    }
  };

  const handleCheckOut = async () => {
    try {
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

  return (
    <div style={{ padding: 20, maxWidth: "600px", margin: "0 auto" }}>
      <h2 className="text-2xl font-bold mb-4">Halaman Presensi</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* --- BAGIAN KAMERA --- */}
      <div className="my-4 border rounded-lg overflow-hidden bg-black" style={{ minHeight: '300px' }}>
        {image ? (
          <img src={image} alt="Selfie" className="w-full" style={{ width: '100%' }} />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: '100%' }}
          />
        )}
      </div>

      {/* Tombol Ambil/Ulang Foto */}
      <div className="mb-4">
        {!image ? (
          <button 
            onClick={capture} 
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Ambil Foto 📸
          </button>
        ) : (
          <button 
            onClick={() => setImage(null)} 
            className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            style={{ width: '100%', padding: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Foto Ulang 🔄
          </button>
        )}
      </div>

      {/* --- BAGIAN PETA --- */}
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

      {/* Tombol Check In/Out */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
            onClick={handleCheckIn} 
            style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
            Check-in
        </button>
        <button 
            onClick={handleCheckOut} 
            style={{ flex: 1, padding: '10px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
            Check-out
        </button>
      </div>
    </div>
  );
}

export default PresensiPage;