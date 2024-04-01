import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { adminRegistrationSchema } from '../validations/admin.Validation';
import SuccessHandler from '../SuccesResponse';

const prisma = new PrismaClient(); 

// Register a user

const Register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
  const { error, value } = adminRegistrationSchema.validate(req.body);
  console.log(value)
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
    const { UserName, email, password } = value;
    console.log(value)
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword);
    const newAdmin = await prisma.admin.create({
      data: {
        UserName,
        email,
        password: hashedpassword
      }
    });
    if (newAdmin) {
      res.status(200).json({ message: "Admin registered Successfully" });
      return; 
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error",error:error.message});
    return; 
  } finally {
    await prisma.$disconnect(); 
  }
});

const Login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are mandatory" });
            return;
        }

        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            res.status(404).json({ message: "Invalid email or password" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const accessToken = jwt.sign(
            {
                admin: {
                    id: admin.id,
                    email: admin.email,
                    isAdminToken: true
                }
            },
            process.env.Access_Token_Secret || '',
            { expiresIn: "30m" }
        );
        SuccessHandler.sendSuccessResponse(res,"Login successful",{accessToken})
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};

export { Register, Login };

