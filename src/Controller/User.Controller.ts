import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendUserNotification } from "../EmailSender/AdminApproval";
import { userSchema } from "../validations/User.Validation";
import SuccessHandler from "../SuccesResponse";

const prisma = new PrismaClient();

// Register a user

const Register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const { error, value } = userSchema.validate(req.body);
    console.log(value);
    if (error) {
      console.error("Validation error:", error);
      res.status(400).json({ error: error.message });
      return;
    }
    if (!value) {
      console.log("Value is undefined");
      res.status(400).json({ error: "Request body is missing or invalid" });
      return;
    }
    try {
      const { firstName, lastName, email, password, mobile, city } = value;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          mobile,
          city,
          isadminapproved: false,
        },
      });

      await sendUserNotification(newUser.id, newUser.email);
      SuccessHandler.sendSuccessResponse(
        res,
        "User registration pending approval from admin"
      );
    } catch (error: any) {
      console.error("Error registering user:", error);
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
);

const Login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are mandatory" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "Invalid email or password" });
      return;
    }
    if (!user.isadminapproved) {
      return res
        .status(401)
        .json({ message: "User is not approved or not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          isUserToken: true,
        },
      },
      process.env.Access_Token_Secret || "",
      { expiresIn: "30m" }
    );
    SuccessHandler.sendSuccessResponse(res, "Login successful", {
      accessToken,
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

export { Register, Login };
