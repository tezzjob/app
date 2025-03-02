import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import serverlessExpress from "@codegenie/serverless-express";

let server: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = serverlessExpress({ app });
  }
  return server(req, res);
}
