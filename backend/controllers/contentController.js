import File from "../models/contentModel.js";
import User from "../models/userModel.js";

// Create file
export const createFile = async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createMultipleFiles = async (req, res) => {
    try {
      // Validate input is an array
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Expected an array of files' });
      }
  
      // Optional: Limit batch size for performance
      const MAX_BATCH_SIZE = 100;
      if (req.body.length > MAX_BATCH_SIZE) {
        return res.status(413).json({ 
          error: `Maximum ${MAX_BATCH_SIZE} files per request` 
        });
      }
  
      // Insert all files with validation
      const files = await File.insertMany(req.body, { ordered: false });
      
      res.status(201).json({
        success: true,
        count: files.length,
        files: files
      });
    } catch (error) {
      // Handle partial success cases
      if (error.writeErrors) {
        const insertedIds = error.insertedIds.map(id => id.toString());
        return res.status(207).json({ // 207 Multi-Status
          success: 'partial',
          insertedCount: insertedIds.length,
          insertedIds,
          errors: error.writeErrors.map(e => ({
            index: e.index,
            error: e.errmsg
          }))
        });
      }
      res.status(400).json({ error: error.message });
    }
  };
  

// Get all files with filters
export const getFiles = async (req, res) => {
    try {
      const {
        title, year, aiq, state, yearWise, catWise, sort
      } = req.query;
  
      const user = await User.findById(req.user._id); // fresh data from DB
  
      const query = {};
  
      // Only non-premium files for non-premium users
      if (!user?.services?.premiumContent?.isActive) {
        query.isPremium = false;
      }
  
      if (title) query.title = { $regex: title, $options: 'i' };
      if (year) query.year = parseInt(year);
  
      // Category filters
      if (aiq || state || yearWise || catWise) {
        query.$or = [
          ...(aiq === 'true' ? [{ 'categories.aiq': true }] : []),
          ...(state === 'true' ? [{ 'categories.state': true }] : []),
          ...(yearWise === 'true' ? [{ 'categories.yearWise': true }] : []),
          ...(catWise === 'true' ? [{ 'categories.catWise': true }] : [])
        ];
      }
  
      // Sorting
      let sortOption = { createdAt: -1 };
      if (sort === 'yearWise') sortOption = { year: -1 };
      if (sort === 'title') sortOption = { title: 1 };
  
      const files = await File.find(query).sort(sortOption);
      res.json(files);
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Get single file
export const getFile = async (req, res) => {
  try {
    const isPremium = req.user.services.premiumContent || false;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (!isPremium && !file.isPremium) {
        return res.status(403).json({ 
          error: 'Premium content. Upgrade your account to access this file.' 
        });
      }
      
      res.json(file);
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update file
export const updateFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};