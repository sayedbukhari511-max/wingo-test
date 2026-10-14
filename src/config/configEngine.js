import express from "express";
import path from "path";

const configViewEngine = (app) => {
  app.use(express.static(path.join(process.cwd(), "src/public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "src/views"));
};

export default configViewEngine;
