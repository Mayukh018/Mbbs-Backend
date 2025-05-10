import mongoose from "mongoose";
import Sheet from "../models/sheetModel.js";

// Create Blank Sheet
export const createSheet = async (req, res) => {
  try {
    const { sheeturl } = req.body;

    const newSheet = new Sheet({
      sheetURL: sheeturl,
      userId: null,
    });

    await newSheet.save();

    res.status(201).json({ created: true, error: "" });
  } catch (error) {
    res.status(500).json({ created: false, error: error.message });
  }
};

// Assign Sheet to User
export const assignSheet = async (req, res) => {
  try {
    const { userid } = req.body;

    if (mongoose.Types.ObjectId.isValid(userid)) {
      await Sheet.findOneAndUpdate(
        { userId: null },
        { userId: mongoose.Types.ObjectId(userid) }
      );
      res.status(200).json({ updated: true, error: "" });
    }
    res.status(400).json({ updated: false, error: "User ID not valid!" });
  } catch (error) {
    res.status(500).json({ updated: false, error: error.message });
  }
};

// Get Sheet by User ID
export const getSheet = async (req, res) => {
  try {
    const { userid } = req.params;

    const sheet = await Sheet.findOne({
      userId: mongoose.Types.ObjectId(userid),
    });

    if (sheet) {
      res.status(201).json({ sheet: sheet, error: "" });
    }

    res.status(404).json({ sheet: null, error: "Sheet not found!" });
  } catch (error) {
    res.status(500).json({ sheet: null, error: error.message });
  }
};

// Deassign Sheet
export const deassignSheet = async (req, res) => {
  try {
    const { sheetid } = req.params;

    await Sheet.findByIdAndUpdate(sheetid, { userId: null });

    res.status(201).json({ updated: true, error: "" });
  } catch (error) {
    res.status(500).json({ updated: false, error: error.message });
  }
};

// Deassign All Sheets
export const deassignAllSheet = async (req, res) => {
  try {
    await Sheet.updateMany({}, { userId: null });

    res.status(201).json({ updated: true, error: "" });
  } catch (error) {
    res.status(500).json({ updated: false, error: error.message });
  }
};