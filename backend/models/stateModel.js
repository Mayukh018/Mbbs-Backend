import mongoose from 'mongoose';

const stateAllotmentSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        unique: true
    },
    documentURL: {
        type: String,
        required: true
    },
});


const stateAllotmentModel = mongoose.model('StateAllotment', stateAllotmentSchema);
export default stateAllotmentModel;
