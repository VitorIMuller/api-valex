import { NextFunction, Request, Response } from "express";
import posPurchaseSchema from "../schema/posPurchaseSchema.js";

export default function validateSchema(req: Request, res: Response, next: NextFunction) {
    const validation = posPurchaseSchema.validate(req.body)
    if (validation.error) return res.sendStatus(404)

    next();
}