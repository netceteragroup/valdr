angular.module('valdr')

  .provider('valdr', function () {

    var constraints = {}, validators = {}, constraintUrl, constraintsLoading,
      validatorNames = ['sizeValidator', 'requiredValidator'];

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

    this.$get =
      ['$log', '$injector', '$rootScope', '$http', 'valdrEvents', 'valdrUtil',
      function($log, $injector, $rootScope, $http, valdrEvents, valdrUtil) {

      // inject all validators
      angular.forEach(validatorNames, function(validatorName) {
        var validator = $injector.get(validatorName);
        validators[validator.name] = validator;
      });

      // load constraints via $http if constraintUrl is configured
      if (constraintUrl) {
        constraintsLoading = true;
        $http.get(constraintUrl).then(function (response) {
          constraintsLoading = false;
          addConstraints(response.data);
          $rootScope.$broadcast(valdrEvents.constraintsChanged);
        }).finally(function () {
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
         * @param typeName the type name
         * @param fieldName the field name
         * @param value the value to validate
         * @returns {*}
         */
        validate: function (typeName, fieldName, value) {

          var validResult = { valid: true };
          var typeConstraints = constraintsForType(typeName);

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
                  validator: validatorName
                };
                angular.extend(violation, constraint);
                violations.push(violation);
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
        addConstraints: function (newConstraints) {
          addConstraints(newConstraints);
          $rootScope.$broadcast(valdrEvents.constraintsChanged);
        },
        getConstraints: function () {
          return constraints;
        }
      };
    }];
  });