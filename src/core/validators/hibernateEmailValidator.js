angular.module('valdr')

  .factory('valdrHibernateEmailValidator', ['valdrUtil', function (valdrUtil) {
    var ATOM = '[a-z0-9!#$%&\'*+/=?^_`{|}~-]';
    var DOMAIN = '^' + ATOM + '+(\\.' + ATOM + '+)*$';
    var IP_DOMAIN = '^\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]$';

    var localPattern = new RegExp('^' + ATOM + '+(\\.' + ATOM + '+)*$', 'i');
    var domainPattern = new RegExp(DOMAIN + '|' + IP_DOMAIN, 'i');

    return {
      name: 'hibernateEmail',

      /**
       * Checks if the value is a valid email address using the same patterns as Hibernate uses in its bean validation
       * implementation.
       *
       * @param value the value to validate
       * @returns {boolean} true if valid
       */
      validate: function (value) {
        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        // split email at '@' and consider local and domain part separately
        var emailParts = value.split('@');
        if (emailParts.length !== 2) {
          return false;
        }

        if (!localPattern.test(emailParts[0])) {
          return false;
        }

        return domainPattern.test(emailParts[1]);
      }
    };
  }]);
