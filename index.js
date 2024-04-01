"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("./src/Router/admin.route");
const User_route_1 = require("./src/Router/User.route");
const Admin_service_route_1 = require("./src/Router/Admin.service.route");
const Seller_Service_Route_1 = require("./src/Router/Seller.Service.Route");
const Order_Router_1 = require("./src/Router/Order.Router");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.use(upload.array('image'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const Port = 5001;
app.listen(Port, () => {
    console.log('Server is running on port ', Port);
});
app.use('/admin', admin_route_1.router);
app.use('/user', User_route_1.Userrouter);
app.use('/', Admin_service_route_1.AdminServicerouter);
app.use('/', Seller_Service_Route_1.sellerServiceRoute);
app.use('/', Order_Router_1.OrderRouter);
//app.use('/',SellerServicerouter)
