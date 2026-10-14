import "dotenv/config";

import express from "express";
import configViewEngine from "./config/configEngine.js";
import routes from "./routes/web.js";
import cookieParser from "cookie-parser";

const app = express();

// Requests reach the app through a proxy (Netlify CDN / load balancer)
app.set("trust proxy", 1);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);
// init Web Routes
routes.initWebRouter(app);

export default app;
