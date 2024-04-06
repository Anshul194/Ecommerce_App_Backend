import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response, NextFunction, RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { sendRegistrationResponseNotification } from "../EmailSender/AdminApproval";
import SuccessHandler from "../SuccesResponse";

// approve user

const approveRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const UserId = req.query.id as string;
      console.log(UserId);
      if (!UserId) {
        res.status(404).json({ message: "Invalid UserId or Not found" });
      }
      const approveuser = await prisma.user.update({
        where: { id: UserId },
        data: { isadminapproved: true },
      });
      const user = await prisma.user.findUnique({
        where: { id: UserId },
        select: { email: true },
      });

      if (!user || !user.email) {
        throw new Error("User email not found");
      }
      await sendRegistrationResponseNotification(
        user.email,
        "Registration Approved",
        "Your registration has been approved by the admin, please login ur account."
      );
      SuccessHandler.sendSuccessResponse(res, "User approved successfully");
    } catch (error: any) {
      console.error("Error approving user:", error);
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
);

// decline user

const declineUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.id as string;
      console.log(userId);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user || !user.email) {
        throw new Error("User email not found");
      }
      await sendRegistrationResponseNotification(
        user.email,
        "Registration Declined",
        "Your registration has been declined."
      );
      SuccessHandler.sendSuccessResponse(
        res,
        "User registration declined by admin"
      );
    } catch (error: any) {
      console.error("Error declining user:", error);
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
);

// get list of userregistration request

const UserListForApproval = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;

    try {
      const count = await prisma.user.count({
        where: {
          isadminapproved: false,
        },
      });
      const totalPages = Math.ceil(count / limit);
      const skip = (page - 1) * limit;
      const list = await prisma.user.findMany({
        where: {
          isadminapproved: false,
        },
        skip: skip,
        take: limit,
      });
      if (!list) {
        res.status(400).json({ message: "No request is pending for approval" });
      }
      SuccessHandler.sendSuccessResponse(res, "Users pending to approve :", {
        list,
        page: page,
        totalPages: totalPages,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
);

/// users list

const UserList = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;

    try {
      const count = await prisma.user.count();
      const totalPages = Math.ceil(count / limit);
      const skip = (page - 1) * limit;
      const list = await prisma.user.findMany({
        skip: skip,
        take: limit,
      });
      if (!list) {
        res.status(400).json({ message: "No User available" });
      }
      SuccessHandler.sendSuccessResponse(res, "Users List :", {
        list,
        page: page,
        totalPages: totalPages,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
);

export { approveRequest, declineUser, UserListForApproval, UserList };
