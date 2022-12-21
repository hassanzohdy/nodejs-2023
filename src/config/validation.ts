import {
  RequiredRule,
  StringRule,
  ValidationConfigurations,
} from "core/validator";
import ConfirmedRule from "core/validator/rules/confirmed";
import EmailRule from "core/validator/rules/email";
import InRule from "core/validator/rules/in";
import MaxLengthRule from "core/validator/rules/maxLength";
import MinLengthRule from "core/validator/rules/minLength";
import UniqueRule from "core/validator/rules/unique";

const validationConfigurations: ValidationConfigurations = {
  stopOnFirstFailure: false,
  returnErrorStrategy: "first",
  responseStatus: 400,
  rules: {
    [UniqueRule.ruleName]: UniqueRule,
    [RequiredRule.ruleName]: RequiredRule,
    [StringRule.ruleName]: StringRule,
    [ConfirmedRule.ruleName]: ConfirmedRule,
    [InRule.ruleName]: InRule,
    [MinLengthRule.ruleName]: MinLengthRule,
    [MaxLengthRule.ruleName]: MaxLengthRule,
    [EmailRule.ruleName]: EmailRule,
  },
  keys: {
    response: "messages",
    inputKey: "key",
    inputError: "error",
    inputErrors: "errors",
  },
};

export default validationConfigurations;
