import { NextFunction, Request, Response } from "express";
import createCardSchema from "../schema/createCardSchema.js";

export default function validateCreateCard(req: Request, res: Response, next: NextFunction) {
    const types = ['groceries', 'restaurants', 'transport', 'education', 'health'];
    const validation = createCardSchema.validate(req.body)
    if (validation.error) return res.sendStatus(404)
    if (!req.headers['x-api-key']) return res.sendStatus(404);
    if (!types.find(type => type === req.body.type)) return res.sendStatus(401);

    next();
}