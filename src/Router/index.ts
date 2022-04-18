import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import paymentsRouter from "./paymentsRouter.js";

const router = Router();

router.use(cardsRouter);
router.use(paymentsRouter);



export default router;