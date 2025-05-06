import express from 'express';
import {
    getFile,
    getFiles,
    createFile,
    updateFile,
    deleteFile,
    createMultipleFiles,
} from '../controllers/contentController.js';
import { processPayment } from '../controllers/paymentController.js';
import { userAuth } from '../middlewares/auth.js';

const contentRoutes = express.Router();

// Content management routes (admin-only)
contentRoutes.post('/add', createFile);
contentRoutes.post('/addMany', createMultipleFiles);
contentRoutes.put('/:id', updateFile);
contentRoutes.delete('/:id', deleteFile);

// Protected content access routes
contentRoutes.get(
    '/',
    userAuth,
    getFiles
);

contentRoutes.get(
    '/:id',
    userAuth,
    getFile
);

contentRoutes.post(
    '/purchase',
    userAuth,
    processPayment
);

export default contentRoutes;