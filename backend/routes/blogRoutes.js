import { getBlogs,getSingleBlog } from "../controllers/getBlogs.js";
import express from "express";


const blogs = express.Router();

blogs.get("/", getBlogs);
blogs.get("/:id", getSingleBlog);

export default blogs;