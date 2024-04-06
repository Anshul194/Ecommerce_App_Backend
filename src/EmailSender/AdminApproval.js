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
exports.sendRegistrationResponseNotification = exports.sendUserNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "mailer1499@gmail.com",
        pass: "aivd qmxd hhmf xdjv",
    },
});
const sendUserNotification = (UserId, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield prisma.admin.findFirst({ select: { email: true } });
        if (!admin || !admin.email) {
            throw new Error("Admin email not found");
        }
        const adminEmail = admin.email;
        yield transporter.sendMail({
            from: '"Ecommerce-App" <mailer1499@gmail.com>',
            to: adminEmail,
            subject: "New User Registration",
            text: `New user registration from ${UserId}`,
        });
        console.log(`Notification email sent to ${adminEmail} for approval`);
    }
    catch (error) {
        console.error("Error sending email notification:", error);
    }
});
exports.sendUserNotification = sendUserNotification;
const sendRegistrationResponseNotification = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: '"Ecommerce-App" <mailer1499@gmail.com>',
            to: email,
            subject: subject,
            text: message,
        });
        console.log(`Email sent that request approved`);
    }
    catch (error) {
        console.error("Error sending email notification:", error);
    }
});
exports.sendRegistrationResponseNotification = sendRegistrationResponseNotification;
