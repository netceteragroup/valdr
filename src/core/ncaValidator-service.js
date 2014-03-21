angular.module('ncaModelValidation')

  .factory('ncaValidator', function ($log, lodash, notNullValidator, sizeValidator) {


    var VALIDATIONS = {
      'Person': {
        'lastName': {
          'Size': {
            'min': 2,
            'max': 10,
            'message': 'javax.validation.constraints.Size.message'
          }
        },
        'firstName': {
          'Size': {
            'min': 2,
            'max': 20,
            'message': 'javax.validation.constraints.Size.message'
          }
        },
        'zipCode': {
          'Digits': {
            'integer': 4,
            'fraction': 0,
            'message': 'javax.validation.constraints.Digits.message'
          }
        }
      }
    };

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

        $log.debug('validating type: ' + typeName + ' field: ' +  fieldName + ' value: ' + value);

        var validationRules = getValidationRulesForType(typeName);

        if (lodash.has(validationRules, fieldName)) {
          var fieldValidationRules = validationRules[fieldName];

          var isValid = true;
          var validationMessages = [];

          lodash.forOwn(fieldValidationRules, function (validationRules, validatorName) {
            $log.debug('Validating with validator: ' + validatorName + ' Rules: ' + JSON.stringify(validationRules));

            var validator = validators[validatorName];
            if (angular.isUndefined(validator)) {
              $log.error('No validator defined for \'' + validatorName + '\'. Can not validate field ' + fieldName);
              return { valid: true };
            }

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