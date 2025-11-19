const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json()); 


app.post("/api/auth/register", (req, res) => {
  const { nama, email, password, role } = req.body;
  
  console.log("Mencoba Register:", nama, email, role);


  return res.status(201).json({
    message: "Registrasi Berhasil! Silakan Login.",
    data: { nama, email, role }
  });
});


app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Mencoba Login:", email);


  if (!email || !password) {
    return res.status(400).json({ message: "Email dan Password harus diisi!" });
  }


  const token = "ini_token_pura_pura_yang_panjang_kombinasi_angka_huruf_12345";

  return res.status(200).json({
    message: "Login Berhasil",
    token: token, 
    user: {
        nama: "User Test", 
        email: email,
        role: "mahasiswa"
    }
  });
});


app.get("/", (req, res) => {
  res.send("Server Backend Jalan di Port 3001!");
});


app.listen(PORT, () => {
  console.log(`✅ Server SUDAH BERJALAN di http://localhost:${PORT}`);
});