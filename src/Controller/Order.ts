import expressAsyncHandler from "express-async-handler";
import { Request,Response,NextFunction } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { any } from "joi";
import { SendOrderConfirmationEmail } from "../EmailSender/Order.Status.email";
const prisma= new PrismaClient();

 const order = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.user.id;
        const orderItems: { productId: string; quantity: number }[] = req.body.orderItems;

        if (!orderItems || orderItems.length === 0) {
            res.status(400).json({ error: 'Invalid order items.' });
            return;
        }

        const orders = [];

        for (const item of orderItems) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                res.status(400).json({ error: 'Invalid product ID or quantity.' });
                return;
            }

            const product = await prisma.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                res.status(404).json({ error: `Product with ID ${productId} not found.` });
                return;
            }

            if (product.quantity < quantity) {
                res.status(400).json({ error: `Insufficient quantity available for product with ID ${productId}.` });
                return;
            }

            const newOrder = await prisma.order.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: quantity
                }
            });

            orders.push(newOrder);
                
            const ownerId = product.userId;
            const userData = await prisma.user.findUnique({
                where: { id: ownerId }
            });

            if (userData) {
                const sellerEmail = userData.email;
                await SendOrderConfirmationEmail(sellerEmail, userId);
            }
        }

        res.status(201).json({ message: 'Orders placed but pendinf for approval.', orders });
    } catch (error) {
        next(error);
    }
});




const GetAllOrders= expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.user.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;
    try{
      const count = await prisma.order.count();
        const totalPages = Math.ceil(count/limit);
            const skip=(page-1)*limit;
    const getAll= await prisma.order.findMany({
        where:{
            userId:userId
        },
      include:{
        product: true,
      },
      skip: skip,
      take: limit
    })
    res.status(200).json({message:"List of Orders are :",getAll,page: page,
    totalPages: totalPages})
    }
    catch(error:any){
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  
    }
  })

  const CancelOrder= expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
  
    try{
        const userId = req.user.user.id;
        const orderId=req.query;
    const getAll= await prisma.order.delete({
        where:{
            id:orderId as unknown as string
            ,
        }
    })
    res.status(200).json({message:"List of Orders are :",getAll})
    }
    catch(error:any){
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  
      
    }
    
  })
export {order,GetAllOrders,CancelOrder};




