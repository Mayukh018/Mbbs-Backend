import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    serviceType: { 
      type: String, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: { 
      type: String, 
      unique: true,
      required: true 
    },
    invoiceNumber: String,
  }, { 
    timestamps: true
  });

export default mongoose.model('Payment', transactionSchema);