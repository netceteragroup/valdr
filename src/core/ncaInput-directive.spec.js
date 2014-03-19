'use strict';

describe('orcaInput directive', function () {

  var $scope, element, $compile, ngModelController,
    validationMessages = ['validationMessagesArray'];

  beforeEach(function () {
    module('orca.common.validation');

    /**
     * Mock the orcaValidator to always return 'true' when the value equals the string 'valid'.
     */
    module(function ($provide) {
      $provide.value('orcaValidator', {
        validate: function (className, fieldName, value) {
          return {
            valid: value === 'valid',
            messages: validationMessages
          };
        }
      });
    });
  });

  var compileTemplate = function () {
    var element = $compile(angular.element(
      '<form name="demoForm"><div orca-form-class="com.netcetera.TestClass">' +
        '<input type="text" name="fieldName" ng-model="myObject.field" no-message>' +
      '</div></form>'))($scope);
    $scope.$digest();
    return element;
  };

  beforeEach(inject(function ($rootScope, _$compile_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.myObject = { field: 'fieldValue' };
    element = compileTemplate();
    ngModelController = element.find('input').controller('ngModel');
  }));

  it('should set the validity to false on ngModelController if validation fails', function () {
    // when
    $scope.$apply(function () {
      $scope.myObject.field = 'invalid';
    });

    // then
    expect(ngModelController.$valid).toBe(false);
    expect(ngModelController.orcaValidationMessages).toBe(validationMessages);
  });

  it('should set the validity to true on ngModelController if validation is ok', function () {
    // when
    $scope.$apply(function () {
      $scope.myObject.field = 'valid';
    });

    // then
    expect(ngModelController.$valid).toBe(true);
    expect(ngModelController.orcaValidationMessages).toBe(validationMessages);
  });

  it('should throw error if no field name is provided on the input', function () {
    // given
    var invalidInput =
      '<form name="demoForm"><div orca-form-class="com.netcetera.TestClass">' +
        '<input type="text" ng-model="myObject.field" no-message>' +
      '</div></form>';

    // when / then
    expect(function () {
      $compile(angular.element(invalidInput))($scope);
    }).toThrow(new Error('orcaFormField is not bound to a field name'));
  });

});