# valdr [![Build Status](https://travis-ci.org/netceteragroup/valdr.svg?branch=master)](https://travis-ci.org/netceteragroup/valdr) [![Coverage Status](https://coveralls.io/repos/netceteragroup/valdr/badge.png?branch=master)](https://coveralls.io/r/netceteragroup/valdr?branch=master)

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

TODO, for now just have a look at the [demos](https://github.com/netceteragroup/valdr/tree/master/demo/core)


## Constraints JSON


```javascript

TODO

```

## Default Validators
TODO add description
- size (min/max string length)
- required
- pattern
- email
- digits (to define number of integral/fractional digits accepted for a number)
- min/max (for numbers)
- future/past (for dates)

## Adding custom validators
TODO

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

Kudos to the gang who brainstormed the name for this project with us over a diner on [mount Rigi](https://maps.google.com/maps?q=Hotel+Rigi+Kaltbad&hl=en&cid=7481422441262508040&gl=US&hq=Hotel+Rigi+Kaltbad&t=m&z=16). Guys we really appreciate your patience!
* [Björn Mosler](https://github.com/brelsom)
* Roland Weiss, father of 'valdr'
* [Jason Brazile](https://github.com/jbrazile)
