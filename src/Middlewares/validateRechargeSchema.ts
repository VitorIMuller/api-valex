import { NextFunction, Request, Response } from "express";
import rechargeSchema from "../schema/rechargeSchema.js";

export default function validateRechargeSchema(req: Request, res: Response, next: NextFunction) {
    const validation = rechargeSchema.validate(req.body)
    if (validation.error) return res.sendStatus(404)

    next();
}