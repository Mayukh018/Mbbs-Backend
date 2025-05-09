import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
  },
  fathersName: {
    type: String,
    trim: true
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  category: {
    type: String,
  },

  // Educational Information
  yearOfPassing12th: {
    type: String,
  },
  marks12th: {
    type: Number,
  },

  // Ranking and Quota Information
  inputType: {
    type:String,
  },
  value:{
    type: Number,
  },
  reservationQuota: {
    type: String,
    default: null
  },
  delhiQuota: {
    type: String,
    default: null
  },
  exam: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  hasUpdatedProfile: {
    type: Boolean,
    default: false
  },
  plansBought: [{
    type:String,
  }],
  services: {
    ChoiceFilling:{
      isActive: { type: Boolean, default: false },
      unlockedVia: String,
    },
    premiumContent: {
      isActive: { type: Boolean, default: false },
      unlockedVia: String,
    },
    callSenior: {
      isActive: { type: Boolean, default: false },
      unlockedVia: String,
    },
    collegePredictor: {
      isActive: Boolean,
      unlockedVia: String,
      searchesLeft: { type: Number, default: 3 },
      previousResults: [{
        colleges: [{
          name: String,
        }],
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
    }
  },
  preferences: [{
    listName: { type: String, required: true },
    colleges: [{ type: String }],
  }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
