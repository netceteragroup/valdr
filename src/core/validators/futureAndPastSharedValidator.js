angular.module('valdr')

  .factory('futureAndPastSharedValidator', ['valdrUtil', function (valdrUtil) {

    var someAlternativeDateFormats = ['D-M-YYYY', 'D.M.YYYY', 'D/M/YYYY', 'D. M. YYYY', 'YYYY.M.D'];

    return {
      validate: function (value, comparison) {
        var now = moment(), valueAsMoment;

        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        valueAsMoment = moment(value);

        for (var i = 0; i < someAlternativeDateFormats.length && !valueAsMoment.isValid(); i++) {
          valueAsMoment = moment(value, someAlternativeDateFormats[i], true);
        }

        return valueAsMoment.isValid() && comparison(valueAsMoment, now);
      }
    };
  }]);
