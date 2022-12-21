// TODO: Enhance this regular expression
let regex = "^";
regex += "[a-z]"; // starts with English letter
regex += "([a-z0-9]+"; // May contain one ore more English letter|number
regex += "(\\.|\\_)?)*"; // may contain underscore or dot, at most one time between letters
regex += "[a-z]"; // should end with a letter
regex += "$";

export const usernamePattern = new RegExp(regex);
