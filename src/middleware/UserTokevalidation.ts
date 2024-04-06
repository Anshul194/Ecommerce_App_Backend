import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Adjust the type as per your requirement
  }
}

const validateUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let authHeader: string | string[] | undefined =
      req.headers.authorization || req.headers.Authorization;

    if (
      !authHeader ||
      (Array.isArray(authHeader) && !authHeader[0].startsWith("Bearer"))
    ) {
      res.status(401).json({ message: "Unauthorized Token not provided" });
      return;
    }

    if (Array.isArray(authHeader)) {
      authHeader = authHeader[0]; // Take the first element if it's an array
    }

    token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.Access_Token_Secret as string,
      async (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized Invalid token" });
        }
        if (!decoded.user || !decoded.user.isUserToken) {
          return res.status(403).json({ message: "Invalid user token" });
        }
        try {
          const user = await prisma.user.findUnique({
            where: { id: decoded.user.id },
          });
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          // console.log("hjh", user.status)
          req.user = decoded;
          next();
        } catch (error: any) {
          console.error(error);
          res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
        }
      }
    );
  }
);

export default validateUser;
