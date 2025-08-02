// src/models/index.js
import sequelize from '../utils/database.js';
import User from './User.js';
import Survey from './Survey.js';
import Question from './Question.js';

// Setup associations
User.hasMany(Survey, { foreignKey: "createdBy", as: "surveys" });
Survey.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Survey.hasMany(Question, { foreignKey: "surveyId", as: "questions", onDelete: "CASCADE" });
Question.belongsTo(Survey, { foreignKey: "surveyId", as: "survey" });


// Collect all models
const models = { User, Survey, Question };

export { sequelize };
export default models;
