// models/Response.js
import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";


const Response = sequelize.define("Response", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    answer: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
}, {
    tableName: "responses",
    timestamps: true,
});



export default Response;
