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
exports.orderStatusMail = exports.SendOrderConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "mailer1499@gmail.com",
        pass: "aivd qmxd hhmf xdjv",
    },
});
const SendOrderConfirmationEmail = (sellerEmail, UserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: '"Ecommerce-App" <mailer1499@gmail.com>',
            to: sellerEmail,
            subject: "Order Approval Request",
            text: `Orderr placed from ${UserId} , please go on further process`,
        });
        console.log(`Notification email sent to ${sellerEmail} for approval`);
    }
    catch (error) {
        console.error("Error sending email notification:", error);
    }
});
exports.SendOrderConfirmationEmail = SendOrderConfirmationEmail;
const orderStatusMail = (userEmail, subject, task) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: '"Ecommerce-App" <mailer1499@gmail.com>',
            to: userEmail,
            subject: subject,
            text: task,
        });
        console.log(`Notification email sent to ${userEmail}, Your order has been confirmed`);
    }
    catch (error) {
        console.error("Error sending email notification:", error);
    }
});
exports.orderStatusMail = orderStatusMail;
