import { Router, Request, Response } from "express";
import task from "./task";

const routes = Router();

routes.use("/", task);
export default routes;