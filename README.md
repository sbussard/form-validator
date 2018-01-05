# form-validator

A robust, extensible validation library for serialized forms.

_Note: it can be used to validate other flat objects too!_

## Examples

Basic usage
```javascript
import makeFormValidator from './lib';
// or let { makeFormValidator } = require('./lib');

let isAlpha = value => (/^[a-z]+$/i.test(value));
let isNumber = value => (typeof value === 'number');

let validateForm = makeFormValidator({
  firstName: { isAlpha },
  age: { isNumber }
});

validateForm({
  firstName: 'Max',
  age: 'like 19'
});

// { age: ['isNumber'] }

validateForm({
  firstName: 'Taylor',
  age: 22
});

// {}

```

Referencing other fields in the form

```javascript
import makeFormValidator from './lib';

let isPresent = value => (value !== undefined);
let isForUSAOnly = (value, form) => (form.countryCode === 'US');
let isNumber = value => (typeof value === 'number');

let validateForm = makeFormValidator({
  countryCode: { isPresent },
  zip: { isPresent, isForUSAOnly, isNumber }
});

validateForm({
  countryCode: 'CA',
  zip: 12345
});

// { zip: ['isForUSAOnly'] }

validateForm({
  countryCode: 'US',
  zip: 37027
});

// {}
```
