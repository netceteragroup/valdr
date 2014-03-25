angular.module('valdr', ['ng'])
  .constant('valdrEvents', {
    'constraintsChanged': 'valdr-constraints-changed'
  })
  .constant('valdrClasses', {
    'valid': 'is-valid',
    'invalid': 'is-invalid'
  });