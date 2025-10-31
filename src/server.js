import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import Cookie from "@hapi/cookie";
import Joi from "joi";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import jwt from "hapi-auth-jwt2";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { accountsController } from "./controllers/accounts-controller.js";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { apiRoutes } from "./api-routes.js";
import { validate } from "./api/jwt-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ quiet: true });

const swaggerOptions = {
  info: {
    title: "Playtime API",
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.register(jwt);
  await server.register(Cookie);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.validator(Joi);

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });

  server.auth.strategy("jwt", "jwt", {
    key: process.env.jwt_secret,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  server.auth.default("session");

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  db.init("mongo");
  server.route(apiRoutes);
  server.route(webRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
