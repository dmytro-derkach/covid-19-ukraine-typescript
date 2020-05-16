import { addAliases } from "module-alias";

addAliases({
  "@root": __dirname,
  "@vars": __dirname + "/config/vars.js",
  "@constants": __dirname + "/config/constants.js",
  "@models": __dirname + "/models",
  "@validators": __dirname + "/validators",
  "@middlewares": __dirname + "/middlewares",
  "@services": __dirname + "/services",
});
