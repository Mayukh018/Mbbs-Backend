import Seniors from "../models/seniorModel.js";
import User from "../models/userModel.js";


export const addSenior = async (req, res) => {
    try {
        const { name, email, phone, college, state, typeofCollege, about } = req.body;

        // Check if email already exists
        const existingSenior = await Seniors.findOne({ email });
        if (existingSenior) {
            return res.status(400).json({ message: "Senior with this email already exists." });
        }

        const newSenior = new Seniors({
            name,
            email,
            phone,
            college,
            state,
            typeofCollege,
            about
        });

        await newSenior.save();
        res.status(201).json({ message: "Senior added successfully", senior: newSenior });
    } catch (error) {
        console.error("Error adding senior:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getASenior = async (req, res) => {
    try {
        const { typeofCollege, state, college } = req.query;
        const user = await User.findById(req.user._id);
        const query = {};
        if (typeofCollege) query.typeofCollege = typeofCollege;
        if (state) query.state = state;
        if (college) query.college = college;
        if (!user?.services?.callSenior?.isActive) {
            query.isPremium = false;
        }
        const seniors = await Seniors.find(query);
        if (seniors.length === 0) {
            return res.status(404).json({ message: "No seniors found" });
        }
        const randomIndex = Math.floor(Math.random() * seniors.length);
        const randomSenior = seniors[randomIndex];
        res.status(200).json(randomSenior);
    } catch (error) {
        console.error("Error fetching seniors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}