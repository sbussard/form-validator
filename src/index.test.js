import { makeFieldValidator, makeFormValidator } from '.';

describe('makeFieldValidator', () => {
  it('returns an empty list if the value passes all validators in the schema', () => {
    let eq4 = value => value === 4;
    let fieldValidator = makeFieldValidator({ eq4 });
    let actual = fieldValidator(4);
    let expected = [];

    expect(actual).toEqual(expected);
  });

  it('returns a list of the names of the validators that failed (returned false)', () => {
    let gt3 = value => value > 3;
    let eq4 = value => value === 4;

    let fieldValidator = makeFieldValidator({ gt3, eq4 });
    let actual = fieldValidator(5);
    let expected = ['eq4'];

    expect(actual).toEqual(expected);
  });
});

describe('makeFormValidator', () => {
  it('returns an object that does not have a key for fields that pass their validators', () => {
    let gt3 = value => value > 3;
    let lt7 = value => value < 7;

    let validateForm = makeFormValidator({
      field: { gt3, lt7 }
    });

    let actual = Object.keys(validateForm({ field: 5 }));
    let expected = Object.keys({});

    expect(actual).toEqual(expected);
  });

  it('returns an object that maps field names to their list of failed validators', () => {
    let gt3 = value => value > 3;
    let lt7 = value => value < 7;
    let isLetter = value => /\s/gi.test(value);

    let validateForm = makeFormValidator({
      field: { gt3 },
      field2: { gt3, lt7, isLetter }
    });

    let actual = validateForm({
      field: 2,
      field2: 9
    });

    let expected = {
      field: ['gt3'],
      field2: ['lt7', 'isLetter']
    };

    expect(actual).toEqual(expected);
  });

  it('passes a reference to the serialized form as the second argument of the field validators', () => {
    let form = {
      field: 'whatever',
      otherField: 4
    };

    let isPresent = value => value !== undefined;
    let otherFieldIsThree = (value, formReference) =>
      expect(form).toBe(formReference);

    let validateForm = makeFormValidator({
      field: { otherFieldIsThree },
      otherField: { isPresent }
    });

    validateForm(form);
  });

  it('returns an object with an error when a validator fails for a field based on the value of another field', () => {
    let isPresent = value => value !== undefined;
    let otherFieldIsThree = (value, form) => form.otherField === 3;

    let validateForm = makeFormValidator({
      field: { otherFieldIsThree },
      otherField: { isPresent }
    });

    let actual = validateForm({
      field: 'whatever',
      otherField: 4
    });

    let expected = {
      field: ['otherFieldIsThree']
    };

    expect(actual).toEqual(expected);
  });

  it('returns an object with no error when a validator passes based on the value of another field', () => {
    let isPresent = value => value !== undefined;
    let otherFieldIsThree = (value, form) => form.otherField === 3;

    let validateForm = makeFormValidator({
      field: { otherFieldIsThree },
      otherField: { isPresent }
    });

    let actual = validateForm({
      field: 'whatever',
      otherField: 3
    });

    let expected = {};

    expect(actual).toEqual(expected);
  });
});
