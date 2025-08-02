

import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Survey from "../models/Survey.js";
import Question from "../models/Question.js";
import { generateToken } from '../utils/helperfns.js';
import sequelize from '../utils/database.js';



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
        text: q.text,
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








export { signupAdmin, createSurvey,deleteSurvey };
