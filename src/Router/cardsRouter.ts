import { Router } from "express";
import * as cardsController from "../Controllers/cardsController.js"

const cardsRouter = Router();

cardsRouter.post("/cards", cardsController.createCard)


export default cardsRouter