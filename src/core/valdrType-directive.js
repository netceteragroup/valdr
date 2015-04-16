angular.module('valdr')

/**
 * The valdrType directive defines the type of the model to be validated.
 * The directive exposes the type through the controller to allow access to it by wrapped directives.
 */
  .directive('valdrType', function () {
    return {
      priority: 1,
      controller: ['$attrs', function ($attrs) {

        var values = {};

        this.getType = function () {
          return $attrs.valdrType;
        };

        this.setValue = function (fieldName, value) {
          values[fieldName] = value;
        };

        this.getValue = function (fieldName) {
          return values[fieldName];
        };

        this.getValues = function () {
          return angular.copy(values);
        };

      }]
    };
  });
