import { Request, Response } from "express";
import * as paymentsServices from "../services/paymentServices.js"

export async function posPurchase(req: Request, res: Response) {
    const { cardId, password, idBussines, amounth } = req.body

    await paymentsServices.posPayment(cardId, password, idBussines, amounth);

    res.sendStatus(200)
}