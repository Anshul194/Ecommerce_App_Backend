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
exports.filter = exports.GetOrdersByStatus = exports.declineorderConfirmation = exports.orderConfirmation = exports.UpdateProduct = exports.deleteProduct = exports.deleteCategory = exports.updatecategory = exports.GetCategoryList = exports.AddCategory = exports.GetAllproducts = exports.AddProductImage = exports.AddPrduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = require("@prisma/client");
const cloudinary_1 = require("cloudinary");
const Product_validation_1 = require("../validations/Product.validation");
const Order_Status_email_1 = require("../EmailSender/Order.Status.email");
const SuccesResponse_1 = __importDefault(require("../SuccesResponse"));
const prisma = new client_1.PrismaClient();
cloudinary_1.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});
const AddCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = yield prisma.category.create({
            data: {
                name,
            },
        });
        SuccesResponse_1.default.sendSuccessResponse(res, " Category Added Successfully", {
            category,
        });
    }
    catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.AddCategory = AddCategory;
const GetCategoryList = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    try {
        const count = yield prisma.category.count();
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const list = yield prisma.category.findMany({ skip: skip, take: limit });
        SuccesResponse_1.default.sendSuccessResponse(res, "List of category is :", {
            list,
            page: page,
            totalPages: totalPages,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.GetCategoryList = GetCategoryList;
const updatecategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.query.categoryId;
        const { categoryName } = req.body;
        if (!categoryId) {
            res.status(404).json({ message: "Invalid id or Category Not found" });
        }
        const update = yield prisma.category.update({
            where: { id: categoryId },
            data: { name: categoryName },
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "Updated successfully", {
            update,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.updatecategory = updatecategory;
const deleteCategory = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.query.categoryId;
        if (!categoryId) {
            res.status(404).json({ message: "Invalid id or Category Not found" });
        }
        const productsWithCategory = yield prisma.product.findMany({
            where: {
                categoryId: categoryId,
            },
        });
        if (productsWithCategory.length > 0) {
            res
                .status(400)
                .json({ message: "Cannot delete category with associated products" });
        }
        const deletedCategory = yield prisma.category.delete({
            where: { id: categoryId },
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "Category deleted successfully", {
            deletedCategory,
        });
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.deleteCategory = deleteCategory;
const AddPrduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.user.id;
        const { error, value } = Product_validation_1.productSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "Error in validation", error });
        }
        const { name, description, price, categoryId, quantity, brand } = value;
        const category = yield prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });
        if (!category) {
            res.status(400).json({ message: "Category not found" });
        }
        const newProduct = yield prisma.product.create({
            data: {
                name,
                description,
                price,
                categoryId,
                quantity,
                userId: user,
                brand,
            },
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "Product Added Successfully", {
            newProduct,
        });
    }
    catch (error) {
        console.error("Error adding product:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.AddPrduct = AddPrduct;
const UpdateProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.query.productId;
        console.log(productId);
        const { error, value } = Product_validation_1.productSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "Error in validation", error });
            return;
        }
        const { name, description, price, categoryId, quantity, brand } = value;
        const existingProduct = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!existingProduct) {
            res.status(404).json({ message: "Product not found" });
        }
        if (categoryId) {
            const category = yield prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });
            if (!category) {
                res.status(400).json({ message: "Category not found" });
            }
        }
        const updatedProduct = yield prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price,
                categoryId,
                quantity,
                brand,
            },
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "Product updated successfully", {
            updatedProduct,
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.UpdateProduct = UpdateProduct;
const deleteProduct = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.query.productId;
        if (!productId) {
            res.status(404).json({ message: "Invalid id or product Not found" });
        }
        const existingproductImages = yield prisma.image.findMany({
            where: {
                productId: productId,
            },
        });
        if (existingproductImages.length > 0) {
            res
                .status(400)
                .json({ message: "Cannot delete product , delete images first" });
        }
        const deletedproduct = yield prisma.product.delete({
            where: { id: productId },
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "product deleted successfully", {
            deleteProduct,
        });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.deleteProduct = deleteProduct;
const AddProductImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const productId = req.body.productId;
        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
        }
        if (!files || files.length === 0) {
            res.status(400).json({ message: "No files uploaded" });
        }
        const uploadPromises = [];
        files.forEach((file) => {
            uploadPromises.push(new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload(file.path, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        console.error("Error uploading file to Cloudinary:", err);
                        reject(err);
                    }
                    else {
                        try {
                            console.log("Cloudinary upload result:", result);
                            const savedProductImage = yield prisma.image.create({
                                data: {
                                    productId: productId,
                                    url: result.secure_url,
                                },
                            });
                            resolve(result);
                        }
                        catch (error) {
                            console.error("Error saving product image to database:", error);
                            reject(error);
                        }
                    }
                }));
            }));
        });
        yield Promise.all(uploadPromises);
        SuccesResponse_1.default.sendSuccessResponse(res, "Product image's inserted successfully");
    }
    catch (error) {
        console.error("Error adding product image:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}));
exports.AddProductImage = AddProductImage;
const GetAllproducts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    try {
        const count = yield prisma.product.count();
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const getAll = yield prisma.product.findMany({
            include: {
                images: true,
                category: true,
            },
            skip: skip,
            take: limit,
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "List of products are :", {
            getAll,
            page: page,
            totalPages: totalPages,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
}));
exports.GetAllproducts = GetAllproducts;
const filter = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, minPrice, maxPrice, productId } = req.query;
    const Category = category;
    const MinPrice = minPrice ? parseInt(minPrice) : undefined;
    const MaxPrice = maxPrice ? parseInt(maxPrice) : undefined;
    try {
        let filterOptions = {};
        if (productId && Category) {
            filterOptions["AND"] = [
                { id: productId },
                { categoryId: Category },
            ];
        }
        else {
            if (productId) {
                filterOptions["id"] = productId;
            }
            if (Category) {
                filterOptions["categoryId"] = Category;
            }
        }
        if (MinPrice !== undefined && MaxPrice !== undefined) {
            filterOptions["price"] = {
                gte: MinPrice,
                lte: MaxPrice,
            };
        }
        else {
            if (MinPrice !== undefined) {
                filterOptions["price"] = {
                    gte: MinPrice,
                };
            }
            if (MaxPrice !== undefined) {
                filterOptions["price"] = {
                    lte: MaxPrice,
                };
            }
        }
        const filteredProducts = yield prisma.product.findMany({
            where: filterOptions,
        });
        SuccesResponse_1.default.sendSuccessResponse(res, "filtered data", {
            filteredProducts,
        });
    }
    catch (error) {
        console.error("Error filtering products:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.filter = filter;
// Get list of pending Order
const GetOrdersByStatus = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    try {
        const statusParam = req.query.status;
        if (statusParam !== "pending" &&
            statusParam !== "confirmed" &&
            statusParam !== "rejected") {
            res.status(404).json({ message: "Invalid Order Status" });
        }
        const count = yield prisma.order.count({
            where: {
                status: statusParam,
            },
        });
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const orders = yield prisma.order.findMany({
            where: {
                status: statusParam,
            },
            skip: skip,
            take: limit,
        });
        SuccesResponse_1.default.sendSuccessResponse(res, " 'Orders fetched successfully'", { orders, totalPages: totalPages, page: page });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.GetOrdersByStatus = GetOrdersByStatus;
// confirm Order
const orderConfirmation = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.query.orderId;
        console.log(orderId);
        if (!orderId) {
            res.status(404).json({ message: "Invalid orderId or Not found" });
            return;
        }
        const approvedOrder = yield prisma.order.update({
            where: { id: orderId },
            data: { status: "confirmed" },
        });
        const order = yield prisma.order.findUnique({
            where: { id: orderId },
            include: { User: true },
        });
        if (!order || !order.User || !order.User.email) {
            throw new Error("User email not found");
        }
        yield (0, Order_Status_email_1.orderStatusMail)(order.User.email, "Order Confirmed", "Your order has been confirmed.");
        SuccesResponse_1.default.sendSuccessResponse(res, "Order : approved");
    }
    catch (error) {
        console.error("Error approving order:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.orderConfirmation = orderConfirmation;
// decline order
const declineorderConfirmation = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.query.orderId;
        console.log(orderId);
        if (!orderId) {
            res.status(404).json({ message: "Invalid orderId or Not found" });
            return;
        }
        const approvedOrder = yield prisma.order.update({
            where: { id: orderId },
            data: { status: "rejected" },
        });
        const order = yield prisma.order.findUnique({
            where: { id: orderId },
            include: { User: true },
        });
        if (!order || !order.User || !order.User.email) {
            throw new Error("User email not found");
        }
        yield (0, Order_Status_email_1.orderStatusMail)(order.User.email, "Order rejected", "Your order has been rejected.");
        SuccesResponse_1.default.sendSuccessResponse(res, "Order : Rejected");
    }
    catch (error) {
        console.error("Error approving order:", error);
        res
            .status(500)
            .json({ message: "Internal Server error", error: error.message });
    }
}));
exports.declineorderConfirmation = declineorderConfirmation;
