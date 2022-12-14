import {
  RequiredRule,
  StringRule,
  ValidationConfigurations,
} from "core/validator";
import UniqueRule from "core/validator/rules/unique";

const validationConfigurations: ValidationConfigurations = {
  stopOnFirstFailure: false,
  returnErrorStrategy: "first",
  responseStatus: 400,
  rules: {
    [UniqueRule.ruleName]: UniqueRule,
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
