require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventroutes");
const authRoutes = require("./routes/authroutes");
const bookingRoutes = require("./routes/bookingroutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB Connection
connectDB();

// mounting
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});