import { compareWithCounselorSheet,compareWithSavedChoices } from "../controllers/compareList.js";
import express from "express";
import { userAuth } from "../middlewares/auth.js";

const compare = express.Router();

compare.post("/compare/saved", userAuth, compareWithSavedChoices);
compare.post("/compare/counselor", userAuth, compareWithCounselorSheet);

export default compare;