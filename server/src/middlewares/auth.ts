import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma';
import { getShop } from '../service/shopkeeper.service';
import { Shop } from '@prisma/client';

const SECRET_KEY = 'your_secret_key'; // Use environment variable in production

// Generate JWT Token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '24h', // Token expires in 1 hour
  });
};

export interface User {
    shopId: Shop['id'];
    shopName: Shop['shopName'];
    ownerName: Shop['ownerName'];
    ownerEmail: Shop['ownerEmail'];
    ownerMobile: Shop['ownerMobile'];
}

export interface LoggedInUserType extends User {}

declare global {
  namespace Express {
    interface Request {
      loggedInUser?: User;
    }
  }
}

const noAuthPaths = [
  "/",
  "health-check",
  "employee/signup",
  "shopkeeper/signup",
  "shopkeeper/login",
  "verify",
  "forgot-password",
  "reset-password",
  "logout",
  "apply-to-job",
];

// Verify Token Middleware
export const auth = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    if (noAuthPaths.includes(req.query.path as string)) {
      next();
    } else {
      res.send({ path: req.query.path });
      // try {
      //   const authHeader = req.headers["authorization"];
      //   if (!authHeader) {
      //     res.status(403).json({ auth: false, message: "No token provided." });
      //     return;
      //   }

      //   const token = authHeader.split(" ")[1];
      //   jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      //     if (err) {
      //       res
      //         .status(401)
      //         .json({ auth: false, message: "Failed to authenticate token." });
      //       return;
      //     }

      //     const ownerEmail = (decoded as any).ownerEmail;

      //     // Fetch shop details from the database
      //     const shop = await getShop(ownerEmail);

      //     // Attach shop details to request
      //     req.loggedInUser = {
      //       shopId: shop.id,
      //       shopName: shop.shopName,
      //       ownerName: shop.ownerName,
      //       ownerEmail: shop.ownerEmail,
      //       ownerMobile: shop.ownerMobile,
      //     };

      //     // Call next() explicitly to continue to the next middleware or route handler
      //     next();
      //   });
      // } catch (error) {
      //   console.error("Authentication failed", error);
      //   res.status(500).json({ message: "Authentication Failed" });
      // }
    }
  };
};
