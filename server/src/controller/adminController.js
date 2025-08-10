

import bcrypt from 'bcrypt';

import { generateToken } from '../utils/helperfns.js';
import sequelize from '../utils/database.js';

import models from "../models/index.js";

const { User, Survey, Question,Response } = models;

const signupAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
    });

    // Generate token
    const token = generateToken(admin);

    // Set auth cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Success response (use id instead of _id for Sequelize)
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating admin account',
      error: error.message,
    });
  }
};



const createSurvey = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { title, description, questions } = req.body;
    const userId = req.user.id; // from auth middleware

    // Step 1: Create survey inside a transaction
    const survey = await Survey.create(
      {
        title,
        description,
        createdBy: userId,
      },
      { transaction: t }
    );

    // Step 2: Create questions (if any)
    if (questions && questions.length > 0) {
      const questionData = questions.map((q) => ({
        text: q.question,
        type: q.type,
        options: q.options || null,
        surveyId: survey.id,
      }));


      await Question.bulkCreate(questionData, { transaction: t });
    }

    // Step 3: Commit the transaction
    await t.commit();

    // Step 4: Fetch survey with questions
    const createdSurvey = await Survey.findByPk(survey.id, {
      include: [{ model: Question, as: "questions" }],
    });

    res.status(201).json({ success: true, survey: createdSurvey });
  } catch (err) {
    // Roll back if anything fails
    await t.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create survey" });
  }
};






const getAdminSurveys = async (req, res) => {
  try {
    const userId = req.user.id;  // comes from auth middleware

    const surveys = await Survey.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: Question,
          as: "questions",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, surveys });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch admin surveys" });
  }
};

const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the survey
    const survey = await Survey.findByPk(id);

    if (!survey) {
      return res.status(404).json({ success: false, message: "Survey not found" });
    }

    // Authorization check: only admin or creator can delete
    if (survey.createdBy !== userId && userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this survey" });
    }

    // Delete survey (questions will be deleted by ON DELETE CASCADE in DB)
    await survey.destroy();

    res.json({ success: true, message: "Survey deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete survey" });
  }
};

const getSurveyOutcomes = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"]
        },
        {
          model: Question,
          as: "questions",
          attributes: ["id", "text", "type", "options"],
          include: [
            {
              model: Response,
              as: "responses",
              include: [
                {
                  model: User,
                  as: "respondent",
                  attributes: ["id", "name", "email"]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!survey) {
      return res.status(404).json({ success: false, message: "Survey not found" });
    }

    const totalSurveyResponses = survey.questions.reduce(
      (sum, q) => sum + q.responses.length,
      0
    );

    const outcomeData = survey.questions.map(question => {
      const totalResponses = question.responses.length;
      const answerCount = {};

      question.responses.forEach(r => {
        const ans = r.answer?.toLowerCase() || "no answer";
        answerCount[ans] = (answerCount[ans] || 0) + 1;
      });

      const percentages = Object.keys(answerCount).map(ans => ({
        answer: ans,
        count: answerCount[ans],
        percentage: ((answerCount[ans] / totalSurveyResponses) * 100).toFixed(2)
      }));

      return {
        questionId: question.id,
        text: question.text,
        type: question.type,
        options: question.options || [],
        totalResponses,
        outcomes: percentages
      };
    });

    res.status(200).json({
      success: true,
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        createdBy: {
          id: survey.creator.id,
          name: survey.creator.name,
          email: survey.creator.email
        }
      },
      totalSurveyResponses,
      questions: outcomeData
    });

  } catch (err) {
    console.error("DEBUG ERROR getSurveyOutcomes:", err);
    res.status(500).json({ success: false, message: "Failed to fetch survey outcomes" });
  }
};



const updateSurvey = async (req, res) => {
  const t = await Survey.sequelize.transaction();
  try {
    const { surveyId } = req.params;
    const { title, description, questions } = req.body;
    const adminId = req.user.id;

    // Check if survey exists & belongs to the admin
    const survey = await Survey.findOne({
      where: { id: surveyId, createdBy: adminId },
      include: [{ model: Question, as: "questions" }]
    });

    if (!survey) {
      return res.status(404).json({ success: false, message: "Survey not found or not authorized" });
    }

    // Update survey if fields are provided
    if (title) survey.title = title;
    if (description) survey.description = description;
    await survey.save({ transaction: t });

    // Handle questions updates
    if (Array.isArray(questions)) {
      for (const q of questions) {
        if (q.id) {
          // Update existing question
          await Question.update(
            {
              text: q.text,
              type: q.type,
              options: q.options || null
            },
            { where: { id: q.id, surveyId: survey.id }, transaction: t }
          );
        } else {
          // Add new question
          await Question.create(
            {
              text: q.text,
              type: q.type,
              options: q.options || null,
              surveyId: survey.id
            },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();

    // Return updated survey with its questions
    const updatedSurvey = await Survey.findByPk(survey.id, {
      include: [{ model: Question, as: "questions" }]
    });

    res.status(200).json({
      success: true,
      message: "Survey updated successfully",
      survey: updatedSurvey
    });

  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update survey" });
  }
};






export { signupAdmin, createSurvey, getAdminSurveys, deleteSurvey, getSurveyOutcomes, updateSurvey };
