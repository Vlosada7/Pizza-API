import { Router } from "express";
import * as odererController from "./controllers/odererControllers";
import * as generateDB from "./dataGenerate";

const router = Router();

router.get("/orders", odererController.getAllOrderes);
router.get("/order/:id", odererController.getOrdererId);
router.put("/order", odererController.newOrderer);
router.post("/thank-you", odererController.thankYouEmail);

router.get("/generate", generateDB.generatePizzaAndSalesman);

export default router;