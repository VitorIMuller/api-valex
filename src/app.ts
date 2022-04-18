import express, { json } from "express";
import "express-async-errors"
import cors from "cors"
import dotenv from "dotenv"
import router from "./Router/index.js";
import errorMiddleware from "./Middlewares/errorMiddleware.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router)
app.use(errorMiddleware)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on: ${PORT}`))