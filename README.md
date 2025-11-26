WalletFlow - Expense Tracker

WalletFlow is a full-stack web application designed to help users track their daily expenses and set financial goals.

Features

User Authentication: Secure signup and login using JWT and Cookies.

Expense Tracking: Add, view, and delete daily expenses.

Goal Setting: Set and manage financial savings goals.

Visual Analytics: Interactive charts to visualize spending habits.

Responsive Design: Works seamlessly on desktop and mobile.

Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript, Chart.js

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JSON Web Tokens (JWT), Bcrypt

Installation

Install Backend Dependencies

cd Backend
npm install


Configure Environment
Create a .env file in the Backend folder:

PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000


Run the App

Start Backend: npm run server (in Backend folder)

Start Frontend: npx serve (in Frontend folder)

Screenshots
