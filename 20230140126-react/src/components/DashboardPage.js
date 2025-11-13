import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-200">
        <h1 className="text-4xl font-bold text-green-600 mb-3 animate-pulse">
          Selamat Datang!
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Kamu berhasil login 🎉  
          <br />Sekarang kamu ada di halaman Dashboard.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate("/")}
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
          >
            Ke Halaman Utama
          </button>

          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
