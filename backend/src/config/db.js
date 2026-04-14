const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });

        console.log(`\x1b[32m%s\x1b[0m`, `MongoDB Connected: ${conn.connection.host}`);
        process.env.DB_MODE = 'mongodb';
    } catch (err) {
        console.log(`\x1b[33m%s\x1b[0m`, `--- MongoDB Connection Failed ---`);
        console.log(`\x1b[33m%s\x1b[0m`, `Fallback: Starting in Demo Mode (In-Memory)...`);
        console.log(`\x1b[36m%s\x1b[0m`, `Reason: ${err.message}`);
        
        process.env.DB_MODE = 'mock';
    }
};

module.exports = connectDB;
