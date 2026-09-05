const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
    
    // Attempt standard connection
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000 // fail quick if local mongo is not running so we can fallback
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to primary MongoDB at ${process.env.MONGODB_URI}: ${error.message}`);
    console.log('[MongoDB] Attempting to start in-memory MongoDB fallback for smooth local testing...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB] Running on In-Memory MongoDB instance at: ${uri}`);
    } catch (fallbackError) {
      console.error('[MongoDB Error] Could not connect to MongoDB:', fallbackError.message);
      console.error('Please make sure MongoDB is running or provide a valid MONGODB_URI in backend/.env');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
