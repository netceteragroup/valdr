angular.module('ncaModelValidation')

  /**
   * Exposes lodash service for dependency injection.
   */
  .factory('lodash', ['$window', function ($window) {
// TODO: find out how to make this check work in unit tests
//    if (angular.isUndefined($window._)) {
//      throw new Error('angular-model-validation requires lodash but it could not be found');
//    }
    return $window._;
  }]);