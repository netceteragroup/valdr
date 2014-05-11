angular.module('valdr')

  .factory('valdrHibernateUrlValidator', ['valdrUrlValidator', function (valdrUrlValidator) {

    return {
      name: 'hibernateUrl',

      /**
       * Checks if the value is a valid URL according to the internal URL validator. It'll also ignore the Hibernate
       * properties protocol, host, and port. See https://github.com/netceteragroup/valdr/issues/27 for the rational
       * behind this implementation.
       *
       * @param value the value to validate
       * @returns {boolean} true if valid
       */
      validate: function (value) {
        return valdrUrlValidator.validate(value);
      }
    };
  }]);
