angular.module('valdr')

  .factory('valdrEqualsFieldValidator', [function () {

    return {
      name: 'equalsField',

      /**
       * Checks if the matches another fields value.
       *
       * @param value the value to validate
       * @param constraint the constraint paramters
       * @param formValues the whole form
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint, formValues) {
        return (value === formValues[constraint.field]) || (!value && !formValues[constraint.field]);
      }
    };
  }]);
