import serverless from "serverless-http";
import app from "../../src/app.js";

// Runs the Express app for every request that isn't a static file
export const handler = serverless(app);
