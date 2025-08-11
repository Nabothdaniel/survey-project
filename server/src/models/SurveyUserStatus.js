import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js"; 

  const SurveyUserStatus = sequelize.define(
    "SurveyUserStatus",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID, // change to DataTypes.INTEGER if users.id is int
        allowNull: false,
      },
      surveyId: {
        type: DataTypes.UUID, // change to DataTypes.INTEGER if surveys.id is int
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("new", "in_progress", "completed"),
        defaultValue: "new",
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "survey_user_status",
      timestamps: true,
    }
  );



export default SurveyUserStatus;
