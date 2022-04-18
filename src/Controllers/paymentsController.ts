import { Request, Response } from "express";
import * as paymentsServices from "../services/paymentServices.js"

export async function posPurchase(req: Request, res: Response) {
    const { id, password, idBusiness, amount } = req.body

    await paymentsServices.posPayment(id, password, idBusiness, amount);

    res.sendStatus(200)
}