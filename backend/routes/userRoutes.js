import { registerUser, verifyLoginOTP, sendLoginOTP, completeProfile, userCredits, logoutUser, chooseExam, getUser, updateUserProfile, getStateAllotmentDocument } from "../controllers/userController.js";
import {userAuth} from "../middlewares/auth.js";
import express from "express";


const router = express.Router();
router.post("/register", registerUser);
router.post("/verify", sendLoginOTP);
router.post("/login", verifyLoginOTP);
router.post("/logout", userAuth, logoutUser);
router.patch("/completeProfile", userAuth, completeProfile);
router.patch("/chooseExam", userAuth, chooseExam);
router.get("/getUser", userAuth, getUser);
router.get("/trials", userAuth, userCredits);
router.put('/update', userAuth, updateUserProfile);
router.get('/stateAllotmentDocument', userAuth, getStateAllotmentDocument);
export default router;