"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../utils/config");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient({
    datasources: { db: { url: (0, config_1.DB_URI)() } },
    log: ["info", "warn"],
});
exports.default = prisma;
