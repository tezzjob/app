import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import serverlessExpress from "@codegenie/serverless-express";

export default function handler(req: VercelRequest, res: VercelResponse) {
  exports.handler = serverlessExpress({ app });
}