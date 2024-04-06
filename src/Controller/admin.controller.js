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
exports.Login = exports.Register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_Validation_1 = require("../validations/admin.Validation");
const SuccesResponse_1 = __importDefault(require("../SuccesResponse"));
const prisma = new client_1.PrismaClient();
// Register a user
const Register = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("body data ", req.body);
    const { error, value } = admin_Validation_1.adminRegistrationSchema.validate(req.body);
    console.log(value);
    if (error) {
        console.error("Validation error:", error);
        res.status(400).json({ error: error.message });
        return;
    }
    if (!value) {
        console.log("Value is undefined");
        res.status(400).json({ error: "Request body is missing or invalid" });
        return;
    }
    try {
        const { UserName, email, password } = value;
        console.log(value);
        const hashedpassword = yield bcrypt_1.default.hash(password, 10);
        console.log(hashedpassword);
        const newAdmin = yield prisma.admin.create({
            data: {
                UserName,
                email,
                password: hashedpassword,
            },
        });
        if (newAdmin) {
            SuccesResponse_1.default.sendSuccessResponse(res, "Admin registered Successfully");
            return;
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
        return;
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.Register = Register;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are mandatory" });
            return;
        }
        const admin = yield prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            res.status(404).json({ message: "Invalid email or password" });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({
            admin: {
                id: admin.id,
                email: admin.email,
                isAdminToken: true,
            },
        }, process.env.Access_Token_Secret || "", { expiresIn: "30m" });
        SuccesResponse_1.default.sendSuccessResponse(res, "Login successful", {
            accessToken,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
});
exports.Login = Login;
