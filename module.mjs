// @ts-check
import { module } from "@prisma/composer";
import reactExampleService from "./service.mjs";

export default module("lmdpro-2-3-1", ({ provision }) => {
  provision(reactExampleService, { id: "reactexample" });
});
