angular.module('valdr')

/**
 * Exposes utility functions used in validators and valdr core.
 */
  .factory('valdrUtil', [function () {

    var substringAfterDot = function (string) {
      if (string.lastIndexOf('.') === -1) {
        return string;
      } else {
        return string.substring(string.lastIndexOf('.') + 1, string.length);
      }
    };

    var SLUG_CASE_REGEXP = /[A-Z]/g;
    var slugCase = function (string) {
      return string.replace(SLUG_CASE_REGEXP, function(letter, pos) {
        return (pos ? '-' : '') + letter.toLowerCase();
      });
    };

    /**
     * Converts the given validator name to a validation token. Uses the last part of the validator name after the
     * dot (if present) and converts camel case to slug case (fooBar -> foo-bar).
     * @param validatorName the validator name
     * @returns {string} the validation token
     */
    var validatorNameToToken = function (validatorName) {
      if (angular.isString(validatorName)) {
        var name = substringAfterDot(validatorName);
        name = slugCase(name);
        return 'valdr-' + name;
      } else {
        return validatorName;
      }
    };

    return {
      validatorNameToToken: validatorNameToToken,

      isNaN: function (value) {
        // `NaN` as a primitive is the only value that is not equal to itself
        // (perform the [[Class]] check first to avoid errors with some host objects in IE)
        return this.isNumber(value) && value !== +value;
      },

      isNumber: function (value) {
        var type = typeof value;
        return type === 'number' ||
          value && type === 'object' && Object.prototype.toString.call(value) === '[object Number]' || false;
      },

      has: function (object, key) {
        return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
      },

      /**
       * @param value the value
       * @returns {boolean} true if the given value is not null, not undefined, not an empty string, NaN returns false
       */
      notEmpty: function (value) {
        if (this.isNaN(value)) {
          return false;
        }
        if (angular.isArray(value) && value.length === 0){
          return false;
        }
        return angular.isDefined(value) && value !== '' && value !== null;
      },

      /**
       * @param value the value to validate
       * @returns {boolean} true if the given value is null, undefined, an empty string, NaN returns false
       */
      isEmpty: function (value) {
        if (this.isNaN(value)) {
          return false;
        }
        return !this.notEmpty(value);
      },

      /**
       * Checks if a string value starts with a given prefix.
       *
       * @param value the value
       * @param prefix the prefix
       * @returns {boolean} true if the given value starts with the given prefix.
       */
      startsWith: function (value, prefix) {
        return angular.isString(value)  &&
          angular.isString(prefix) &&
          value.lastIndexOf(prefix, 0) === 0;
      }
    };
  }])
;
