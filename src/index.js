import  express  from "express";
import { envs } from "./config/env.js";
import bookRouter from '../src/routes/book.routes.js'
import mongoose from "mongoose";
import morgan from "morgan";

const app=express()



app.use(express.urlencoded({extended :true}))
app.use(express.json())
app.use(morgan('dev'))
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_DB_NAME})
const db=mongoose.connection

app.use('/api', bookRouter);

app.listen(envs.port, () => {
    console.log(`Server started on port ${envs.port}`);
});

export default app