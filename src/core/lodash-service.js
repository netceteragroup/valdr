angular.module('ncaModelValidation')

  /**
   * Exposes lodash as _ for dependency injection.
   */
  .factory('lodash', function ($window) {
    return $window._;
  });