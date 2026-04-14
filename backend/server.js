const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

const path = require('path');

// Load env vars from the same directory as server.js
dotenv.config({ path: path.join(__dirname, '.env') });

async function startServer() {
    // Connect to database (sets DB_MODE)
    await connectDB();
    
    const app = require('./src/app');
    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
}

startServer();
