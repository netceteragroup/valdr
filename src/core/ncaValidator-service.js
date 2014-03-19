'use strict';

angular.module('orca.common.validation')
  .factory('orcaValidator', function ($log, _, VALIDATIONS, notNullValidator, sizeValidator) {

    var getClassValidationRules = function (className) {
      if (!_.has(VALIDATIONS, className)) {
        throw new Error('No validation rules for class ' + className + ' available.');
      }
      return VALIDATIONS[className];
    };

    // init validator map
    var validators = {};
    validators[notNullValidator.name] = notNullValidator;
    validators[sizeValidator.name] = sizeValidator;

    return {

      /**
       * Validates the value of the given class with the validation rules for the given field name.
       * @param className the class name
       * @param fieldName the field name
       * @param value the value to validate
       * @returns {*}
       */
      validate: function (className, fieldName, value) {

        $log.debug('validating class: ' + className +
          ' field: ' +  fieldName +
          ' value: ' + value);

        var classValidationRules = getClassValidationRules(className);

        if (_.has(classValidationRules, fieldName)) {
          var fieldValidationRules = classValidationRules[fieldName];

          var isValid = true;
          var validationMessages = [];

          _.forOwn(fieldValidationRules, function (validationRules, validatorName) {
            $log.debug('validating with:' + validatorName + ' rules: ' + JSON.stringify(validationRules));
            var validationResult = validators[validatorName].validate(validationRules, value);
            if (!validationResult.valid) {
              validationMessages.push(validationResult);
            }
            isValid = isValid && validationResult.valid;
          });

          return {
            valid: isValid,
            messages: validationMessages
          };
        } else {
          return { valid: true };
        }
      }
    };
  });