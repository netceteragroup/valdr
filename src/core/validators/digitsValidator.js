angular.module('valdr')

  .factory('valdrDigitsValidator', ['valdrUtil', function (valdrUtil) {

    // matches everything except digits and '.' as decimal separator
    var regexp = new RegExp('[^.\\d]', 'g');

    /**
     * By converting to number and back to string using toString(), we make sure that '.' is used as decimal separator
     * and not the locale specific decimal separator.
     * As we already checked for NaN at this point, we can do this safely.
     */
    var toStringWithoutThousandSeparators = function (value) {
      return Number(value).toString().replace(regexp, '');
    };

    var isNotLongerThan = function (valueAsString, maxLengthConstraint) {
      return !valueAsString ? true : valueAsString.length <= maxLengthConstraint;
    };

    var doValidate = function (value, constraint) {
      var integerConstraint = constraint.integer,
        fractionConstraint = constraint.fraction,
        cleanValueAsString, integerAndFraction;

      cleanValueAsString = toStringWithoutThousandSeparators(value);
      integerAndFraction = cleanValueAsString.split('.');

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
