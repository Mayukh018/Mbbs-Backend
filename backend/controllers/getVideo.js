import Videos from "../models/videosModel.js";

export const getVideos = async (req, res) => {
    try {
        const videos = await Videos.find({});
        res.status(200).json({ success: true, videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getVideo = async (req, res) => {
    try {
        const video = await Videos.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }
        res.status(200).json({ success: true, video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}