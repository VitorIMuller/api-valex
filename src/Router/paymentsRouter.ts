import { Router } from "express";
import * as paymentsController from "../Controllers/paymentsController.js"
import * as validatePosSchema from "../Middlewares/validatePosSchema.js"


const paymentsRouter = Router();

paymentsRouter.post("/payment/pos", validatePosSchema.default, paymentsController.posPurchase)

export default paymentsRouter