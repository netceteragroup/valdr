angular.module('valdr')

  .factory('futureValidator', ['valdrUtil', function (valdrUtil) {

    return {
      name: 'Future',

      /**
       * Checks if the value is a date in the future.
       *
       * @param value the value to validate
       * @returns {boolean} true if empty, null, undefined or a date in the future, false otherwise
       */
      validate: function (value) {
        var valueAsMoment = moment(value);
        var now = moment();
        return valdrUtil.isEmpty(value) || (valueAsMoment.isValid() && valueAsMoment.isAfter(now));
      }
    };
  }]);
