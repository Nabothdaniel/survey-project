// models/Response.js
import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Response = sequelize.define("Response", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surveyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: "responses",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['surveyId', 'questionId', 'userId']
    }
  ]
});



export default Response;
