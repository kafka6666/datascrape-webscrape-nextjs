import * as mongoose from "mongoose";


let isConnected = false;

export const connectToDb = async () => {
    mongoose.set('strictQuery', true);

    // check if MONGODB_URI is defined and database is already connected
    if (!process.env.MONGODB_URI) return console.log('MONGODB_URI not defined');
    if (isConnected) return console.log('=> Already connected to MongoDB');

    // connect to database
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('=> Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
}