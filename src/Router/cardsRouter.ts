import { Router } from "express";
import * as cardsController from "../Controllers/cardsController.js"

const cardsRouter = Router();

cardsRouter.post("/cards", cardsController.createCard);

cardsRouter.put("/card/:id/activate", cardsController.activateCard);

cardsRouter.get("/card/:id/transitions", cardsController.getTransactionsRechargesAndAmounth)

cardsRouter.post("/card/:id/recharge", cardsController.recharge)

export default cardsRouter