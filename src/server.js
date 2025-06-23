import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import connectDB from "./config/conectDB.js";
import MongoStore from "connect-mongo";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Public route imports
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chiemrot",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Middleware to make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  req.user = req.session.user || null;
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Public routes (with EJS views)
app.use("/", publicRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
});

export default app;
