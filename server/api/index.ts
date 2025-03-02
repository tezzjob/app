import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const serverlessExpress = require("@codegenie/serverless-express");
  exports.handler = serverlessExpress({ app });
}
