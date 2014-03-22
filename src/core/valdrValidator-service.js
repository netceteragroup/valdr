angular.module('valdr')

  .provider('valdrValidator', function () {

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
      ['$log', '$injector', '$rootScope', '$http', 'valdrEvents', 'valdrUtil',
      function($log, $injector, $rootScope, $http, valdrEvents, valdrUtil) {

      angular.forEach(validatorNames, function(validatorName) {
        var validator = $injector.get(validatorName);
        validators[validator.name] = validator;
      });

      if (validationRulesUrl) {
        $http.get(validationRulesUrl).then(function (response) {
          addValidationRules(response.data);
          $rootScope.$broadcast(valdrEvents.rulesChanged);
        });
      }

      var getValidationRulesForType = function (typeName) {
        if (!valdrUtil.has(validationRules, typeName)) {
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
          if (valdrUtil.has(validationRules, fieldName)) {
            var fieldValidationRules = validationRules[fieldName],
                isValid = true,
                validationMessages = [];

            angular.forEach(fieldValidationRules, function (validationRules, validatorName) {

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
          $rootScope.$broadcast(valdrEvents.rulesChanged);
        },
        getValidationRules: function () {
          return validationRules;
        }
      };
    }];
  });