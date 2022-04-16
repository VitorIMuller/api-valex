import { Request, Response } from "express";
import * as cardsServices from "../services/cardsServices.js";

export async function createCard(req: Request, res: Response) {
    //colocar um schema
    const types = ['groceries', 'restaurants', 'transport', 'education', 'health'];
    if (!req.body.id || !req.body.type || !req.headers.authorization) return res.sendStatus(404);
    if (!types.find(type => type === req.body.type)) return res.sendStatus(401);

    const sucess = await cardsServices.createCard(req.headers.authorization, req.body.id, req.body.type)
    if (sucess === null) return res.sendStatus(401);

    res.sendStatus(201)

}