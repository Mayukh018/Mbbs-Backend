import { getBlogs } from "../controllers/getBlogs";
import express from "express";


const blogs = express.Router();

blogs.get("/", getBlogs);

export default blogs;