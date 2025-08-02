// models/Question.js
import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.ENUM("text", "multiple-choice", "checkbox", "rating", "boolean"),
    allowNull: false 
  },
  options: { 
    type: DataTypes.JSON,
    allowNull: true,
  },
  surveyId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  tableName: "questions",
  timestamps: true,
});

export default Question;
