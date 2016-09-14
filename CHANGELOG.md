# Changelog
## 1.1.6 - 2016-09-14
- Fix: min length validator and size validator validate only length [#107](https://github.com/netceteragroup/valdr/pull/107)
- Fix: Fixed memory leak in valdrMessage-directive [#105](https://github.com/netceteragroup/valdr/pull/105)
- Fix: Unable to validate multiselect dropdowns [#101](https://github.com/netceteragroup/valdr/issues/101)

## 1.1.5 - 2015-09-22
- Don't throw exception if an input has no name and valdr is disabled [#92](https://github.com/netceteragroup/valdr/pull/92)

## 1.1.4 - 2015-08-11
- Fix: valdrMessage does not add messages of angular validation directives [#90](https://github.com/netceteragroup/valdr/issues/90)

## 1.1.3 - 2015-06-22
- Support to validate non-input/-select/-textarea widgets [#83](https://github.com/netceteragroup/valdr/issues/83) [documentation](https://github.com/netceteragroup/valdr#applying-validation-to-custom-input-widgets)

## 1.1.2 - 2015-05-03
- Support dynamically added and removed form items, see [#62](https://github.com/netceteragroup/valdr/issues/62)
- Support showing validation messages for AngularJS built-in validators, see [#58](https://github.com/netceteragroup/valdr/issues/58)

## 1.1.1 - 2015-01-04
- introduce ```valdrEnabled``` directive to conditionally enable/disable validation, see [#54](https://github.com/netceteragroup/valdr/issues/54)
- fix bug that after removing constraints from valdr with valdr.removeConstraints(), the validity state of previously validated form items was not reset. see [#55](https://github.com/netceteragroup/valdr/issues/55)

## 1.1.0 - 2014-12-09
- added new valdrFormGroup directive which sets validity state for a group of form items and is responsible for adding and removing validation messages if valdr-message is loaded, see [#11](https://github.com/netceteragroup/valdr/issues/11), fixes [#44](https://github.com/netceteragroup/valdr/issues/44), fixes [#48](https://github.com/netceteragroup/valdr/issues/48)
- support multiple aliases for constraint names, see [#30](https://github.com/netceteragroup/valdr/issues/30)
- use the latest regular expression to validate e-mail addresses used in AngularJS, see [#33](https://github.com/netceteragroup/valdr/issues/33)
- use new $validators pipeline from AngularJS 1.3 instead of $parsers and $formatters for validation, see [#35](https://github.com/netceteragroup/valdr/issues/35)
- renamed no-valdr-message to valdr-no-message, see [#42](https://github.com/netceteragroup/valdr/issues/42)
- use ng-show in the default message template instead of ng-if, fixes [#49](https://github.com/netceteragroup/valdr/issues/49)

**BREAKING CHANGES**
- valdr now requires AngularJS 1.3.x.
- Before 1.1.0 a class named ```form-group``` was used to group multiple form items and add overall validity state. In 1.1.0
the new directive ```valdr-form-group``` was introduced for this purpose. All valdr validated form fields register with
the next parent element with the ```valdr-form-group```directive (if present). The directive sets the form groups validity
(```ng-valid```, ```ng-invalid```) and the class ```valdr-invalid-dirty-touched-group``` if one of the form items is
invalid, has been changed and the user blurred out of the form item. Besides that, if ```valdr-messages```
is used to add validation messages, the ```valdr-form-group``` directive is the element in the DOM which adds and
removes validation messages for all form items in the group.
- the attribute ```no-valdr-message``` was renamed to ```valdr-no-message``` to disable message adding for individual
form items

## 1.0.2 - 2014-11-18
- added new option ```valdr-no-validate``` to disable valdr validation on specific form elements, see [#41](https://github.com/netceteragroup/valdr/pull/41)
- validity is now set for each valdr validator on ngModel controller, see [#37](https://github.com/netceteragroup/valdr/issues/37)
- NOTE: this will be the last valdr version with support for AngularJS versions below 1.3

## 1.0.1 - 2014-07-16
- Revalidate field with $modelValue instead of $viewValue on constraint change event, fixes [#34](https://github.com/netceteragroup/valdr/pull/34)

## 1.0.0 - 2014-06-27
- added support for isolated scopes around valdr-message directive, closes [#32](https://github.com/netceteragroup/valdr/issues/32)

## 0.2.0 - 2014-05-03
- add hibernateEmail validator, closes [#26](https://github.com/netceteragroup/valdr/issues/26)
- add hibernateUrl validator, closes [#27](https://github.com/netceteragroup/valdr/issues/27)
- add support for <textarea> elements, closes [#22](https://github.com/netceteragroup/valdr/issues/22)
- support form groups with multiple levels, closes [#29](https://github.com/netceteragroup/valdr/issues/29)
- add min/max validators for numbers
- prefixed all internal validator services with valdr to avoid name collisions

## 0.1.1 - 2014-04-17
- add support for <select> elements, closes [#20](https://github.com/netceteragroup/valdr/issues/20)
