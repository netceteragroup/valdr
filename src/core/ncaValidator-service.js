angular.module('ncaModelValidation')

  .factory('ncaValidator', function ($log, lodash, VALIDATIONS, notNullValidator, sizeValidator) {

    var getValidationRulesForType = function (typeName) {
      if (!lodash.has(VALIDATIONS, typeName)) {
        throw new Error('No validation rules for type ' + typeName + ' available.');
      }
      return VALIDATIONS[typeName];
    };

    // init validator map
    var validators = {};
    validators[notNullValidator.name] = notNullValidator;
    validators[sizeValidator.name] = sizeValidator;

    return {

      /**
       * Validates the value of the given type with the validation rules for the given field name.
       * @param typeName the type name
       * @param fieldName the field name
       * @param value the value to validate
       * @returns {*}
       */
      validate: function (typeName, fieldName, value) {

        $log.debug('validating type: ' + typeName +
          ' field: ' +  fieldName +
          ' value: ' + value);

        var validationRules = getValidationRulesForType(typeName);

        if (lodash.has(validationRules, fieldName)) {
          var fieldValidationRules = validationRules[fieldName];

          var isValid = true;
          var validationMessages = [];

          lodash.forOwn(fieldValidationRules, function (validationRules, validatorName) {
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