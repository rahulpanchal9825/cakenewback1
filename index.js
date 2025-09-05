import express  from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./utils/db.js";
import userRoute from "./routes/userRoute.js";

// Load environment variables
dotenv.config();

// Set up the port and initialize express app
const PORT = process.env.PORT || 5000;
const app = express();

// ✅ Proper CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://shreejicakenew.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};


// Use middlewares
app.use(cors(corsOptions)); // Enable CORS with secure settings
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true }));
// app.use(urlencoded({ extended: true })); // Parse URL-encoded data

// Root endpoint
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I'm coming from backend backend1",
        success: true,
    });
});

// Use API Routes
app.use("/api", userRoute);

// Connect to the database and start the server
connectDb()
    .then(() => {
        console.log("✅ Database connected successfully!");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1); // Exit process on DB connection failure
    });
