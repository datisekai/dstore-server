import express from "express";
import mysql from "mysql";
import * as dotenv from "dotenv";
import db from "./database/index.js";
import authRouter from "./routes/Auth.js";
import bodyParser from "body-parser";
import categoryRouter from "./routes/Category.js";
import productRouter from "./routes/Product.js";
import cors from "cors";

const app = express();

app.listen("7000", () => {
  console.log("Server running on port 7000");
});
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Datisekai");
});

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
