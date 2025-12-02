function AttendancePage() {

  const handleCheckIn = async () => {
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/attendance/check-in",
        
        {        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  Presensi.associate = (models) => {
  Presensi.belongsTo(models.User, { foreignKey: "userId" });
};


  const handleCheckOut = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    const res = await axios.post(
      "http://localhost:3001/api/attendance/check-out",
      {},
      config
    );

    setMessage(res.data.message);
  } catch (err) {
    setError(err.response ? err.response.data.message : "Check-out gagal");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

