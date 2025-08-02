// models/Survey.js
import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Survey = sequelize.define("Survey", {
 id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  createdBy: {
  type: DataTypes.UUID,
  allowNull: false,
},

}, {
  tableName: "surveys",
  timestamps: true,
});

export default Survey;
