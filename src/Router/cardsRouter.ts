import { Router } from "express";
import * as cardsController from "../Controllers/cardsController.js"
import { validateApiKey } from "../Middlewares/validateApiKey.js";

const cardsRouter = Router();

cardsRouter.post("/cards", validateApiKey, cardsController.createCard)


export default cardsRouter