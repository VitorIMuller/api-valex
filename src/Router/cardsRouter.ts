import { Router } from "express";
import * as cardsController from "../Controllers/cardsController.js"
import * as validateActiveCard from "../Middlewares/validateActiveCard.js"
import validateRechargeSchema from "../Middlewares/validateRechargeSchema.js";

const cardsRouter = Router();

cardsRouter.post("/cards", cardsController.createCard);

cardsRouter.put("/card/:id/activate", validateActiveCard.default, cardsController.activateCard);

cardsRouter.get("/card/:id/transitions", cardsController.getTransactionsRechargesAndAmounth)

cardsRouter.post("/card/:id/recharge", validateRechargeSchema, cardsController.recharge)

export default cardsRouter