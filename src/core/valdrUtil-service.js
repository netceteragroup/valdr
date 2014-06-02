angular.module('valdr')

/**
 * Exposes utility functions used in validators and valdr core.
 */
  .factory('valdrUtil', ['valdrClasses', function (valdrClasses) {
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
       * @param value the value
       * @returns {boolean} true if the given value is not null, not undefined, not an empty string, NaN returns false
       */
      notEmpty: function (value) {
        if (this.isNaN(value)) {
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
       * Finds the parent element with the class defined in valdrClasses.formGroup. Only searches 3 levels above
       * the given element. If no element is found with this class, returns the parent of the given element.
       * @param element the element
       * @returns {*} the wrapping form group
       */
      findWrappingFormGroup: function (element) {
        var parent = element.parent();
        for (var i = 0; i < 3; i++) {
          if (parent.hasClass(valdrClasses.formGroup)) {
            return parent;
          } else {
            parent = parent.parent();
          }
        }
        return element.parent();
      }
    };
  }])
;