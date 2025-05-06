import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      features: [{ type: String }],
      category: {
        type: String,
        enum: ["Choice Filling Tools", "Counselling Plans"],
        required: true,
      }
    },
    { timestamps: true }
  );

const Plan = mongoose.model.Plan || mongoose.model("Plans", planSchema);
export default Plan;