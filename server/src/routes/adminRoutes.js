import express from 'express';

const router = express.Router();

import { signupAdmin, createSurvey, getAdminSurveys, getSurveyOutcomes, deleteSurvey, updateSurvey } from '../controller/adminController.js';
import { authenticateToken } from '../middleware/authenticateMiddlware.js';
import { isAdmin } from '../middleware/isAdminMiddleware.js';


router.post('/create-admin', signupAdmin);
router.post('/create-survey', authenticateToken, isAdmin, createSurvey);
router.get('/get-survey', authenticateToken, isAdmin, getAdminSurveys);
router.get( "/get-survey-outcomes/:surveyId",  authenticateToken,  isAdmin, getSurveyOutcomes);
router.delete('/delete-survey/:id', authenticateToken, isAdmin, deleteSurvey);
router.put('/update-survey/:id', authenticateToken, isAdmin, updateSurvey);

export const adminrouter = router;