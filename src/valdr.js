angular.module('valdr', ['ng'])
  .constant('valdrEvents', {
    'constraintsChanged': 'valdr-constraints-changed'
  })
  .value('valdrClasses', {
    'valid': 'has-success',
    'invalid': 'has-error'
  });