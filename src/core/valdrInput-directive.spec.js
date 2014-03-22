describe('nca input directive', function () {

  var $scope, element, $compile, ngModelController, valdrValidator, valdrEvents,
    validationMessages = ['validationMessagesArray'];

  beforeEach(function () {
    module('valdr');

    /**
     * Mock the valdrValidator to always return 'true' when the value equals the string 'valid'.
     */
    module(function ($provide) {
      $provide.value('valdrValidator', {
        validate: function (typeName, fieldName, value) {
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
      '<form name="demoForm"><div valdr-type="TestClass">' +
        '<input type="text" name="fieldName" ng-model="myObject.field">' +
      '</div></form>'))($scope);
    $scope.$digest();
    return element;
  };

  beforeEach(inject(function ($rootScope, _$compile_, _valdrValidator_, _valdrEvents_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.myObject = { field: 'fieldValue' };
    element = compileTemplate();
    ngModelController = element.find('input').controller('ngModel');
    valdrValidator = _valdrValidator_;
    valdrEvents = _valdrEvents_;
  }));

  it('should set the validity to false on ngModelController if validation fails', function () {
    // when
    $scope.$apply(function () {
      $scope.myObject.field = 'invalid';
    });

    // then
    expect(ngModelController.$valid).toBe(false);
    expect(ngModelController.valdrMessages).toBe(validationMessages);
  });

  it('should set the validity to true on ngModelController if validation is ok', function () {
    // when
    $scope.$apply(function () {
      $scope.myObject.field = 'valid';
    });

    // then
    expect(ngModelController.$valid).toBe(true);
    expect(ngModelController.valdrMessages).toBe(validationMessages);
  });

  it('should throw error if no field name is provided on the input', function () {
    // given
    var invalidInput =
      '<form name="demoForm"><div valdr-type="TestClass">' +
        '<input type="text" ng-model="myObject.field">' +
      '</div></form>';

    // when / then
    expect(function () {
      $compile(angular.element(invalidInput))($scope);
    }).toThrow(new Error('input is not bound to a field name'));
  });

  it('should handle validation rule changed events', function () {
    // given
    spyOn(valdrValidator, 'validate').andCallThrough();

    // when
    $scope.$broadcast(valdrEvents.rulesChanged);

    // then
    expect(valdrValidator.validate).toHaveBeenCalled();
  });

});