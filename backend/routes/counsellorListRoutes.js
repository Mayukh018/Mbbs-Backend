import express from "express";
import {
  createSheet,
  assignSheet,
  getSheet,
  deassignSheet,
  deassignAllSheet,
} from "../controllers/counsellorListController.js";

const counsellorListRoutes = express.Router();

// Counsellor List Routes
counsellorListRoutes.post("/create-sheet", createSheet);
counsellorListRoutes.post("/assign-sheet", assignSheet);
counsellorListRoutes.get("/get-sheet/:userid", getSheet);
counsellorListRoutes.get("/deassign-sheet/:sheetid", deassignSheet);
counsellorListRoutes.get("/deassign-all-sheet", deassignAllSheet);

export default counsellorListRoutes;