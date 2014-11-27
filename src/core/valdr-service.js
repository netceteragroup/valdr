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

    var removeConstraints = function (constraintNames) {
      if (angular.isArray(constraintNames)) {
        angular.forEach(constraintNames, function (name) {
          delete constraints[name];
        });
      } else if (angular.isString(constraintNames)) {
        delete constraints[constraintNames];
      }
    };

    this.removeConstraints = removeConstraints;

    this.setConstraintUrl = function (url) {
      constraintUrl = url;
    };

    this.addValidator = function (validatorName) {
      validatorNames.push(validatorName);
    };

    this.addConstraintAlias = function (valdrName, alias) {
      if(!angular.isArray(constraintAliases[valdrName])) {
        constraintAliases[valdrName] = [];
      }
      constraintAliases[valdrName].push(alias);
    };

    this.$get =
      ['$log', '$injector', '$rootScope', '$http', 'valdrEvents', 'valdrUtil', 'valdrClasses',
        function ($log, $injector, $rootScope, $http, valdrEvents, valdrUtil, valdrClasses) {

          // inject all validators
          angular.forEach(validatorNames, function (validatorName) {
            var validator = $injector.get(validatorName);
            validators[validator.name] = validator;

            // register validator with aliases
            if(angular.isArray(constraintAliases[validator.name])) {
              angular.forEach(constraintAliases[validator.name], function (alias) {
                validators[alias] = validator;
              });
            }

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
                  validationResults = [],
                  violations = [];

                angular.forEach(fieldConstraints, function (constraint, validatorName) {
                  var validator = validators[validatorName];

                  if (angular.isUndefined(validator)) {
                    $log.warn('No validator defined for \'' + validatorName +
                      '\'. Can not validate field \'' + fieldName + '\'');
                    return validResult;
                  }

                  var valid = validator.validate(value, constraint);
                  var validationResult = {
                    valid: valid,
                    value: value,
                    field: fieldName,
                    type: typeName,
                    validator: validatorName
                  };
                  angular.extend(validationResult, constraint);

                  validationResults.push(validationResult);
                  if (!valid) {
                    violations.push(validationResult);
                  }
                  fieldIsValid = fieldIsValid && valid;
                });

                return {
                  valid: fieldIsValid,
                  violations: violations.length === 0 ? undefined : violations,
                  validationResults: validationResults.length === 0 ? undefined : validationResults
                };
              } else {
                return validResult;
              }
            },
            addConstraints: function (newConstraints) {
              addConstraints(newConstraints);
              $rootScope.$broadcast(valdrEvents.revalidate);
            },
            removeConstraints: function (constraintNames) {
              removeConstraints(constraintNames);
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