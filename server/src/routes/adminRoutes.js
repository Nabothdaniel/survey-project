import express from 'express';

const router = express.Router();

import { signupAdmin,createSurvey,deleteSurvey } from '../controller/adminController.js';
import { authenticateToken} from '../middleware/authenticateMiddlware.js';
import {isAdmin} from '../middleware/isAdminMiddleware.js';


router.post('/create-admin', authenticateToken, isAdmin, signupAdmin);
router.post('/create-survey', authenticateToken, isAdmin, createSurvey);
router.delete('/delete-survey/:id', authenticateToken, isAdmin, deleteSurvey);

export const adminrouter = router;