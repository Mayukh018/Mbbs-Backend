import { google } from 'googleapis';
import User from '../models/userModel.js';
import Sheet from '../models/sheetModel.js';


const extractSheetId = (sheetUrl) => {
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };
export const compareWithSavedChoices = async (req, res) => {
  try {
    const userId = req.user._id;
    const { parsedChoices, listName } = req.body;

    // Input validation
    if (!Array.isArray(parsedChoices) || parsedChoices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'parsedChoices must be a non-empty array',
      });
    }

    // Fetch user's saved preferences
    const user = await User.findById(userId).select('preferences');
    if (!user?.preferences?.length) {
      return res.status(404).json({
        success: false,
        message: 'No saved preferences found',
      });
    }

    // Determine which preference list to use
    const preference = listName
      ? user.preferences.find(p => p.listName === listName)
      : user.preferences.at(-1); // Use the latest one if no listName provided

    if (!preference || !preference.colleges?.length) {
      return res.status(404).json({
        success: false,
        message: listName
          ? `No preference list found with name "${listName}"`
          : 'No valid saved preferences available',
      });
    }

    const savedSet = new Set(
      preference.colleges.map(c => c.trim().toLowerCase())
    );

    // Normalize parsedChoices once
    const parsedNormalized = parsedChoices.map(c => c.trim().toLowerCase());

    const matches = [];
    const notMatched = [];

    parsedChoices.forEach((originalChoice, index) => {
      const normalized = parsedNormalized[index];
      if (savedSet.has(normalized)) {
        matches.push(originalChoice);
      } else {
        notMatched.push(originalChoice);
      }
    });

    res.json({ success: true, matches, notMatched });
  } catch (error) {
    console.error('Saved choices comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Compare with Counselor Google Sheet
export const compareWithCounselorSheet = async (req, res) => {
    try {
      const userId = req.user._id;
      const { parsedChoices } = req.body;
  
      if (!Array.isArray(parsedChoices)) {
        return res.status(400).json({ success: false, message: 'parsedChoices must be an array' });
      }
  
      const counselorListId = await Sheet.findOne({ userId }).select('sheetURL');
      if (!counselorListId?.sheetURL) {
        return res.status(404).json({ success: false, message: 'No Google Sheet URL found for counselor' });
      }
  
      // Extract Sheet ID
      const sheetId = extractSheetId(counselorListId.sheetURL);
      if (!sheetId) {
        return res.status(400).json({ success: false, message: 'Invalid Google Sheet URL format' });
      }
  
      // Authenticate with Google Sheets API
      const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
      const sheets = google.sheets({ version: 'v4', auth });
  
      const response = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetId,
        range: 'Sheet1!A:C', 
      });
  
      if (!response.data.values) {
        return res.status(404).json({ success: false, message: 'No data found in counselor sheet' });
      }
  
      const counselorChoices = response.data.values.flat();
      const counselorSet = new Set(counselorChoices.map(c => c.toLowerCase()));
  
      const matches = parsedChoices.filter(choice =>
        counselorSet.has(choice.toLowerCase())
      );
      const notMatched = parsedChoices.filter(choice =>
        !counselorSet.has(choice.toLowerCase())
      );
  
      res.json({ success: true, matches, notMatched });
    } catch (error) {
      console.error('Counselor sheet comparison error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to compare with counselor sheet',
        error: error.message
      });
    }
  };