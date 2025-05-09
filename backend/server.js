import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDb from './db/connectDb.js';
import router from './routes/userRoutes.js';
import collegePredictor from './routes/collegeRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import seniorsRouter from './routes/seniorRoutes.js';
import choices from './routes/choiceRoutes.js';
import videos from './routes/videoRoutes.js';
import plans from './routes/planRoutes.js';
import blogs from './routes/blogRoutes.js';
import contactus from './routes/contactRoutes.js';
import compare from './routes/compareListRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
await connectDb();

app.use('/api/user', router);
app.use('/api/college', collegePredictor);
app.use('/api/content', contentRoutes);
app.use('/api/seniors', seniorsRouter);
app.use('/api/choices', choices);
app.use('/api/videos', videos);
app.use('/api/blogs', blogs);
app.use('/api/plans', plans);
app.use('/api/contact', contactus);
app.use('/api/checkList', compare);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
