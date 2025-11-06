const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models"); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Home Page for API");
});


sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });