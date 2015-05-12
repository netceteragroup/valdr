angular.module('valdr')

/**
 * The valdrType directive defines the type of the model to be validated.
 * The directive exposes the type through the controller to allow access to it by wrapped directives.
 */
  .directive('valdrType', function () {
    return {
      priority: 1,
      controller: ['$attrs', function ($attrs) {

        var fields = {};

        this.getType = function () {
          return $attrs.valdrType;
        };

        this.getValue = function (fieldName) {
          return fields[fieldName]();
        };

        this.getValues = function () {
          var result = {};
          angular.forEach(fields, function(field, name) {
            result[name] = field();
          });
          return result;
        };

        this.registerField = function(name, field) {
          fields[name] = field;
        };

      }]
    };
  });
