import College from '../models/collegeModel.js';
import User from '../models/userModel.js';

export const addCollege = async (req, res) => {
  try {
    const {
      course,
      college_type,
      name,
      state,
      quota,
      establishedYear,
      airportCity,
      nearestAirport,
      year,
      category,
      round,
      rank,
      marks,
      seatsAvailable,
      fees
    } = req.body;

    // Required fields check
    if (!name) {
      return res.status(400).json({
        success: false,
        message:  'name is required field.'
      });
    }

    const newCollege = new College({
      course,
      college_type,
      name,
      state,
      quota,
      establishedYear,
      airportCity,
      nearestAirport,
      year,
      category,
      round,
      rank,
      marks,
      seatsAvailable,
      fees
    });

    await newCollege.save();

    return res.status(201).json({
      success: true,
      message: 'College added successfully',
      data: newCollege
    });

  } catch (error) {
    console.error('Error adding college:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const predictColleges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const { inputType, value, course, category, state } = req.body;

    // Check that rank or marks is provided
    if (!inputType || !value) {
      return res.status(400).json({
        success: false,
        message: 'Please provide inputType ("marks" or "rank") and a corresponding value.'
      });
    }

    const query = {};

    // Apply marks or rank filter
    if (inputType === 'marks') {
      query.marks = { $lte: Number(value) };
    } else if (inputType === 'rank') {
      query.rank = { $gte: Number(value) };
    } else {
      return res.status(400).json({
        success: false,
        message: 'inputType must be either "marks" or "rank".'
      });
    }

    // Optional filters
    if (course) {
      query.course = course;
    }

    if (category) {
      query.category = category;
    }

    if (state) {
      query.state = new RegExp(state, 'i'); // case-insensitive state filter
    }

    const matchingColleges = await College.find(query)
      .select('name course category state rank marks seatsAvailable fees')
      .sort({ rank: 1 })
      .limit(20)
      .lean();

    // Save the result in user's previousResults
    user.services.collegePredictor.previousResults = user.services.collegePredictor.previousResults || [];
    user.services.collegePredictor.previousResults.push({
      colleges: matchingColleges,
      filters: req.body,
      timestamp: new Date()
    });

    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        colleges: matchingColleges
      }
    });

  } catch (error) {
    console.error('Error in predictColleges:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const previousResults = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. User ID not found.'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const previousResults = user.services?.collegePredictor?.previousResults || [];

    if (!previousResults.length) {
      return res.status(404).json({
        success: false,
        message: 'No previous result found.'
      });
    }

    // Return the latest one based on creation time (or last pushed)
    const latestResult = previousResults[previousResults.length - 1];

    return res.status(200).json({
      success: true,
      data: latestResult
    });

  } catch (error) {
    console.error('Error fetching previous result:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch the previous result',
      error: error.message
    });
  }
};
