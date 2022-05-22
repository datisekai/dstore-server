import express from "express";
import {
  addCategory,
  deleteCategory,
  filterIDName,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controller/CategoryController.js";

const router = express.Router();

router.get("/", getAllCategory);

router.post("/", addCategory);

router.get("/get/:id", getCategory);

router.get("/query", filterIDName);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

export default router;
