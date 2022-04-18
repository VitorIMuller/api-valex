import { NextFunction, Request, Response } from "express";
import activateCardSchema from "../schema/activateCardSchema.js";

export default function validateCreateCard(req: Request, res: Response, next: NextFunction) {
    const validation = activateCardSchema.validate(req.body)
    if (validation.error) return res.sendStatus(404)

    next();
}