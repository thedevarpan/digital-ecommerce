require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
/* Require routers */
const authRoutes = require("../src/routes/auth.routes");
const cookieParser = require("cookie-parser");

/* Basic express setup */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Setup morgan */
app.use(morgan("dev"));

/* Set the cookie*/
app.use(cookieParser());

/* CORS Configuration for Next.js */
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

/** 
 * 
 */
app.use("/api/auth/", authRoutes);


module.exports = app;