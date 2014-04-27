angular.module('valdr')

  .factory('valdrPastValidator', ['futureAndPastSharedValidator', function (futureAndPastSharedValidator) {

    return {
      name: 'past',

      /**
       * Checks if the value is a date in the past.
       *
       * @param value the value to validate
       * @returns {boolean} true if empty, null, undefined or a date in the past, false otherwise
       */
      validate: function (value) {
        return futureAndPastSharedValidator.validate(value, function (valueAsMoment, now) {
          return valueAsMoment.isBefore(now);
        });
      }
    };
  }]);
