angular.module('valdr')

  .factory('valdrPatternValidator', ['valdrUtil', function (valdrUtil) {

    var REGEXP_PATTERN = /^\/(.*)\/([gim]*)$/;

    /**
     * Converts the given pattern to a RegExp.
     * The pattern can either be a RegExp object or a string containing a regular expression (`/regexp/`).
     * This implementation is based on the AngularJS ngPattern validator.
     * @param pattern the pattern
     * @returns {RegExp} the RegExp
     */
    var asRegExp = function (pattern) {
      var match;

      if (pattern.test) {
        return pattern;
      } else {
        match = pattern.match(REGEXP_PATTERN);
        if (match) {
          return new RegExp(match[1], match[2]);
        } else {
          throw ('Expected ' + pattern + ' to be a RegExp');
        }
      }
    };

    return {
      name: 'pattern',

      /**
       * Checks if the value matches the pattern defined in the constraint.
       *
       * @param value the value to validate
       * @param constraint the constraint with the regexp as value
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var pattern = asRegExp(constraint.value);
        return valdrUtil.isEmpty(value) || pattern.test(value);
      }
    };
  }]);
