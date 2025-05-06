import User from '../models/userModel.js';

export const createChoiceList = async (req, res) => {
  const { listName } = req.body;
  const user = req.user;
  try {
    user.preferences.push({ listName, colleges: [] });
    await user.save();
    res.status(201).json(user.preferences);
  } catch (err) {
    res.status(500).json({ message: 'Error creating list', error: err });
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

