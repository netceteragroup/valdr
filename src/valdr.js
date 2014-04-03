angular.module('valdr', ['ng'])
  .constant('valdrEvents', {
    'revalidate': 'valdr-revalidate'
  })
  .value('valdrClasses', {
    valid: 'has-success',
    invalid: 'has-error',
    dirtyBlurred: 'dirty-blurred'
  });