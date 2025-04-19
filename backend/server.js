import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import stripe from "stripe";
import fs from "fs";
import { ConnectDB } from "./config/db.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import AiRoutes from "./routes/AiRoutes.js"; // ✅ Correct import

// Load environment variables
dotenv.config();

// Fix "__dirname" in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", AiRoutes);


// Routes
app.use("/api/products", ProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", UserRoutes);
app.use("/api", AuthRoutes);
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


app.get('/uploads/:image', (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.params.image);

  app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Amount to charge, in cents (e.g., 5000 for $50)
  
    try {
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,  // Amount in cents
        currency: 'usd', // Currency
      });
  
      // Send client secret to frontend
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).send({ error: error.message });
    }
  });

  // Ensure the file exists before trying to send it
  fs.exists(imagePath, (exists) => {
    if (exists) {
      res.sendFile(imagePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error sending file.");
        }
      });
    } else {
      res.status(404).send("Image not found");
    }
  });
});


// Connect to Database and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await ConnectDB();
    console.log(`🚀 Server started at: http://localhost:${PORT}`);
});
