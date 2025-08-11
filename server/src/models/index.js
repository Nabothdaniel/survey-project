// src/models/index.js
import sequelize from '../utils/database.js';
import User from './User.js';
import Survey from './Survey.js';
import Question from './Question.js';
import Response from './Response.js';
import SurveyUserStatus from './SurveyUserStatus.js';

// ======================
// associations
// ======================

// User → Survey
User.hasMany(Survey, { foreignKey: "createdBy", as: "surveys" });
Survey.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Survey → Question
Survey.hasMany(Question, { foreignKey: "surveyId", as: "questions", onDelete: "CASCADE" });
Question.belongsTo(Survey, { foreignKey: "surveyId", as: "survey" });

// Survey → Response
Survey.hasMany(Response, { foreignKey: "surveyId", as: "surveyResponses", onDelete: "CASCADE" });
Response.belongsTo(Survey, { foreignKey: "surveyId", as: "survey" });

// Question → Response
Question.hasMany(Response, { foreignKey: "questionId", as: "responses", onDelete: "CASCADE" });
Response.belongsTo(Question, { foreignKey: "questionId", as: "question" });

// User → Response (the respondent)
User.hasMany(Response, { foreignKey: "userId", as: "userResponses", onDelete: "CASCADE" });
Response.belongsTo(User, { foreignKey: "userId", as: "respondent" });

// ======================
// SurveyUserStatus associations
// ======================
User.hasMany(SurveyUserStatus, { foreignKey: "userId", as: "surveyStatuses", onDelete: "CASCADE" });
SurveyUserStatus.belongsTo(User, { foreignKey: "userId", as: "user" });

Survey.hasMany(SurveyUserStatus, { foreignKey: "surveyId", as: "userStatuses", onDelete: "CASCADE" });
SurveyUserStatus.belongsTo(Survey, { foreignKey: "surveyId", as: "survey" });

// ======================
// Collect all models
// ======================
const models = { User, Survey, Question, Response, SurveyUserStatus };

export { sequelize };
export default models;
