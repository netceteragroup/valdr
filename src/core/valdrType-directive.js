angular.module('valdr')

  /**
   * The valdrType directive defines the type of the model to be validated.
   * The directive exposes the type through the controller to allow access to it by wrapped directives.
   */
  .directive('valdrType', function () {
    return  {
      controller: function() {
        var type;

        this.setType = function (newType) {
          type = newType;
        };

        this.getType = function () {
          return type;
        };
      },
      priority: 1,
      link: function (scope, element, attrs, controller) {
        controller.setType(attrs.valdrType);
      }
    };
  });
