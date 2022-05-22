import express from "express";
import {
  getAllProduct,
  getProduct,
  addProduct,
  deleteProduct,
} from "../controller/ProductController.js";

const router = express.Router();

router.get("/", getAllProduct);

router.get("/:id", getProduct);

router.post("/", addProduct);

router.delete("/:id", deleteProduct);

export default router;
