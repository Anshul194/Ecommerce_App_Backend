"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
const admin_controller_1 = require("../Controller/admin.controller");
router.post('/register', admin_controller_1.Register);
router.post('/login', admin_controller_1.Login);
