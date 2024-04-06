"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServicerouter = void 0;
const express_1 = __importDefault(require("express"));
const AdminServicerouter = express_1.default.Router();
exports.AdminServicerouter = AdminServicerouter;
const Admin_Service_1 = require("../Controller/Admin.Service");
AdminServicerouter.patch("/approveUser", Admin_Service_1.approveRequest);
AdminServicerouter.patch("/declineUser", Admin_Service_1.declineUser);
AdminServicerouter.get("/pendingApproval", Admin_Service_1.UserListForApproval);
AdminServicerouter.get("/list", Admin_Service_1.UserList);
