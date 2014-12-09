describe('valdrFormGroup directive', function () {

  // VARIABLES

  var $scope, $compile, element, valdr, valdrClasses, valdrConfig, ngModelController,
    personConstraints = {
      'Person': {
        'firstName': {
          'size': {
            'min': 0,
            'max': 10,
            'message': 'size'
          }
        },
        'lastName': {
          'size': {
            'min': 0,
            'max': 10,
            'message': 'size'
          }
        }
      }
    };

  var formGroupTemplate =
      '<form valdr-type="Person" valdr-form-group>' +
        '<input type="text" name="firstName" valdr-no-message ng-model="person.firstName">' +
        '<input type="text" name="lastName" valdr-no-message  ng-model="person.lastName">' +
      '</form>';

  // TEST UTILITIES

  function compileTemplate(template) {
    element = $compile(angular.element(template))($scope);
    $scope.$digest();
  }

  function compileFormGroupTemplate() {
    compileTemplate(formGroupTemplate);
    ngModelController = element.find('input').controller('ngModel');
  }

  beforeEach(function () {
    module('valdr');
  });

  beforeEach(inject(function ($rootScope, _$compile_, _valdr_, _valdrClasses_, _valdrConfig_) {
    $compile = _$compile_;
    valdr = _valdr_;
    valdrClasses = _valdrClasses_;
    valdrConfig = _valdrConfig_;

    $scope = $rootScope.$new();
    $scope.person = { };
    valdr.addConstraints(personConstraints);
  }));


  describe('valdrFormGroup', function () {

    beforeEach(function () {
      compileFormGroupTemplate();
    });

    describe('form-group class', function () {

      it ('should add form group class by default', function () {
        expect(element.hasClass(valdrClasses.formGroup)).toBe(true);
      });

      it ('should not add form group class if option is disabled in valdrConfig', function () {
        // given
        valdrConfig.addFormGroupClass = false;

        // when
        compileFormGroupTemplate();

        // then
        expect(element.hasClass(valdrClasses.formGroup)).toBe(false);
      });

    });

    it('should not set valid and invalidDirtyTouchedGroup classes if all items are valid', function () {
      expect(element.hasClass(valdrClasses.valid)).toBe(true);
      expect(element.hasClass(valdrClasses.invalid)).toBe(false);
      expect(element.hasClass(valdrClasses.invalidDirtyTouchedGroup)).toBe(false);
    });

    it('should not set invalid class if an item is not valid', function () {
      // given
      $scope.person.firstName = 'This name is too long for the constraints.';

      // when
      $scope.$digest();

      // then
      expect(element.hasClass(valdrClasses.invalid)).toBe(true);
      expect(element.hasClass(valdrClasses.valid)).toBe(false);
      expect(element.hasClass(valdrClasses.invalidDirtyTouchedGroup)).toBe(false);
    });

    it('should add invalidDirtyTouchedGroup class if an input is dirty, touched and invalid', function () {
      // given
      $scope.person.firstName = 'This name is too long for the constraints.';
      ngModelController.$invalid = true;
      ngModelController.$dirty = true;
      ngModelController.$touched = true;

      // when
      $scope.$digest();

      // then
      expect(element.hasClass(valdrClasses.invalid)).toBe(true);
      expect(element.hasClass(valdrClasses.valid)).toBe(false);
      expect(element.hasClass(valdrClasses.invalidDirtyTouchedGroup)).toBe(true);
    });

    it('should be valid if no form items are registered', function () {
      // given
      var template = '<form valdr-type="Person" valdr-form-group></form>';

      // when
      compileTemplate(template);

      // then
      expect(element.hasClass(valdrClasses.valid)).toBe(true);
      expect(element.hasClass(valdrClasses.invalid)).toBe(false);
      expect(element.hasClass(valdrClasses.invalidDirtyTouchedGroup)).toBe(false);
    });
  });

});