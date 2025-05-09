import User from '../models/userModel.js';
import College from '../models/collegeModel.js';


export const getColleges = async (req, res) => {
  try {
      const colleges = await College.find({});
      res.status(200).json({ success: true, colleges });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}


export const createChoiceList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const { listName } = req.body;

    if (!listName) {
      return res.status(400).json({ success: false, message: 'List name is required' });
    }

    const existingLists = user.preferences || [];

    if (existingLists.length >= 1 && !user.services.ChoiceFilling.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Only one choice list is allowed for free. Please upgrade your plan to create more.'
      });
    }

    user.preferences.push({
      listName,
      colleges: []
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Choice list created successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Error creating choice list:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/**
 * Add a college to a user's list
 */
export const addCollegeToList = async (req, res) => {
  const { listName, collegeName } = req.body;
  const user = req.user;
  try {
    const list = user.preferences.find(list => list.listName === listName);
    if (!list) return res.status(404).json({ message: 'List not found' });

    list.colleges.push(collegeName);
    await user.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error adding college', error: err });
  }
};

/**
 * Reorder colleges in a list
 */
export const reorderCollegesInList = async (req, res) => {
  const { listName, fromIndex, toIndex } = req.body;
  const user = req.user;
  try {
    const list = user.preferences.find(list => list.listName === listName);
    if (!list) return res.status(404).json({ message: 'List not found' });

    const [moved] = list.colleges.splice(fromIndex, 1);
    list.colleges.splice(toIndex, 0, moved);
    await user.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error reordering colleges', error: err });
  }
};


export const deleteCollegeFromList = async (req, res) => {
  const { listName, collegeName } = req.body;
  const user = req.user;
  try {
    const list = user.preferences.find(list => list.listName === listName);
    if (!list) return res.status(404).json({ message: 'List not found' });

    list.colleges = list.colleges.filter(college => college !== collegeName);
    await user.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting college', error: err });
  }
};


export const deleteChoiceList = async (req, res) => {
  const {  listName } = req.body;
  const user = req.user;
  try {
    user.preferences = user.preferences.filter(list => list.listName !== listName);
    await user.save();
    res.json(user.preferences);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting list', error: err });
  }
};


export const updateListName = async (req, res) => {
  const { oldName, newName } = req.body;
  const user = req.user;
  try {
    const list = user.preferences.find(list => list.listName === oldName);
    if (!list) return res.status(404).json({ message: 'List not found' });

    list.listName = newName;
    await user.save();
    res.json(user.preferences);
  } catch (err) {
    res.status(500).json({ message: 'Error updating list name', error: err });
  }
};

