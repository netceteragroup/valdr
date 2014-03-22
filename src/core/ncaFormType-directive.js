angular.module('valdr')

  .directive('ncaFormType', function () {
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
        controller.setType(attrs.ncaFormType);
      }
    };
  });
