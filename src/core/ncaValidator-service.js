angular.module('ncaModelValidation')

  .provider('ncaValidator', function () {

    var validationRules = {}, validators = {}, validationRulesUrl;

    var addValidationRules = function (newValidationRules) {
      angular.extend(validationRules, newValidationRules);
    };

    this.addValidationRules = addValidationRules;

    this.setValidationRulesUrl = function (url) {
      validationRulesUrl = url;
    };

    this.$get = function($log, $rootScope, $http, ncaModelValidationEvents, lodash, notNullValidator, sizeValidator) {

      validators[notNullValidator.name] = notNullValidator;
      validators[sizeValidator.name] = sizeValidator;

      if (validationRulesUrl) {
        $http.get(validationRulesUrl).then(function (response) {
          addValidationRules(response.data);
          $rootScope.$broadcast(ncaModelValidationEvents.rulesChanged);
        });
      }

      var getValidationRulesForType = function (typeName) {
        if (!lodash.has(validationRules, typeName)) {
          $log.warn('No validation rules for type ' + typeName + ' available.');
          return;
        }
        return validationRules[typeName];
      };

      var valid = { valid: true };

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
                $log.warn('No validator defined for \'' + validatorName + '\'. Can not validate field ' + fieldName);
                return valid;
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
            return valid;
          }
        },
        addValidationRules: function (newValidationRules) {
          addValidationRules(newValidationRules);
          $rootScope.$broadcast(ncaModelValidationEvents.rulesChanged);
        },
        getValidationRules: function () {
          return validationRules;
        }
      };
    };
  });