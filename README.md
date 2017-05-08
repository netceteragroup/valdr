# valdr
[![Build Status](https://travis-ci.org/netceteragroup/valdr.svg?branch=master)](https://travis-ci.org/netceteragroup/valdr) [![Coverage Status](https://coveralls.io/repos/netceteragroup/valdr/badge.svg?branch=master)](https://coveralls.io/r/netceteragroup/valdr?branch=master) [![Code Climate](https://codeclimate.com/github/netceteragroup/valdr.svg)](https://codeclimate.com/github/netceteragroup/valdr) [![NPM version](https://badge.fury.io/js/valdr.svg)](http://badge.fury.io/js/valdr) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/netceteragroup/valdr/blob/master/LICENSE) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/netceteragroup/valdr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A model centric approach to AngularJS form validation. Learn more on the [valdr website](http://netceteragroup.github.io/valdr/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!--**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*-->

  - [Why valdr](#why-valdr)
  - [Install](#install)
  - [Getting started](#getting-started)
  - [Constraints JSON](#constraints-json)
  - [Built-In Validators](#built-in-validators)
    - [size](#size)
    - [minLength / maxLength](#minlength--maxlength)
    - [min / max](#min--max)
    - [required](#required)
    - [pattern](#pattern)
    - [email](#email)
    - [digits](#digits)
    - [url](#url)
    - [future / past](#future--past)
  - [Adding custom validators](#adding-custom-validators)
  - [Applying validation to custom input widgets](#applying-validation-to-custom-input-widgets)
  - [Showing validation messages](#showing-validation-messages-with-valdr-messages)
    - [Message template](#message-template)
    - [CSS to control visibility](#css-to-control-visibility)
    - [Integration of angular-translate](#integration-of-angular-translate)
    - [Show messages for AngularJS built-in validators](#show-messages-for-angularjs-built-in-validators)
  - [Conditionally enable/disable validation](#conditionally-enabledisable-validation)
  - [Wire up your back-end](#wire-up-your-back-end)
    - [Using JSR303 Bean Validation with Java back-ends](#using-jsr303-bean-validation-with-java-back-ends)
    - [Using DataAnnotation with C# back-ends](#using-dataannotation-with-c-back-ends)
  - [Develop](#develop)
  - [Support](#support)
  - [License](#license)
  - [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

#### [NPM](http://www.npmjs.com)

```bash
npm install valdr
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

4) Add the ```valdr-type``` directive in your form on any parent element of the input fields that you want to validate.
The **important** thing is, that the attribute ```name``` on the input field matches the field name in the constraints JSON.

```html
<form name="yourForm" novalidate valdr-type="Person">
    <label for="lastName">Last Name</label>
    <input type="text"
           id="lastName"
           name="lastName"
           ng-model="person.lastName">

    <label for="firstName">First Name</label>
    <input type="text"
           id="firstName"
           name="firstName"
           ng-model="person.firstName">
</form>
```
That's it. valdr will now automatically validate the fields with the defined constraints and set the ```$validity``` of these form items.
All violated constraints will be added to the ```valdrViolations``` array on those form items.

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

## Applying validation to custom input widgets
valdr applies validation to ```<input>```, ```<textarea>``` and ```<select>``` HTML elements automatically if those
elements are within a ```valdr-type``` block and there is ```ng-model``` bound to them. If you implemented your own
input widget or used one provided by a library (e.g. ui-select), you can still benefit from valdr validation applied to
that input widget. All you need is to decorate it with the ```enableValdrValidation``` directive. In addition to this,
if you would like to make use of [validation messages](#showing-validation-messages-with-valdr-messages), add the
```enableValdrMessage``` directive to the input widget:
```html
<form name="yourForm" novalidate valdr-type="Person">
    <div valdr-form-group>
        <label for="bestFriend">Best Friend</label>
        <my-select
            id="bestFriend"
            name="bestFriend"
            ng-model="person.bestFriend"
            enable-valdr-validation
            enable-valdr-message>
           <!-- other my-select elements -->
        </my-select>
    </div>
</form>
```

## Showing validation messages with ```valdr-messages```
valdr sets the AngularJS validation states like ```$valid```, ```$invalid``` and ```$error``` on all validated form
elements and forms by default. Additional information like the violated constraints and the messages configured in the
constraints JSON are always set as ```valdrViolations``` array on the individual form items.
With this information, you can either write your own logic to display the validation messages, or use valdr-messages to
automatically show the messages next to the invalid form items.

To enable this behaviour, include ```valdr-message.js``` in your page (which is included in the bower package) and make
use of the ```valdr-form-group``` directive. This directive marks the element, where the valdr messages will be
appended. The ```valdr-form-group``` can wrap multiple valdr validated form items. Each form item has to have at least
one surrounding ```valdr-form-group``` to automatically show validation messages.

### Message template
The default message template to be used by valdr-messages can be overridden by configuring the ```valdrMessageProvider```:

```javascript
valdrMessageProvider.setTemplate('<div class="valdr-message">{{ violation.message }}</div>');

// or

valdrMessageProvider.setTemplateUrl('/partials/valdrMesssageTemplate.html');
```

The following variables will be available on the scope of the message template:
- ```violations``` - an array of all violations for the current form field
- ```violation``` - the first violation, if multiple constraints are violated it will be the one that is first declared in the JSON structure
- ```formField``` - the invalid form field

### CSS to control visibility
valdr sets some CSS classes on elements with the ```valdr-form-group``` directive and on the message elements which are
automatically added by ```valdr-messages```. These classes allow you to control the visibility of the validation
messages.

To change the CSS class names used by valdr, you can inject ```valdrClasses```and override the following values:

```javascript
{
  // added on all elements with valdr-form-group directive
  formGroup: 'form-group',
  // added on valdr-form-group and on valdr-messages if all of the form items are valid
  valid: 'ng-valid',
  // added on valdr-form-group and on valdr-messages if one of the form items is invalid
  invalid: 'ng-invalid',
  // added on valdr-messages if the form item this message is associated with is dirty
  dirty: 'ng-dirty',
  // added on valdr-messages if the form item this message is associated with is pristine
  pristine: 'ng-pristine',
  // added on valdr-messages if the form item this message is associated with has been blurred
  touched: 'ng-touched',
  // added on valdr-messages if the form item this message is associated with has not been blurred
  untouched: 'ng-untouched',
  // added on valdr-form-group if one of the contained items is currently invalid, dirty and has been blurred
  invalidDirtyTouchedGroup: 'valdr-invalid-dirty-touched-group'
}
```

Using CSS like the following, the messages can be shown only on inputs which the user changed, blurred and are invalid:

```css
.valdr-message {
  display: none;
}
.valdr-message.ng-invalid.ng-touched.ng-dirty {
  display: inline;
  background: red;
}
```

### Integration of angular-translate
To support i18n of the validation messages, valdr has built-in support for [angular-translate](https://github.com/angular-translate/angular-translate).

Instead of adding the message directly to the constraints, use a message key and add the translations to the ```$translateProvider```.
In the translations, the constraint arguments and the field name can be used with placeholders as in the following
example:

```javascript
valdrProvider.addConstraints({
  'Person': {
    'lastName': {
      'size': {
        'min': 5,
        'max': 20,
        'message': 'message.size'
      }
    }
  }
});

$translateProvider.translations('en', {
  'message.size': '{{fieldName}} must be between {{min}} and {{max}} characters.',
  'Person.lastName': 'Last name'
});

$translateProvider.translations('de', {
  'message.size': 'Zwischen {{min}} und {{max}} Zeichen sind im Feld {{fieldName}} erlaubt.',
  'Person.lastName': 'Nachname'
});
```

#### Custom field name translation keys
By default the translation key for the field name is put together as ```Type.Fieldname```, but
sometimes your translations might be a bit more complicated and you need more freedom when
generating your field names translation key. For example you would like to use an article in
another language to make it sound more natural.

This can be achieved by defining a `valdrFieldNameKeyGenerator` function like this:

```javascript
module.factory('valdrFieldNameSuffix', function() {
  return function(violation) {
    return violation.type + '.' + violation.field + '.' + violation.validator + 'Name';
  }
});

valdrProvider.addConstraints({
  'Person': {
    'lastName': {
      'required': { 'message': 'message.required' }
    }
  }
});

$translateProvider.translations('en', {
  'message.required': 'Please enter {{fieldName}}.',
  'Person.lastName.requiredName' : 'the Last name'
  }
});

$translateProvider.translations('de', {
  'message.required': 'Bitte geben sie {{fieldName}} ein.',
  'Person.lastName.requiredName': 'den Nachnamen'
});
```

### Show messages for AngularJS built-in validators
valdr also allows to show messages for the AngularJS built-in validators like ```required``` and ```number```.
To enable this, set ```valdrMessage.angularMessagesEnabled``` to true in the run phase:

```javascript
valdrMessage.angularMessagesEnabled = true;
```

After that, the messages can be registered by validator name in the ```valdrMessageProvider```:

```javascript
valdrMessage.addMessages({
  'required': 'This field is required.',
  'number': 'Not a valid number.'
});
```

To register messages for specific fields, the type and the field name can be prepended:
```javascript
valdrMessage.addMessages({
  'Person.lastName.required': 'This last name is required.',
  'Person.age.number': 'The age has to be a number.'
});
```

When ```angular-translate``` is loaded it is also possible to register message keys instead of the messages.

A complete example of mixed valdr and AngularJS validation can be found on the [demo page](demo/message/angular-validation.html).

## Conditionally enable/disable validation
The ```valdrEnabled``` directive allows to dynamically enable and disable the validation with valdr. All form elements
in a child node of an element with the 'valdr-enabled' directive will be affected by this.

Usage:
```html
<div valdr-enabled="isValidationEnabled()">
  <input type="text" name="name" ng-model="mymodel.field">
</div>
```
If multiple valdr-enabled directives are nested, the one nearest to the validated form element will take precedence.

## Wire up your back-end

To load the validation constraints from your back-end, you can configure the ```valdrProvider``` in a ```config```
function like this:

```javascript
yourApp.config(function(valdrProvider) {
  valdrProvider.setConstraintUrl('/api/constraints');
});
```

### Using JSR303 Bean Validation with Java back-ends

If you have a Java back-end and use Bean Validation (JSR 303) annotations, check out the [valdr-bean-validation](https://github.com/netceteragroup/valdr-bean-validation)
project. It parses Java model classes for Bean Validation constraints and extracts their information into a JSON document
to be used by valdr. This allows to apply the exact same validation rules on the server and on the AngularJS client.

### Using DataAnnotation with C# back-ends

If you have a c# back-end and use DataAnnotation, check out the [valdr-dotnet](https://github.com/netceteragroup/valdr-dotnet)
project. It parses C# classes for DataAnnotation attributes and extracts their information into into a JSON document
to be used by valdr. This allows to apply the exact same validation rules on the server and on the AngularJS client.

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

Open [http://localhost:3005/demo](http://localhost:3005/demo) in your browser.

## Support

[Ask a question on Stack Overflow](http://stackoverflow.com/questions/ask?tags=valdr) and tag it with [`valdr`](http://stackoverflow.com/tags/valdr).

## License

[MIT](http://opensource.org/licenses/MIT) © Netcetera AG

## Credits
Thanks a lot to [all contributors](https://github.com/netceteragroup/valdr/graphs/contributors) and the guys who brainstormed the name for this project over a dinner on [mount Rigi](https://maps.google.com/maps?q=Hotel+Rigi+Kaltbad&hl=en&cid=7481422441262508040&gl=US&hq=Hotel+Rigi+Kaltbad&t=m&z=16) with us.
* [Björn Mosler](https://github.com/bjorm)
* [Roland Weiss](https://github.com/rolego), father of 'valdr'
* [Jason Brazile](https://github.com/jbrazile)
