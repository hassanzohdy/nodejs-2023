import { rootPath } from "@mongez/node";

// get the absolute path to the root of the project for the given path
const root = rootPath("");

console.log("Project has been started in:", root);
