import mongoose from 'mongoose';;

const collegeSchema = new mongoose.Schema({
  course:{
    type: String,
    required: true,
  },
  college_type: {
    type: String,
    enum: ['Government', 'Private'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  state:{
    type: String,
  },
  quota:{
    type: String,
    enum: ['AIQ'],
    default: null
  },
  establishedYear: {
    type: Number,
  },
  airportCity: {
    type: String,
  },
  nearestAirport: {
    type: String,
  },
  year:{
    type: Number,
  },
  category:{
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST'],
  },
  round:{
    type: Number,
  },
  rank:{
    type: Number,
  },
  marks:{
    type: Number,
  },
  seatsAvailable:{
    type: Number,
  },
  fees:{
    type: Number,
  },
});

const College = mongoose.model('College', collegeSchema);
export default College;