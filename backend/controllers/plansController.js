import Plan from "../models/packagesModel.js";

export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({});
        res.status(200).json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}