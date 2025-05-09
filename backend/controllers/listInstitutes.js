import ListOfCollege from "../models/ListOfCollegeModel.js";

export const getColleges = async (req, res) => {
  try {
    const { state, type, sortBy } = req.query;

    const filter = {};
    if (state) filter.state = state;
    if (type) filter.type = type;

    const sort = {};
    if (sortBy === 'cutoff') sort['closingCutoff.yr2023'] = 1;
    else if (sortBy === 'rank') sort.rank = 1;
    else if (sortBy === 'fees') sort.fees = 1;

    const colleges = await ListOfCollege.find(filter).sort(sort);
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};