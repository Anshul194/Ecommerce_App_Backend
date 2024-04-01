import express, { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { OrderStatus, Prisma, PrismaClient } from '@prisma/client';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import { productSchema } from '../validations/Product.validation';
import { boolean } from 'joi';
import { sendRegistrationResponseNotification } from '../EmailSender/AdminApproval';
import { orderStatusMail } from '../EmailSender/Order.Status.email';

const prisma = new PrismaClient();
cloudinary.config({ 
  cloud_name:process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret:process.env. api_secret
});



const AddCategory=expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: {
        name
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const GetCategoryList=expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1;
  try {
    const count = await prisma.category.count();
    const totalPages = Math.ceil(count/limit);
        const skip=(page-1)*limit;
    const list = await prisma.category.findMany({skip: skip,
      take: limit
    });
    res.status(201).json({message:"List of category is :",list,page:page,totalPages:totalPages})
  }
  catch(error:any){
    res.status(500).json({ message: "Internal Server error", error: error.message });
 
  }
  });



  const updatecategory=expressAsyncHandler(async(req:Request, res:Response,next:NextFunction)=>{
    try{
    const categoryId = req.query.categoryId as string;
    const {categoryName}=req.body;

if(!categoryId){
    res.status(404).json({message:"Invalid id or Category Not found"})
}
const update= await prisma.category.update({
    where:{id: categoryId},
    data:{name:categoryName}
})
        res.status(200).json({ message: 'Updated successfully',update});
      } 
      catch (error:any) {
  res.status(500).json({message:"Internal Server error", error:error.message});
}})



const deleteCategory = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.query.categoryId as string;
    if (!categoryId) {
       res.status(404).json({ message: "Invalid id or Category Not found" });
    } 
    const productsWithCategory = await prisma.product.findMany({
      where: {
        categoryId: categoryId
      }
    });
    if (productsWithCategory.length > 0) {
       res.status(400).json({ message: "Cannot delete category with associated products" });
    }
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId }
    });

    res.status(200).json({ message: 'Category deleted successfully', deletedCategory });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});



const AddPrduct = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user.user.id;
    const { error, value } = productSchema.validate(req.body);
    if (error) {
       res.status(400).json({ message: "Error in validation", error });
    }

    const { name, description, price, categoryId, quantity, brand } = value;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId
      }
    });

    if (!category) {
       res.status(400).json({ message: "Category not found" });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        quantity,
        userId: user,
        brand
      },
    });
    
    res.status(200).json({ message: 'Product Added Successfully', newProduct });
  } catch (error: any) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});


const UpdateProduct = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const  productId = req.query.productId as string;
    console.log(productId)
    const { error, value } = productSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: "Error in validation", error });
        return;
    }
        const { name, description, price, categoryId, quantity, brand } = value;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId
      }
    });
    if (!existingProduct) {
        res.status(404).json({ message: "Product not found" });
    }
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId
        }
      });
      if (!category) {
          res.status(400).json({ message: "Category not found" });
      }
    }
    const updatedProduct = await prisma.product.update({
      where: { id:productId },
      data: {
        name,
        description,
        price,
        categoryId,
        quantity,
        brand
      }
    });
    
    res.status(200).json({ message: 'Product updated successfully', updatedProduct });

  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});


const deleteProduct = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.query.productId as string;
    if (!productId) {
       res.status(404).json({ message: "Invalid id or product Not found" });
    }   
    const existingproductImages = await prisma.image.findMany({
      where: {
        productId: productId
      }
    });
    if (existingproductImages.length > 0) {
       res.status(400).json({ message: "Cannot delete product , delete images first" });
    }
    const deletedproduct = await prisma.product.delete({
      where: { id: productId }
    });

    res.status(200).json({ message: 'product deleted successfully', deleteProduct });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});

 const AddProductImage = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];

      const productId = req.body.productId;
      
      if (!productId) {
         res.status(400).json({ message: "Product ID is required" });
      }
  
      if (!files || files.length === 0) {
         res.status(400).json({ message: "No files uploaded" });
      }
  
      const uploadPromises: Promise<UploadApiResponse>[] = [];
  
      files.forEach((file: Express.Multer.File) => {
        uploadPromises.push(
          new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(file.path, async (err: any, result: UploadApiResponse) => {
              if (err) {
                console.error("Error uploading file to Cloudinary:", err);
                reject(err);
              } else {
    try {
        console.log("Cloudinary upload result:", result);
        const savedProductImage = await prisma.image.create({
        data: {
            productId: productId,
            url: result.secure_url
        }
                  });
                  resolve(result);
                } catch (error) {
                  console.error("Error saving product image to database:", error);
                  reject(error);
                }
              }
            });
          })
        );
      });
  
      await Promise.all(uploadPromises);
  
      res.json({ message: "Product image's inserted successfully" });
    } catch (error: any) {
      console.error('Error adding product image:', error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
    
const GetAllproducts= expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1;
  try{
    const count = await prisma.product.count();
      const totalPages = Math.ceil(count/limit);
          const skip=(page-1)*limit;
  const getAll= await prisma.product.findMany({
    include:{
      images: true,
      category:true
    },
    skip: skip,
    take: limit
  })
  res.status(200).json({message:"List of products are :",getAll,page: page,
  totalPages: totalPages})
  }
  catch(error:any){
    res.status(500).json({ message: "Internal Server Error", error: error.message });

  }
})

const filter = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { category, minPrice, maxPrice, productId } = req.query;
  const Category = category as string;
  const MinPrice = minPrice ? parseInt(minPrice as string) : undefined;
  const MaxPrice = maxPrice ? parseInt(maxPrice as string) : undefined;
  
  try {
    let filterOptions: any = {};

    if (productId && Category) {
      filterOptions['AND'] = [
        { id: productId as string },
        { categoryId: Category }
      ];
    } else {
      if (productId) {
        filterOptions['id'] = productId as string;
      }
      if (Category) {
        filterOptions['categoryId'] = Category;
      }
    }

    if (MinPrice !== undefined && MaxPrice !== undefined) {
      filterOptions['price'] = {
        gte: MinPrice,
        lte: MaxPrice
      };
    } else {
      if (MinPrice !== undefined) {
        filterOptions['price'] = {
          gte: MinPrice
        };
      }
      if (MaxPrice !== undefined) {
        filterOptions['price'] = {
          lte: MaxPrice
        };
      }
    }

    const filteredProducts = await prisma.product.findMany({
      where: filterOptions
    });

    res.json(filteredProducts);

  } catch (error: any) {
    console.error('Error filtering products:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});



// Get list of pending Order 

const GetOrdersByStatus = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 2; 
  try {
   
    const statusParam = req.query.status as string;
   
    if (statusParam !== 'pending' && statusParam !== 'confirmed' && statusParam !== 'rejected') {
      res.status(404).json({message:"Invalid Order Status"})
  }
    
    const count = await prisma.order.count({
      where: {
          status: statusParam as OrderStatus
      }
      
      
  });
  const totalPages = Math.ceil(count / limit);
      const skip=(page-1)*limit;
    const orders = await prisma.order.findMany({
      where: {
        status: statusParam as OrderStatus
      },
      skip:skip,
      take:limit
    });
      res.status(200).json({ message: 'Orders fetched successfully', orders, totalPages:totalPages, page:page });
  } catch (error: any) {
      res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});


// confirm Order

const orderConfirmation = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.query.orderId as string;
    console.log(orderId);

    if (!orderId) {
      res.status(404).json({ message: "Invalid orderId or Not found" });
      return;
    }

    const approvedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "confirmed" }
    });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { User: true }
    });

    if (!order || !order.User || !order.User.email) {
      throw new Error('User email not found');
    }

    await orderStatusMail(order.User.email, 'Order Confirmed', 'Your order has been confirmed.');

    res.status(200).json({ message: 'Order : approved' });
  } catch (error: any) {
    console.error('Error approving order:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});



// decline order 

const declineorderConfirmation = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.query.orderId as string;
    console.log(orderId);

    if (!orderId) {
      res.status(404).json({ message: "Invalid orderId or Not found" });
      return;
    }

    const approvedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "rejected" }
    });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { User: true }
    });

    if (!order || !order.User || !order.User.email) {
      throw new Error('User email not found');
    }

    await orderStatusMail(order.User.email, 'Order rejected', 'Your order has been rejected.');

    res.status(200).json({ message: 'Order : Rejected' });
  } catch (error: any) {
    console.error('Error approving order:', error);
    res.status(500).json({ message: "Internal Server error", error: error.message });
  }
});



export { AddPrduct ,AddProductImage,GetAllproducts,AddCategory,GetCategoryList,
  updatecategory,deleteCategory,deleteProduct,UpdateProduct
  ,orderConfirmation,declineorderConfirmation,GetOrdersByStatus,filter};
 
