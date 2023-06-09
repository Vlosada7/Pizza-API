import { Router } from "express";
import * as odererController from "./controllers/odererControllers";

const router = Router();

router.get("/orders", odererController.getAllOrderes);
router.get("/order/:id", odererController.getOrdererId);
router.put("/order", odererController.newOrderer);
router.post("/thank-you", odererController.thankYouEmail);

export default router;
