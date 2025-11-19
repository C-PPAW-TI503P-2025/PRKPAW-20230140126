import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: nama,
        email: email,
        password: password,
        role: role
      });
      
      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
            {}
            <div>
                <label className="block text-gray-700">Nama Lengkap</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={nama} onChange={(e) => setNama(e.target.value)} required 
                />
            </div>

            {}
            <div>
                <label className="block text-gray-700">Email</label>
                <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                />
            </div>

            {}
            <div>
                <label className="block text-gray-700">Password</label>
                <input 
                    type="password" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password} onChange={(e) => setPassword(e.target.value)} required 
                />
            </div>

            {}
            <div>
                <label className="block text-gray-700">Role</label>
                <select 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={role} onChange={(e) => setRole(e.target.value)}
                >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">
                Daftar Sekarang
            </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
            Sudah punya akun? <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login disini</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;