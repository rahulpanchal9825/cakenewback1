import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Set up the port and initialize express app
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware to handle CORS
const corsOptions = {
    origin: '*', // Allow requests only from this origin
    credentials: true, // Allow cookies and authorization headers with requests
};

// Use middlewares
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(urlencoded({ extended: true })); // Parse URL-encoded bodies (for form submissions)

// Root endpoint
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I'm coming from backend",
        success: true,
    });
});

// Use API Routes (e.g., /api/user)
app.use("/api", userRoute);

// Connect to the database and start the server
connectDb()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process if the connection fails
    });
