import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import StateAllotment from "../models/stateModel.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const {
            phoneNumber,
            email,
            name,
            fathersName,
            inputType,
            value,
            category,
            state,
            password
        } = req.body;

        if (!phoneNumber || !password || !email || !name || !fathersName || !category || !state) {
            return res.json({ success: false, message: "Please fill in all fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            phoneNumber,
            email,
            name,
            fathersName,
            inputType,
            value,
            category,
            state,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'Strict',
            maxAge: 28 * 24 * 60 * 60 * 1000 // 28 days
        });

        res.json({ success: true, user: { name: user.name } });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export const signUpMobile = async (req, res) => {
    try {
        const {
            phoneNumber,
        } = req.body;
        if (!phoneNumber) {
            return res.json({ success: false, message: "Please fill in all fields" });
        }
        const newAppUser = new User({
            phoneNumber,
        });
        const user = await newAppUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'Strict',
            maxAge: 28 * 24 * 60 * 60 * 1000 // 28 days
        });
        res.json({ success: true, user: { phoneNumber: user.phoneNumber } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
const OTP = "123456";

export const sendLoginOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "OTP sent", otp: OTP }); // send only in dev
};

export const verifyLoginOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (otp !== OTP) {
        return res.json({ success: false, message: "Invalid OTP" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 * 4 // 28 days
    });
    res.json({ success: true, token, user: { name: user.name || user.phoneNumber } });
};

export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: "Logged out successfully" });
};


export const completeProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const {
            name,
            gender,
            fathersName,
            state,
            city,
            category,
            yearOfPassing12th,
            marks12th,
            rank,
            reservationQuota,
            delhiQuota } = req.body;


        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!name || !rank || !marks12th || !yearOfPassing12th ||
            !category || !city || !state || !fathersName || !gender) {
            return res.status(400).json({ message: 'All profile fields are required' });
        }
        user.name = name;
        user.gender = gender;
        user.fathersName = fathersName;
        user.state = state;
        user.city = city;
        user.category = category;
        user.yearOfPassing12th = yearOfPassing12th;
        user.marks12th = marks12th;
        user.rank = rank;
        user.reservationQuota = reservationQuota;
        user.delhiQuota = delhiQuota;
        await user.save();
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const chooseExam = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const { exam } = req.body;
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!exam) {
            return res.status(400).json({ message: 'All profile fields are required' });
        }
        user.exam = exam;
        await user.save();
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                name: user.name,
                inputType: user.inputType,
                value: user.value,
                category: user.category,
                state: user.state,
                city: user.city,
            }
        });
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.hasUpdatedProfile) {
            return res.status(403).json({
                success: false,
                message: "Profile update is allowed only once"
            });
        }

        const { rank, category, marks } = req.body;
        if (rank !== undefined) user.rank = rank;
        if (category) user.category = category;
        if (marks !== undefined) user.marks = marks;

        user.hasUpdatedProfile = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {

                rank: user.rank,
                category: user.category,
                marks: user.marks
            }
        });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};


export const userCredits = async (req, res) => {
    try {
        // Get userId from auth middleware instead of body

        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const usage = user.services.collegePredictor || {};
        res.json({
            success: true,
            data: {
                trialCount: usage.searchesLeft ?? 0,
                hasPurchased: usage.isActive ?? false
            }
        });
    } catch (error) {
        console.error("Error in userCredits:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const getStateAllotmentDocument = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || !user.state) {
            return res.status(400).json({ success: false, message: "User state not found" });
        }

        const document = await StateAllotment.findOne({ state: new RegExp(`^${user.state}$`, 'i') });

        if (!document) {
            return res.status(404).json({ success: false, message: "No allotment document found for your state" });
        }

        return res.status(200).json({
            success: true,
            data: {
                state: document.state,
                url: document.documentURL,
            }
        });

    } catch (error) {
        console.error("Error in getStateAllotmentDocument:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};