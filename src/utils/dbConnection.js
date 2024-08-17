import mongoose from 'mongoose';

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI
      );
    isConnected = true;
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

export default dbConnect;
