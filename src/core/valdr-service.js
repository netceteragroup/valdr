angular.module('valdr')

  .provider('valdr', function () {

    var validationRules = {}, validators = {}, validationRulesUrl, loadingRules = false,
      validatorNames = ['sizeValidator', 'requiredValidator'];

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

    this.$get =
      ['$log', '$injector', '$rootScope', '$http', 'valdrEvents', 'valdrUtil',
      function($log, $injector, $rootScope, $http, valdrEvents, valdrUtil) {

      // inject all validators
      angular.forEach(validatorNames, function(validatorName) {
        var validator = $injector.get(validatorName);
        validators[validator.name] = validator;
      });

      // load validation rules via $http if validationRulesUrl is configured
      if (validationRulesUrl) {
        loadingRules = true;
        $http.get(validationRulesUrl).then(function (response) {
          loadingRules = false;
          addValidationRules(response.data);
          $rootScope.$broadcast(valdrEvents.rulesChanged);
        }).finally(function () {
          loadingRules = false;
        });
      }

      var getValidationRulesForType = function (type) {
        if (valdrUtil.has(validationRules, type)) {
          return validationRules[type];
        } else if (!loadingRules) {
          $log.warn('No validation rules for type ' + type + ' available.');
        }
      };

      return {
        /**
         * Validates the value of the given type with the validation rules for the given field name.
         * @param typeName the type name
         * @param fieldName the field name
         * @param value the value to validate
         * @returns {*}
         */
        validate: function (typeName, fieldName, value) {

          var validResult = { valid: true };
          var validationRules = getValidationRulesForType(typeName);

          if (valdrUtil.has(validationRules, fieldName)) {
            var fieldValidationRules = validationRules[fieldName],
                fieldIsValid = true,
                violations = [];

            angular.forEach(fieldValidationRules, function (validationRules, validatorName) {

              var validator = validators[validatorName];
              if (angular.isUndefined(validator)) {
                $log.warn('No validator defined for \'' + validatorName + '\'. Can not validate field ' + fieldName);
                return validResult;
              }

              var valid = validator.validate(value, validationRules);
              if (!valid) {
                violations.push(validationRules);
              }
              fieldIsValid = fieldIsValid && valid;
            });

            return {
              valid: fieldIsValid,
              violations: violations
            };
          } else {
            return validResult;
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