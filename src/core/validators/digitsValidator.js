angular.module('valdr')

  .factory('valdrDigitsValidator', ['valdrUtil', function (valdrUtil) {

    var decimalSeparator = 1.1.toLocaleString().substring(1, 2); // jshint ignore:line

    var removeAnythingButDigitsAndDecimalSeparator = function (value) {
      var regex = new RegExp('[^' + decimalSeparator + '\\d]', 'g');
      // at this point 'value' can still be a number or a string or...
      return value.toString().replace(regex, '');
    };

    var isNotLongerThan = function (valueAsString, maxLengthConstraint) {
      return !valueAsString ? true : valueAsString.length <= maxLengthConstraint;
    };

    var doValidate = function (value, constraint) {
      var integerConstraint = constraint.integer,
        fractionConstraint = constraint.fraction,
        cleanValueAsString, integerAndFraction;

      cleanValueAsString = removeAnythingButDigitsAndDecimalSeparator(value);
      integerAndFraction = cleanValueAsString.split(decimalSeparator);

      return isNotLongerThan(integerAndFraction[0], integerConstraint) &&
        isNotLongerThan(integerAndFraction[1], fractionConstraint);
    };

    return {
      name: 'digits',

      /**
       * Checks if the value is a number within accepted range.
       *
       * @param value the value to validate
       * @param constraint the validation constraint, it is expected to have integer and fraction properties (maximum
       *                   number of integral/fractional digits accepted for this number)
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {

        if (valdrUtil.isEmpty(value)) {
          return true;
        }
        if (valdrUtil.isNaN(Number(value))) {
          return false;
        }

        return doValidate(value, constraint);
      }
    };
  }]);
