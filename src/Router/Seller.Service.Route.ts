import express from "express";

const sellerServiceRoute = express.Router();
import {
  AddPrduct,
  AddProductImage,
  GetAllproducts,
  AddCategory,
  GetCategoryList,
  updatecategory,
  deleteCategory,
  deleteProduct,
  UpdateProduct,
  orderConfirmation,
  declineorderConfirmation,
  GetOrdersByStatus,
  filter,
} from "../Controller/Seller.Service";
import validateUser from "../middleware/UserTokevalidation";

sellerServiceRoute.post("/add-category", AddCategory);
sellerServiceRoute.post("/addproduct", validateUser, AddPrduct);
sellerServiceRoute.get("/get-category-list", GetCategoryList);
sellerServiceRoute.post("/addproductImage", AddProductImage);
sellerServiceRoute.patch("/update-category", updatecategory);
sellerServiceRoute.put("/update-product", UpdateProduct);
sellerServiceRoute.delete("/delete-category", deleteCategory);
sellerServiceRoute.delete("/delete-product", deleteProduct);
sellerServiceRoute.get("/get-product-list", GetAllproducts);
sellerServiceRoute.patch("/order-status", orderConfirmation);
sellerServiceRoute.get("/filter", filter);
sellerServiceRoute.patch("/decline-order-status", declineorderConfirmation);
sellerServiceRoute.get("/decline-order-status", declineorderConfirmation);
sellerServiceRoute.get("/Order-list", GetOrdersByStatus);

export { sellerServiceRoute };
