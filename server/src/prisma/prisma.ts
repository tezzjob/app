import { DB_URI } from "../utils/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: { db: { url: DB_URI() } },
  log: ["info", "warn"],
});

export default prisma;
