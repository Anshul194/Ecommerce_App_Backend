"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object({
    id: joi_1.default.string(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    mobile: joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
    city: joi_1.default.string(),
});
exports.userSchema = userSchema;
