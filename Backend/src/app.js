const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/error.middleware.js'); // Import this!

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true // This allows cookies to be sent back and forth
}));

// Routes Import 
const userRoutes = require('./routes/user.routes.js');
const goalsRoutes = require('./routes/goals.routes.js');
const expenseRoutes = require('./routes/expense.routes.js');

// Routes Declaration
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/goals', goalsRoutes);
app.use('/api/v1/expense', expenseRoutes);

app.use(errorHandler); 

module.exports = app;