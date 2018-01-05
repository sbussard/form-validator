// @flow

type fieldErrorMap = { [string]: Array<string> };
type fieldErrorEntry = { field: string, errors: Array<string> };
type serializedForm = { [string]: string };
type formValue = number | boolean | string;
type validatorFunction = (formValue, serializedForm) => boolean;
type fieldValidatorSchema = { [string]: validatorFunction };
type formValidatorSchema = { [string]: fieldValidatorSchema };

export let compileFieldErrorMap = (
  previous: fieldErrorMap,
  current: fieldErrorEntry
) => Object.assign(previous, { [current.field]: current.errors });

export let makeFieldValidator = (schema: fieldValidatorSchema) => (
  value: formValue,
  form: serializedForm
) =>
  Object.keys(schema).filter(
    validatorName => !schema[validatorName](value, form)
  );

export let makeFormValidator = (schema: formValidatorSchema) => (
  form: serializedForm
) =>
  Object.keys(schema)
    .map(field => ({
      field,
      errors: makeFieldValidator(schema[field])(form[field], form)
    }))
    .filter(item => item.errors.length)
    .reduce(compileFieldErrorMap, {});

export default makeFormValidator;
