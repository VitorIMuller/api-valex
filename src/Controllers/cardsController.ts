import { Request, Response } from "express";
import * as cardsServices from "../services/cardsServices.js";

export async function createCard(req: Request, res: Response) {
    const key = req.headers['x-api-key']
    const apiKey = key as string;
    const sucess = await cardsServices.createCard(apiKey, req.body.id, req.body.type)

    res.sendStatus(201)

}

export async function recharge(req: Request, res: Response) {
    const idCard = req.params.id
    const key = req.headers['x-api-key']
    const apiKey = key as string;
    const { value } = req.body

    await cardsServices.rechargeCard(apiKey, parseInt(idCard), value)

    res.sendStatus(200)
}

export async function activateCard(req: Request, res: Response) {
    const id = req.params.id
    const { CVC, password } = req.body
    const idCard = parseInt(id)

    const update = await cardsServices.activateCard(idCard, CVC, password)
    if (update === null) res.sendStatus(501)
    res.sendStatus(204)

}

export async function getTransactionsRechargesAndAmounth(req: Request, res: Response) {
    const { id } = req.params

    const verifyCardExistence = await cardsServices.findCardById(parseInt(id))
    if (verifyCardExistence === null) res.sendStatus(400)

    const historic = await cardsServices.getHistoric(parseInt(id))

    res.send(historic)
}