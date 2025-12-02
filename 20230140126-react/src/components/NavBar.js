import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">

      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/presensi" className="hover:text-gray-300">Presensi</Link>
            {user?.role === "admin" && (
              <Link to="/reports" className="hover:text-gray-300">Laporan Admin</Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300 font-bold">Login</Link>
            <Link to="/register" className="hover:text-gray-300 font-bold">Register</Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <span className="mr-2">Halo, {user.nama}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          null
        )}
      </div>
    </nav>
  );
}

export default Navbar;