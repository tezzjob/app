import app from "../src/app";
import serverlessExpress from "@codegenie/serverless-express";

let server: any;

export const handler = async (event: any, context: any) => {
  if (!server) {
    server = serverlessExpress({ app }); // ✅ Initialize only once
  }
  return server(event, context);
};
