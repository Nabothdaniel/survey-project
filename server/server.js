import express from "express"
import cors from 'cors';
import dotenv from "dotenv"
import { authRoute } from './src/routes/auth.js'
import { adminrouter } from './src/routes/adminRoutes.js'
import { responseRouter } from "./src/routes/responseRoutes.js";
import sequelize from "./src/utils/database.js";

import './src/models/index.js';

dotenv.config();



const app = express()
const PORT = process.env.PORT || 8000




// Middleware
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:5173",], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}))

//connect db

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB connection failed:', err));




//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/admin', adminrouter);
app.use('/api/v1/response', responseRouter);


app.use('/',(req,res)=>{
  res.status(200).json({msg:"server running as expected"})
})



// Start server
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });