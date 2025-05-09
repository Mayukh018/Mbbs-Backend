import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sheetURL:{
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});
const Sheet = mongoose.model("Sheet", sheetSchema);