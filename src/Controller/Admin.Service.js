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
exports.UserList = exports.UserListForApproval = exports.declineUser = exports.approveRequest = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const AdminApproval_1 = require("../EmailSender/AdminApproval");
// approve user
const approveRequest = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const UserId = req.query.id;
        console.log(UserId);
        if (!UserId) {
            res.status(404).json({ message: "Invalid UserId or Not found" });
        }
        const approveuser = yield prisma.user.update({
            where: { id: UserId },
            data: { isadminapproved: true }
        });
        const user = yield prisma.user.findUnique({
            where: { id: UserId },
            select: { email: true },
        });
        if (!user || !user.email) {
            throw new Error('User email not found');
        }
        yield (0, AdminApproval_1.sendRegistrationResponseNotification)(user.email, 'Registration Approved', 'Your registration has been approved by the admin, please login ur account.');
        res.status(200).json({ message: 'User approved successfully' });
    }
    catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}));
exports.approveRequest = approveRequest;
// decline user
const declineUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.id;
        console.log(userId);
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user || !user.email) {
            throw new Error('User email not found');
        }
        yield (0, AdminApproval_1.sendRegistrationResponseNotification)(user.email, 'Registration Declined', 'Your registration has been declined.');
        res.status(400).json({ message: 'User registration declined by admin' });
    }
    catch (error) {
        console.error('Error declining user:', error);
        res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
}));
exports.declineUser = declineUser;
// get list of userregistration request
const UserListForApproval = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    try {
        const count = yield prisma.user.count({
            where: {
                isadminapproved: false
            }
        });
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const list = yield prisma.user.findMany({
            where: {
                isadminapproved: false
            },
            skip: skip,
            take: limit
        });
        if (!list) {
            res.status(400).json({ message: "No request is pending for approval" });
        }
        res.status(200).json({ message: "Users pending to approve :", list, page: page,
            totalPages: totalPages, });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
}));
exports.UserListForApproval = UserListForApproval;
/// users list 
const UserList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    try {
        const count = yield prisma.user.count();
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const list = yield prisma.user.findMany({
            skip: skip,
            take: limit
        });
        if (!list) {
            res.status(400).json({ message: "No User available" });
        }
        res.status(200).json({ message: "Users List :", list, page: page,
            totalPages: totalPages, });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
}));
exports.UserList = UserList;
