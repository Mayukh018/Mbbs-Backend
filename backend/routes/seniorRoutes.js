import { getASenior,addSenior } from "../controllers/phoneSenior.js";
import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { processPayment } from "../controllers/paymentController.js";


const seniorsRouter = express.Router();

seniorsRouter.post("/addSenior", addSenior);
seniorsRouter.get("/getSenior", userAuth, getASenior);
seniorsRouter.post("/payment", userAuth, processPayment);

export default seniorsRouter;