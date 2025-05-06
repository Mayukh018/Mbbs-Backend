import express from "express";
import { handleContactForm } from "../controllers/contact.js";
import { userAuth } from "../middlewares/auth.js";


const contactus = express.Router();

contactus.post("/contact", userAuth, handleContactForm);

export default contactus;