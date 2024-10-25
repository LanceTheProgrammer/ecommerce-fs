import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/ProductRoute.js";
import cartRouter from "./routes/CartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Configure CORS to allow frontend access
const allowedOrigins = [
  "https://ecommerce-fs-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ecommerce-fs-admin.vercel.app",
  "https://ecommerce-fs-backend.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin); // Log the incoming origin
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Test endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
