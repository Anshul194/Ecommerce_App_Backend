import express, { Router } from "express";
const OrderRouter = express.Router();
import { order, GetAllOrders, CancelOrder } from "../Controller/Order";
import validateUser from "../middleware/UserTokevalidation";

OrderRouter.post("/order", validateUser, order);
OrderRouter.get("/orderList", validateUser, GetAllOrders);
OrderRouter.delete("/Delete-order", validateUser, CancelOrder);

export { OrderRouter };
