import express from "express";
import {userAuth,checkPredictorAccess} from "../middlewares/auth.js";
import { addCollege, predictColleges, previousResults } from "../controllers/predictionCOntroller.js";
import {processPayment} from "../controllers/paymentController.js";

const collegePredictor = express.Router();


collegePredictor.post("/addCollege", addCollege);
collegePredictor.post("/predictColleges", userAuth, checkPredictorAccess, predictColleges);
collegePredictor.post("/purchase",userAuth,processPayment);
collegePredictor.get('/previous', userAuth, previousResults);
export default collegePredictor;