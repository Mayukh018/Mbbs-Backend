import mongoose from "mongoose";

const seniorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    college:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    typeofCollege:{
        type: String,
        enum: ['Government', 'Private'],
        required: true,
    },
    about:{
        type: String,
        required: true,
    }
}, { timestamps: true });


const Seniors = mongoose.models.Seniors || mongoose.model('Seniors', seniorSchema);

export default Seniors;


