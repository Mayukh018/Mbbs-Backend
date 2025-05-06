import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
});

const Videos = mongoose.model.Videos || mongoose.model("Videos", videoSchema);
export default Videos;
