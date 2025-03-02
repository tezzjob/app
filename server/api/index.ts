import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { createServer } from "http";
import { parse } from "url";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const server = createServer(app);
  const parsedUrl = parse(req.url!, true);

  server.emit("request", req, res);
}
