import { NextFunction, Request, Response } from "express";

const errorTable = {
    Bad_Request: 400,
    Unauthorized: 401,
    Unprocessable_Entity: 422,
    Not_Found: 404,
    Conflict: 409
}

export default function errorMiddleware(error, req: Request, res: Response, next: NextFunction) {
    if (!error.message) {
        error.message = "An error as occurred"
    }

    if (!errorTable[error.type]) {
        return res.sendStatus(500)
    }

    return res.status(errorTable[error.type]).send(error.message);
}