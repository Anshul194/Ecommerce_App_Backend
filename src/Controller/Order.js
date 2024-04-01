"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelOrder = exports.GetAllOrders = exports.order = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = require("@prisma/client");
const Order_Status_email_1 = require("../EmailSender/Order.Status.email");
const prisma = new client_1.PrismaClient();
const order = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.user.id;
        const orderItems = req.body.orderItems;
        if (!orderItems || orderItems.length === 0) {
            res.status(400).json({ error: 'Invalid order items.' });
            return;
        }
        const orders = [];
        for (const item of orderItems) {
            const { productId, quantity } = item;
            if (!productId || !quantity || quantity <= 0) {
                res.status(400).json({ error: 'Invalid product ID or quantity.' });
                return;
            }
            const product = yield prisma.product.findUnique({
                where: { id: productId }
            });
            if (!product) {
                res.status(404).json({ error: `Product with ID ${productId} not found.` });
                return;
            }
            if (product.quantity < quantity) {
                res.status(400).json({ error: `Insufficient quantity available for product with ID ${productId}.` });
                return;
            }
            const newOrder = yield prisma.order.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: quantity
                }
            });
            orders.push(newOrder);
            const ownerId = product.userId;
            const userData = yield prisma.user.findUnique({
                where: { id: ownerId }
            });
            if (userData) {
                const sellerEmail = userData.email;
                yield (0, Order_Status_email_1.SendOrderConfirmationEmail)(sellerEmail, userId);
            }
        }
        res.status(201).json({ message: 'Orders placed but pendinf for approval.', orders });
    }
    catch (error) {
        next(error);
    }
}));
exports.order = order;
const GetAllOrders = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    try {
        const count = yield prisma.order.count();
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const getAll = yield prisma.order.findMany({
            where: {
                userId: userId
            },
            include: {
                product: true,
            },
            skip: skip,
            take: limit
        });
        res.status(200).json({ message: "List of Orders are :", getAll, page: page,
            totalPages: totalPages });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));
exports.GetAllOrders = GetAllOrders;
const CancelOrder = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.user.id;
        const orderId = req.query;
        const getAll = yield prisma.order.delete({
            where: {
                id: orderId,
            }
        });
        res.status(200).json({ message: "List of Orders are :", getAll });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));
exports.CancelOrder = CancelOrder;
