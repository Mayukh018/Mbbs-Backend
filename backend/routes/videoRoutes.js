import { getVideo,getVideos } from "../controllers/getVideo.js";
import express from "express";


const videos = express.Router();

videos.get("/", getVideos);
videos.get("/:id", getVideo);

export default videos;