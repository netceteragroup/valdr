angular.module('valdr')

  .factory('valdrFutureValidator', ['futureAndPastSharedValidator', function (futureAndPastSharedValidator) {

    return {
      name: 'future',

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
