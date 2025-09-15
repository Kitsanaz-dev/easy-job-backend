import express from "express";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

const app = express();

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.json({
        message: "Hello World",
        success: true,
        status: 200
    });
})

export default app;
