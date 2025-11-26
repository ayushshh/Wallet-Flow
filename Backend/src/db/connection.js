const mongoose = require('mongoose');
const { DB_NAME } = require('../constant.js')

const connectDB = async ()=>{
    try{
        let connectionString = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MongoDB connected !! HOST is ${connectionString.connection.host}`);
    }catch(error){
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1);
    }
}

module.exports = { connectDB };