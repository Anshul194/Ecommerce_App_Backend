"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const OrderRouter = express_1.default.Router();
exports.OrderRouter = OrderRouter;
const Order_1 = require("../Controller/Order");
const UserTokevalidation_1 = __importDefault(require("../middleware/UserTokevalidation"));
OrderRouter.post("/order", UserTokevalidation_1.default, Order_1.order);
OrderRouter.get("/orderList", UserTokevalidation_1.default, Order_1.GetAllOrders);
OrderRouter.delete("/Delete-order", UserTokevalidation_1.default, Order_1.CancelOrder);
