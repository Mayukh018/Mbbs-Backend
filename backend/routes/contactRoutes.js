import express from "express";
import { handleContactForm } from "../controllers/contact.js";


const contactus = express.Router();

contactus.post("/contact", handleContactForm);

export default contactus;