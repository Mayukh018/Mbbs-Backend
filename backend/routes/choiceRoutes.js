import express from 'express';
import { createChoiceList,addCollegeToList,deleteChoiceList,deleteCollegeFromList,updateListName,reorderCollegesInList  } from '../controllers/choiceController.js';
import { userAuth } from '../middlewares/auth.js';

const choices = express.Router();

choices.post('/create',userAuth, createChoiceList);
choices.post('/add',userAuth, addCollegeToList);
choices.post('/reorder',userAuth, reorderCollegesInList);
choices.delete('/delete-college',userAuth, deleteCollegeFromList);
choices.delete('/delete-list',userAuth, deleteChoiceList);
choices.put('/update-list-name',userAuth, updateListName);

export default choices;