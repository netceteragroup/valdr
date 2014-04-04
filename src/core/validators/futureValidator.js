angular.module('valdr')

  .factory('futureValidator', ['futureAndPastSharedValidator', function (futureAndPastSharedValidator) {

    return {
      name: 'Future',

      /**
       * Checks if the value is a date in the future.
       *
       * @param value the value to validate
       * @returns {boolean} true if empty, null, undefined or a date in the future, false otherwise
       */
      validate: function (value) {

        return futureAndPastSharedValidator.validate(value, function (valueAsMoment, now) {
          return valueAsMoment.isAfter(now);
        });
      }
    };
  }]);
