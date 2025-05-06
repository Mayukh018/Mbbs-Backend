import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fileUrl: { type: String, required: true },
  isPremium: { type: Boolean, default: true },
  categories: {
    aiq: { type: Boolean, default: false },
    state: { type: Boolean, default: false },
    yearWise: { type: Boolean, default: false },
    catWise: { type: Boolean, default: false }
  },
  year: { type: Number, default: new Date().getFullYear() },
  createdAt: { type: Date, default: Date.now }
});

const file = mongoose.model('File', fileSchema);
export default file;
