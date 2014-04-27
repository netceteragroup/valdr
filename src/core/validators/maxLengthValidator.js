angular.module('valdr')

  .factory('valdrMaxLengthValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'maxLength',

      /**
       * Checks if the value is a string and if it's at most 'constraint.number' of characters long.
       *
       * @param value the value to validate
       * @param constraint with property 'number'
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var maxLength = constraint.number;

        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        if (typeof value === 'string') {
          return value.length <= maxLength;
        } else {
          return false;
        }
      }
    };
  }]);
