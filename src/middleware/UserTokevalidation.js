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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const validateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || (Array.isArray(authHeader) && !authHeader[0].startsWith("Bearer"))) {
        res.status(401).json({ message: "Unauthorized Token not provided" });
        return;
    }
    if (Array.isArray(authHeader)) {
        authHeader = authHeader[0]; // Take the first element if it's an array
    }
    token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.Access_Token_Secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({ message: "Unauthorized Invalid token" });
        }
        if (!decoded.user || !decoded.user.isUserToken) {
            return res.status(403).json({ message: "Invalid user token" });
        }
        try {
            const user = yield prisma.user.findUnique({ where: { id: decoded.user.id } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // console.log("hjh", user.status)
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }));
}));
exports.default = validateUser;
