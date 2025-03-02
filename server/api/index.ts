import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import serverlessExpress from "@codegenie/serverless-express";

const server = serverlessExpress({ app });

export default function handler(req: VercelRequest, res: VercelResponse) {
  return server(req, res);
}
