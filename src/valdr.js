angular.module('valdr', ['ng'])
  .constant('valdrEvents', {
    'revalidate': 'valdr-revalidate'
  })
  .value('valdrConfig', {
    addFormGroupClass: true
  })
  .value('valdrClasses', {
    formGroup: 'form-group',
    valid: 'ng-valid',
    invalid: 'ng-invalid',
    dirty: 'ng-dirty',
    pristine: 'ng-pristine',
    touched: 'ng-touched',
    untouched: 'ng-untouched',
    invalidDirtyTouchedGroup: 'valdr-invalid-dirty-touched-group'
  });