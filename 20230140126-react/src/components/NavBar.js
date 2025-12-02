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
    <nav className="bg-white-800 text-white px-6 py-4 flex justify-between">
      <div>
        <Link to="/dashboard" className="mr-4">Dashboard</Link>
        <Link to="/presensi" className="mr-4">Presensi</Link>
        {user?.role === "admin" && (
          <Link to="/reports" className="mr-4">Laporan Admin</Link>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <span>{user?.nama}</span>
        <button onClick={handleLogout} className="bg-blue-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

