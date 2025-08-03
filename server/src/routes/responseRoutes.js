import express from 'express'
const router = express.Router();


import { authenticateToken } from '../middleware/authenticateMiddlware.js';
import {respondToSurvey } from '../controller/responseController.js'



router.post('/respond', authenticateToken, respondToSurvey);


export const responseRouter = router;
