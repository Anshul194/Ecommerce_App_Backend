"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Userrouter = void 0;
const express_1 = __importDefault(require("express"));
const Userrouter = express_1.default.Router();
exports.Userrouter = Userrouter;
const User_Controller_1 = require("../Controller/User.Controller");
Userrouter.post("/register", User_Controller_1.Register);
Userrouter.post("/login", User_Controller_1.Login);
