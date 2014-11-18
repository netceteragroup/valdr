# Changelog

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
