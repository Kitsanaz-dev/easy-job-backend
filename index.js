import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT ?? 3000;

connectDB();

app.listen(PORT, () => {
    console.log("Server is running...");
});