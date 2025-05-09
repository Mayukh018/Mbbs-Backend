import {getColleges} from '../controllers/listInstitutes.js';
import express from 'express';

const getCollegesRoute = express.Router();
getCollegesRoute.get('/', getColleges);

export default getCollegesRoute;