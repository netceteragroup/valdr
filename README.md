# valdr [![Build Status](https://travis-ci.org/netceteragroup/valdr.svg?branch=master)](https://travis-ci.org/netceteragroup/valdr) [![Coverage Status](https://coveralls.io/repos/netceteragroup/valdr/badge.png?branch=master)](https://coveralls.io/r/netceteragroup/valdr?branch=master) [![Code Climate](https://codeclimate.com/github/netceteragroup/valdr.png)](https://codeclimate.com/github/netceteragroup/valdr)

> A model centric approach to AngularJS form validation

## Why valdr
Defining the validation rules on every input field with the default AngularJS validators pollutes the markup with your
business rules and makes them pretty hard to maintain. This is especially true for larger applications, where you may
have recurring models like persons or addresses in different forms, but require slightly different markup and therefore
can't just reuse an existing form via ng-include or a form directive. What's even worse: Usually you already have
the validation logic in your back-end, but there is no easy way to share this information with the UI.

valdr solves these issues by extracting the validation constraints from the markup to a JSON structure. You define
the constraints per type and field, tell valdr that a form (or just a part of the form) belongs to a certain type and
valdr automatically validates the form fields.

valdr gives you the following advantages:
- cleaner form markup
- reusable validation constraints for your models -> easier to maintain
- possibility to generate the constraints from the models you already have in your back-end (see [valdr-bean-validation](https://github.com/netceteragroup/valdr-bean-validation) for Java)
- an easy way to display validation messages per form field
- seamless integration with [angular-translate](https://github.com/angular-translate/angular-translate) for i18n of the validation messages

## Install

#### [Bower](http://bower.io)

```bash
bower install --save valdr
```

## Getting started

1) Add valdr.js to your index.html

2) Add it as a dependency to your apps module:

```javascript
angular.module('yourApp', ['valdr']);
```

3) Define the constraints:
```javascript
yourApp.config(function(valdrProvider) {
  valdrProvider.addConstraints({
    'Person': {
      'lastName': {
        'size': {
          'min': 2,
          'max': 10,
          'message': 'Last name must be between 2 and 10 characters.'
        },
        'required': {
          'message': 'Last name is required.'
        }
      },
      'firstName': {
        'size': {
          'min': 2,
          'max': 20,
          'message': 'First name must be between 2 and 20 characters.'
        }
      }
    }
});
```

4) Add the *valdr-type* directive in your form on any parent element of the input fields that you want to validate.
The **important** thing is, that the attribute *name* on the input field matches the field name in the constraints JSON.

```html
<form name="yourForm" novalidate valdr-type="Person">
  <div class="form-group">
    <label for="lastName">Last Name</label>
    <input type="text"
           id="lastName"
           name="lastName"
           ng-model="person.lastName">
  </div>

  <div class="form-group">
    <label for="firstName">First Name</label>
    <input type="text"
           id="firstName"
           name="firstName"
           ng-model="person.firstName">
  </div>
</form>
```
That's it. valdr will now automatically validate the fields with the defined constraints and set the $validity of these form items.
All violated constraints will be added to the *valdrViolations* array on those form items. 

## Constraints JSON
The JSON object to define the validation rules has the following structure:

```javascript
  TypeName {
    FieldName {
      ValidatorName {
        <ValidatorArguments>
        message: 'error message'
      }
    }
  }
```
- **TypeName** The type of object (string)
- **FieldName** The name of the field to validate (string)
- **ValidatorName** The name of the validator (string) see below in the Built-In Validators section for the default validators
- **ValidatorArguments** arguments which are passed to the validator, see below for the optional and required arguments for the built-in validators
- **Message** the message which should be shown if the validation fails (can also be a message key if angular-translate is used)

Example:
```javascript
  "Person": {
    "firstName": {
      "size": {
        "min": 2,
        "max": 20,
        "message": "First name must be between 2 and 20 characters."
      }
    }
  },
  "Address": {
    "email": {
      "email": {
        "message": "Must be a valid E-Mail address."
      }
    },
    "zipCode": {
      "size": {
        "min": "4",
        "max": "6",
        "message": "Zip code must be between 4 and 6 characters."
      }
    }
  }
```

## Built-In Validators

### size
Checks the minimal and maximal length of the value.

Arguments:
- **min** The minimal string length (number, optional, default 0)
- **max** The maximal string length (number, optional)

### minLength / maxLength
Checks that the value is a string and not shorter / longer than the specified number of characters.

Arguments:
- **number** The minimal / maximal string length (number, required)

### min / max
Checks that the value is a number above/below or equal to the specified number.

Arguments:
- **value** The minimal / maximal value of the number (number, required)

### required
Marks the field as required.

### pattern
Validates the input using the specified regular expression.

Arguments:
- **value** The regular expression (string/RegExp, required)

### email
Checks that the field contains a valid e-mail address. It uses the same regular expression as AngularJS is using for e-mail validation.

### digits
Checks that the value is a number with the specified number of integral/fractional digits.

Arguments:
- **integer** The integral part of the number (number, required)
- **fraction** The fractional part of the number (number, required)

### url
Checks that the value is a valid URL. It uses the same regular expression as AngularJS for the URL validation.

### future / past
Check that the value is a date in the future/past. *NOTE* These validators require that [Moment.js](http://momentjs.com) is loaded.

## Adding custom validators
Implementing custom validation logic is easy, all you have to do is implement a validation service/factory and register it in the valdrProvider.

1) Custom validator:
```javascript
yourApp.factory('customValidator', function () {
  return {
    name: 'customValidator', // this is the validator name that can be referenced from the constraints JSON
    validate: function (value, arguments) {
      // value: the value to validate
      // arguments: the validator arguments
      return value === arguments.onlyValidValue;
    }
  };
});
```
2) Register it:
```javascript
yourApp.config(function (valdrProvider) {
  valdrProvider.addValidator('customValidator');
}
```

3) Use it in constraints JSON:
```javascript
yourApp.config(function (valdrProvider) {
  valdrProvider.addConstraints({
    'Person': {
      'firstName': {
        'customValidator': {
          'onlyValidValue': 'Tom',
          'message': 'First name has to be Tom!'
        }
      }
    }
  });
}
```

## Showing validation messages
TODO

### Integration of angular-translate
TODO

## Wire up your back-end

-> TODO: describe configuration via setConstraintsUrl

### Using JSR303 Bean Validation with Java back-ends

Use it in combination with [valdr-bean-validation](https://github.com/netceteragroup/valdr-bean-validation).


## Develop

Clone and install dependencies:

```bash
git clone https://github.com/netceteragroup/valdr.git
cd valdr
npm install
```

Start live-reload
```bash
grunt dev
```

Then start the dev server
```bash
grunt server
```

Open http://localhost:3005/demo in your browser.

## License

[MIT](http://opensource.org/licenses/MIT) © Netcetera AG

## Credits

Kudos to the gang who brainstormed the name for this project with us over a dinner on [mount Rigi](https://maps.google.com/maps?q=Hotel+Rigi+Kaltbad&hl=en&cid=7481422441262508040&gl=US&hq=Hotel+Rigi+Kaltbad&t=m&z=16). Guys we really appreciate your patience!
* [Björn Mosler](https://github.com/brelsom)
* Roland Weiss, father of 'valdr'
* [Jason Brazile](https://github.com/jbrazile)
