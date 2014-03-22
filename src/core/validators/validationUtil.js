angular.module('ncaModelValidation')

  .factory('validationUtil', ['ncaUtil', function (ncaUtil) {
    return {

      /**
       * @param value the value to validate
       * @returns (boolean) true if the given value is not null, not undefined and not NaN
       */
      notNull: function (value) {
        return angular.isDefined(value) && value !== '' && value !== null && !ncaUtil.isNaN(value);
      },

      /**
       * Creates a validation result.
       * @param valid validity of field
       * @param messageKey the message key
       * @param messageParams the message parameters
       */
      result: function (valid, messageKey, messageParams) {
        return {
          valid: valid,
          messageKey: messageKey,
          messageParams: messageParams
        };
      }
    };
  }]);
