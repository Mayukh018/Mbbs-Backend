import Blog from "../models/blogModel.js";

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}