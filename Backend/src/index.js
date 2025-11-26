const dotenv = require('dotenv');
const  { connectDB }  = require('./db/connection.js');
const app = require('./app.js');

dotenv.config({
    path: "./.env"
})
//here one thing here server.on is for checking server error
connectDB()
.then(() => {
    let server = app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    server.on("error", (err) => {
        console.error("Server error:", err);
        throw err;
    })
})
//and this catch is for db error while connecting for database if any  error ocurred then catch will send error
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
})