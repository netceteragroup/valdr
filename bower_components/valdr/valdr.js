/**
 * valdr - v0.2.0 - 2014-06-04
 * https://github.com/netceteragroup/valdr
 * Copyright (c) 2014 Netcetera AG
 * License: MIT
 */
(function (window, document) {
'use strict';

angular.module('valdr', ['ng'])
  .constant('valdrEvents', {
    'revalidate': 'valdr-revalidate'
  })
  .value('valdrClasses', {
    valid: 'has-success',
    invalid: 'has-error',
    dirtyBlurred: 'dirty-blurred',
    formGroup: 'form-group'
  });
angular.module('valdr')

/**
 * Exposes utility functions used in validators and valdr core.
 */
  .factory('valdrUtil', ['valdrClasses', function (valdrClasses) {
    return {

      isNaN: function (value) {
        // `NaN` as a primitive is the only value that is not equal to itself
        // (perform the [[Class]] check first to avoid errors with some host objects in IE)
        return this.isNumber(value) && value !== +value;
      },

      isNumber: function (value) {
        var type = typeof value;
        return type === 'number' ||
          value && type === 'object' && Object.prototype.toString.call(value) === '[object Number]' || false;
      },

      has: function (object, key) {
        return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
      },

      /**
       * @param value the value
       * @returns {boolean} true if the given value is not null, not undefined, not an empty string, NaN returns false
       */
      notEmpty: function (value) {
        if (this.isNaN(value)) {
          return false;
        }
        return angular.isDefined(value) && value !== '' && value !== null;
      },

      /**
       * @param value the value to validate
       * @returns {boolean} true if the given value is null, undefined, an empty string, NaN returns false
       */
      isEmpty: function (value) {
        if (this.isNaN(value)) {
          return false;
        }
        return !this.notEmpty(value);
      },

      /**
       * Finds the parent element with the class defined in valdrClasses.formGroup. Only searches 3 levels above
       * the given element. If no element is found with this class, returns the parent of the given element.
       * @param element the element
       * @returns {*} the wrapping form group
       */
      findWrappingFormGroup: function (element) {
        var parent = element.parent();
        for (var i = 0; i < 3; i++) {
          if (parent.hasClass(valdrClasses.formGroup)) {
            return parent;
          } else {
            parent = parent.parent();
          }
        }
        return element.parent();
      }
    };
  }])
;
angular.module('valdr')

  .factory('valdrRequiredValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'required',

      /**
       * Checks if the value is not empty.
       *
       * @param value the value to validate
       * @returns {boolean} true if the value is not empty
       */
      validate: function (value) {
        return valdrUtil.notEmpty(value);
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrMinValidator', ['valdrUtil', function (valdrUtil) {

    return {
      name: 'min',

      /**
       * Checks if the value is a number and higher or equal as the value specified in the constraint.
       *
       * @param value the value to validate
       * @param constraint the validation constraint
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var minValue = Number(constraint.value),
          valueAsNumber = Number(value);


        if (valdrUtil.isNaN(value)) {
          return false;
        }

        return valdrUtil.isEmpty(value) || valueAsNumber >= minValue;
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrMaxValidator', ['valdrUtil', function (valdrUtil) {

    return {
      name: 'max',

      /**
       * Checks if the value is a number and lower or equal as the value specified in the constraint.
       *
       * @param value the value to validate
       * @param constraint the validation constraint
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var maxValue = Number(constraint.value),
          valueAsNumber = Number(value);

        if (valdrUtil.isNaN(value)) {
          return false;
        }

        return valdrUtil.isEmpty(value) || valueAsNumber <= maxValue;
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrSizeValidator', function () {
    return {
      name: 'size',

      /**
       * Checks if the values length is in the range specified by the constraints min and max properties.
       *
       * @param value the value to validate
       * @param constraint with optional values: min, max
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var minLength = constraint.min || 0,
          maxLength = constraint.max;

        value = value || '';
        return value.length >= minLength &&
          (maxLength === undefined || value.length <= maxLength);
      }
    };
  });

angular.module('valdr')

  .factory('valdrEmailValidator', ['valdrUtil', function (valdrUtil) {

    // the e-mail pattern used in angular.js
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

    return {
      name: 'email',

      /**
       * Checks if the value is a valid email address.
       *
       * @param value the value to validate
       * @returns {boolean} true if valid
       */
      validate: function (value) {
        return valdrUtil.isEmpty(value) || EMAIL_REGEXP.test(value);
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrUrlValidator', ['valdrUtil', function (valdrUtil) {

    // the url pattern used in angular.js
    var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    return {
      name: 'url',

      /**
       * Checks if the value is a valid url.
       *
       * @param value the value to validate
       * @returns {boolean} true if valid
       */
      validate: function (value) {
        return valdrUtil.isEmpty(value) || URL_REGEXP.test(value);
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrDigitsValidator', ['valdrUtil', function (valdrUtil) {

    var decimalSeparator = 1.1.toLocaleString().substring(1, 2); // jshint ignore:line

    var removeAnythingButDigitsAndDecimalSeparator = function (value) {
      var regex = new RegExp('[^' + decimalSeparator + '\\d]', 'g');
      // at this point 'value' can still be a number or a string or...
      return value.toString().replace(regex, '');
    };

    var isNotLongerThan = function (valueAsString, maxLengthConstraint) {
      return !valueAsString ? true : valueAsString.length <= maxLengthConstraint;
    };

    var doValidate = function (value, constraint) {
      var integerConstraint = constraint.integer,
        fractionConstraint = constraint.fraction,
        cleanValueAsString, integerAndFraction;

      cleanValueAsString = removeAnythingButDigitsAndDecimalSeparator(value);
      integerAndFraction = cleanValueAsString.split(decimalSeparator);

      return isNotLongerThan(integerAndFraction[0], integerConstraint) &&
        isNotLongerThan(integerAndFraction[1], fractionConstraint);
    };

    return {
      name: 'digits',

      /**
       * Checks if the value is a number within accepted range.
       *
       * @param value the value to validate
       * @param constraint the validation constraint, it is expected to have integer and fraction properties (maximum
       *                   number of integral/fractional digits accepted for this number)
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {

        if (valdrUtil.isEmpty(value)) {
          return true;
        }
        if (valdrUtil.isNaN(Number(value))) {
          return false;
        }

        return doValidate(value, constraint);
      }
    };
  }]);

angular.module('valdr')

  .factory('futureAndPastSharedValidator', ['valdrUtil', function (valdrUtil) {

    var someAlternativeDateFormats = ['D-M-YYYY', 'D.M.YYYY', 'D/M/YYYY', 'D. M. YYYY', 'YYYY.M.D'];

    return {
      validate: function (value, comparison) {
        var now = moment(), valueAsMoment;

        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        valueAsMoment = moment(value);

        for (var i = 0; i < someAlternativeDateFormats.length && !valueAsMoment.isValid(); i++) {
          valueAsMoment = moment(value, someAlternativeDateFormats[i], true);
        }

        return valueAsMoment.isValid() && comparison(valueAsMoment, now);
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrPastValidator', ['futureAndPastSharedValidator', function (futureAndPastSharedValidator) {

    return {
      name: 'past',

      /**
       * Checks if the value is a date in the past.
       *
       * @param value the value to validate
       * @returns {boolean} true if empty, null, undefined or a date in the past, false otherwise
       */
      validate: function (value) {
        return futureAndPastSharedValidator.validate(value, function (valueAsMoment, now) {
          return valueAsMoment.isBefore(now);
        });
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrFutureValidator', ['futureAndPastSharedValidator', function (futureAndPastSharedValidator) {

    return {
      name: 'future',

      /**
       * Checks if the value is a date in the future.
       *
       * @param value the value to validate
       * @returns {boolean} true if empty, null, undefined or a date in the future, false otherwise
       */
      validate: function (value) {

        return futureAndPastSharedValidator.validate(value, function (valueAsMoment, now) {
          return valueAsMoment.isAfter(now);
        });
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrPatternValidator', ['valdrUtil', function (valdrUtil) {

    var REGEXP_PATTERN = /^\/(.*)\/([gim]*)$/;

    /**
     * Converts the given pattern to a RegExp.
     * The pattern can either be a RegExp object or a string containing a regular expression (`/regexp/`).
     * This implementation is based on the AngularJS ngPattern validator.
     * @param pattern the pattern
     * @returns {RegExp} the RegExp
     */
    var asRegExp = function (pattern) {
      var match;

      if (pattern.test) {
        return pattern;
      } else {
        match = pattern.match(REGEXP_PATTERN);
        if (match) {
          return new RegExp(match[1], match[2]);
        } else {
          throw ('Expected ' + pattern + ' to be a RegExp');
        }
      }
    };

    return {
      name: 'pattern',

      /**
       * Checks if the value matches the pattern defined in the constraint.
       *
       * @param value the value to validate
       * @param constraint the constraint with the regexp as value
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var pattern = asRegExp(constraint.value);
        return valdrUtil.isEmpty(value) || pattern.test(value);
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrMinLengthValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'minLength',

      /**
       * Checks if the value is a string and if it's at least 'constraint.number' of characters long.
       *
       * @param value the value to validate
       * @param constraint with property 'number'
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var minLength = constraint.number;

        if (valdrUtil.isEmpty(value)) {
          return minLength === 0;
        }

        if (typeof value === 'string') {
          return value.length >= minLength;
        } else {
          return false;
        }
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrMaxLengthValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'maxLength',

      /**
       * Checks if the value is a string and if it's at most 'constraint.number' of characters long.
       *
       * @param value the value to validate
       * @param constraint with property 'number'
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var maxLength = constraint.number;

        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        if (typeof value === 'string') {
          return value.length <= maxLength;
        } else {
          return false;
        }
      }
    };
  }]);

angular.module('valdr')

  .factory('valdrHibernateEmailValidator', ['valdrUtil', function (valdrUtil) {
    var ATOM = '[a-z0-9!#$%&\'*+/=?^_`{|}~-]';
    var DOMAIN = '^' + ATOM + '+(\\.' + ATOM + '+)*$';
    var IP_DOMAIN = '^\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]$';

    var localPattern = new RegExp('^' + ATOM + '+(\\.' + ATOM + '+)*$', 'i');
    var domainPattern = new RegExp(DOMAIN + '|' + IP_DOMAIN, 'i');

    return {
      name: 'hibernateEmail',

      /**
       * Checks if the value is a valid email address using the same patterns as Hibernate uses in its bean validation
       * implementation.
       *
       * @param value the value to validate
       * @returns {boolean} true if valid
       */
      validate: function (value) {
        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        // split email at '@' and consider local and domain part separately
        var emailParts = value.split('@');
        if (emailParts.length !== 2) {
          return false;
        }

        if (!localPattern.test(emailParts[0])) {
          return false;
        }

        return domainPattern.test(emailParts[1]);
      }
    };
  }]);

angular.module('valdr')

  .provider('valdr', function () {

    var constraints = {}, validators = {}, constraintUrl, constraintsLoading, constraintAliases = {},
      validatorNames = [
        'valdrRequiredValidator',
        'valdrSizeValidator',
        'valdrMinLengthValidator',
        'valdrMaxLengthValidator',
        'valdrMinValidator',
        'valdrMaxValidator',
        'valdrEmailValidator',
        'valdrUrlValidator',
        'valdrDigitsValidator',
        'valdrFutureValidator',
        'valdrPastValidator',
        'valdrPatternValidator',
        'valdrHibernateEmailValidator'
      ];

    var addConstraints = function (newConstraints) {
      angular.extend(constraints, newConstraints);
    };

    this.addConstraints = addConstraints;

    this.setConstraintUrl = function (url) {
      constraintUrl = url;
    };

    this.addValidator = function (validatorName) {
      validatorNames.push(validatorName);
    };

    this.addConstraintAlias = function (valdrName, customName) {
      constraintAliases[valdrName] = customName;
    };

    this.$get =
      ['$log', '$injector', '$rootScope', '$http', 'valdrEvents', 'valdrUtil', 'valdrClasses',
        function ($log, $injector, $rootScope, $http, valdrEvents, valdrUtil, valdrClasses) {

          // inject all validators
          angular.forEach(validatorNames, function (validatorName) {
            var validator = $injector.get(validatorName);
            var constraintName = constraintAliases[validator.name] || validator.name;
            validators[constraintName] = validator;
          });

          // load constraints via $http if constraintUrl is configured
          if (constraintUrl) {
            constraintsLoading = true;
            $http.get(constraintUrl).then(function (response) {
              constraintsLoading = false;
              addConstraints(response.data);
              $rootScope.$broadcast(valdrEvents.revalidate);
            })['finally'](function () {
              constraintsLoading = false;
            });
          }

          var constraintsForType = function (type) {
            if (valdrUtil.has(constraints, type)) {
              return constraints[type];
            } else if (!constraintsLoading) {
              $log.warn('No constraints for type \'' + type + '\' available.');
            }
          };

          return {
            /**
             * Validates the value of the given type with the constraints for the given field name.
             *
             * @param typeName the type name
             * @param fieldName the field name
             * @param value the value to validate
             * @returns {*}
             */
            validate: function (typeName, fieldName, value) {

              var validResult = { valid: true },
                typeConstraints = constraintsForType(typeName);

              if (valdrUtil.has(typeConstraints, fieldName)) {
                var fieldConstraints = typeConstraints[fieldName],
                  fieldIsValid = true,
                  violations = [];

                angular.forEach(fieldConstraints, function (constraint, validatorName) {
                  var validator = validators[validatorName];

                  if (angular.isUndefined(validator)) {
                    $log.warn('No validator defined for \'' + validatorName +
                      '\'. Can not validate field \'' + fieldName + '\'');
                    return validResult;
                  }

                  var valid = validator.validate(value, constraint);
                  if (!valid) {
                    var violation = {
                      value: value,
                      field: fieldName,
                      type: typeName,
                      validator: validatorName
                    };
                    angular.extend(violation, constraint);
                    violations.push(violation);
                  }
                  fieldIsValid = fieldIsValid && valid;
                });

                return {
                  valid: fieldIsValid,
                  violations: violations.length === 0 ? undefined : violations
                };
              } else {
                return validResult;
              }
            },
            addConstraints: function (newConstraints) {
              addConstraints(newConstraints);
              $rootScope.$broadcast(valdrEvents.revalidate);
            },
            getConstraints: function () {
              return constraints;
            },
            setClasses: function (newClasses) {
              angular.extend(valdrClasses, newClasses);
              $rootScope.$broadcast(valdrEvents.revalidate);
            }
          };
        }];
  });
angular.module('valdr')

/**
 * The valdrType directive defines the type of the model to be validated.
 * The directive exposes the type through the controller to allow access to it by wrapped directives.
 */
  .directive('valdrType', function () {
    return  {
      priority: 1,
      controller: ['$attrs', function ($attrs) {

        this.getType = function () {
          return $attrs.valdrType;
        };

      }]
    };
  });

/**
 * This directive adds validation to all input and select fields which are bound to an ngModel and are surrounded
 * by a valdrType directive.
 */
var valdrFormItemDirectiveDefinition =
  ['valdrEvents', 'valdr', 'valdrUtil', 'valdrClasses', function (valdrEvents, valdr, valdrUtil, valdrClasses) {
    return  {
      restrict: 'E',
      require: ['?^valdrType', '?^ngModel'],
      link: function (scope, element, attrs, controllers) {

        var valdrTypeController = controllers[0],
          ngModelController = controllers[1],
          fieldName = attrs.name,
          formGroupElement;

        // Stop right here if this is a form item that's either not inside of a valdr-type block
        // or there is no ng-model bound to it.
        if (!valdrTypeController || !ngModelController) {
          return;
        }

        if (valdrUtil.isEmpty(fieldName)) {
          throw new Error('form element is not bound to a field name');
        }

        formGroupElement = valdrUtil.findWrappingFormGroup(element);

        var updateClassOnFormGroup = function (valid) {
          formGroupElement.toggleClass(valdrClasses.valid, valid);
          formGroupElement.toggleClass(valdrClasses.invalid, !valid);
        };

        var updateNgModelController = function (validationResult) {
          ngModelController.$setValidity('valdr', validationResult.valid);
          ngModelController.valdrViolations = validationResult.violations;
        };

        var validate = function (value) {
          var validationResult = valdr.validate(valdrTypeController.getType(), fieldName, value);
          updateNgModelController(validationResult);
          updateClassOnFormGroup(validationResult.valid);
          return validationResult.valid ? value : undefined;
        };

        ngModelController.$parsers.push(validate);
        ngModelController.$formatters.push(validate);

        scope.$on(valdrEvents.revalidate, function () {
          validate(ngModelController.$viewValue);
        });

        element.bind('blur', function () {
          if (ngModelController.$invalid && ngModelController.$dirty) {
            formGroupElement.addClass(valdrClasses.dirtyBlurred);
          }
        });
      }
    };
  }];

angular.module('valdr')
  .directive('input', valdrFormItemDirectiveDefinition)
  .directive('select', valdrFormItemDirectiveDefinition)
  .directive('textarea', valdrFormItemDirectiveDefinition);
})(window, document);