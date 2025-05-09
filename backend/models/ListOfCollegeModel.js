import mongoose from "mongoose";

const listOfCollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    state: { type: String, required: true },
    city: String,
    estdYear: Number,
    rank: Number,
    type: String, 

    closingCutoff: {
        yr2022: Number,
        yr2023: Number,
    },

    numberOfSeats: {
        allIndiaQuota: Number,
        stateQuota: Number,
    },

    bond: {
        ug: { years: Number, penalty: Number },
        pg: { years: Number, penalty: Number },
    },

    ratings: Number,
    fees: Number,
});

const ListOfCollege = mongoose.model("ListOfCollege", listOfCollegeSchema);
export default ListOfCollege;