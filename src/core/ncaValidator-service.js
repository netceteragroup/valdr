angular.module('ncaModelValidation')

  .provider('ncaValidator', function () {

    var validationRules = {}, validators = {}, validatorNames = [], validationRulesUrl;

    var addValidationRules = function (newValidationRules) {
      angular.extend(validationRules, newValidationRules);
    };

    this.addValidationRules = addValidationRules;

    this.setValidationRulesUrl = function (url) {
      validationRulesUrl = url;
    };

    this.addValidator = function (validatorName) {
      validatorNames.push(validatorName);
    };

    this.addValidator('sizeValidator');
    this.addValidator('requiredValidator');

    this.$get =
      ['$log', '$injector', '$rootScope', '$http', 'ncaModelValidationEvents', 'ncaUtil',
      function($log, $injector, $rootScope, $http, ncaModelValidationEvents, ncaUtil) {

      angular.forEach(validatorNames, function(validatorName) {
        var validator = $injector.get(validatorName);
        validators[validator.name] = validator;
      });

      if (validationRulesUrl) {
        $http.get(validationRulesUrl).then(function (response) {
          addValidationRules(response.data);
          $rootScope.$broadcast(ncaModelValidationEvents.rulesChanged);
        });
      }

      var getValidationRulesForType = function (typeName) {
        if (!ncaUtil.has(validationRules, typeName)) {
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

          var validationRules = getValidationRulesForType(typeName);
          if (ncaUtil.has(validationRules, fieldName)) {
            var fieldValidationRules = validationRules[fieldName],
                isValid = true,
                validationMessages = [];

            ncaUtil.forOwn(fieldValidationRules, function (validatorName, validationRules) {

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
    }];
  });