import { NextFunction, Request, Response } from "express";
import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"


export async function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const types = ['groceries', 'restaurants', 'transport', 'education', 'health']
    if (!req.body.id || !req.body.type) return res.sendStatus(404)
    const apiKey = await companyRepository.findByApiKey(req.headers.authorization)
    if (!apiKey) return res.sendStatus(401);

    const verifyIdEmployee = await employeeRepository.findById(req.body.id)
    if (!verifyIdEmployee) return res.sendStatus(404)

    if (!types.find(type => type === req.body.type)) return res.sendStatus(401)
    next();
}