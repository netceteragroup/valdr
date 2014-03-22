angular.module('ncaModelValidation')

/**
 * Exposes util functions for dependency injection.
 */
  .factory('ncaUtil', function () {
    return {
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
       * Iterates over own enumerable properties of an object executing the callback
       * for each property. The callback is bound to `thisArg` and invoked with three
       * arguments; (property, value).
       *
       * @static
       * @memberOf _
       * @category Objects
       * @param {Object} object The object to iterate over.
       * @param {Function} [callback=identity] The function called per iteration.
       * @example
       *
       * forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(property, value) {
       *   console.log(property);
       * });
       * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
       */
      forOwn: function (object, callback) {
        var name;
        for (name in object) {
          if (object.hasOwnProperty(name)) {
            callback(name, object[name]);
          }
        }
      }
    };
  })
;