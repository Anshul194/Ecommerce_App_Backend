"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const adminRegistrationSchema = joi_1.default.object({
    UserName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default
        .string()
        .regex(/^[a-zA-Z0-9]{6,30}$/)
        .required(),
});
exports.adminRegistrationSchema = adminRegistrationSchema;
