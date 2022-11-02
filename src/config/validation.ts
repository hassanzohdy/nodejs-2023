import {
  RequiredRule,
  StringRule,
  ValidationConfigurations,
} from "core/validator";

const validationConfigurations: ValidationConfigurations = {
  stopOnFirstFailure: false,
  returnErrorStrategy: "first",
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
