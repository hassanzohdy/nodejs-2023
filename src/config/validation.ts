import { RequiredRule, StringRule } from "core/validator";

const validationConfigurations = {
  stopOnFirstFailure: true,
  returnErrorStrategy: "first", // first | all
  responseStatus: 400,
  rules: {
    [RequiredRule.ruleName]: RequiredRule,
    [StringRule.ruleName]: StringRule,
  },
  keys: {
    response: "messages",
    inputKey: "key",
    inputError: "error",
    inputErrors: "errors",
  },
};

export default validationConfigurations;
