import { Router } from "express";
import taskController from "../controllers/task";
const router = Router();

router.get("/", taskController.listAll);   
router.get(
  "/:id([0-9]+)",
  taskController.getOneById
);

router.post("/", taskController.newtask);

router.patch(
  "/:id([0-9]+)",
  taskController.edittask
);

router.delete(
  "/:id([0-9]+)",
  taskController.deletetask
);


export default router;