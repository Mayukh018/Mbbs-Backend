import { getPlans } from "../controllers/plansController.js";
import { userAuth } from "../middlewares/auth.js";
import { processPayment } from "../controllers/paymentController.js";

import express from "express";

const plans = express.Router();

plans.get("/", getPlans);
plans.post("/purchase", userAuth, processPayment);

export default plans;