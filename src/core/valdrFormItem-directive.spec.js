describe('valdrFormItem directive', function () {

  // VARIABLES

  var $scope, $compile, element, valdr, valdrEvents, valdrClasses, ngModelController,
    violations = ['violationsArray'];

  var inputTemplate =
    '<form name="demoForm">' +
      '<div valdr-type="TestClass">' +
        '<input type="text" name="fieldName" ng-model="myObject.field">' +
      '</div>' +
    '</form>';

  var selectTemplate =
    '<form name="demoForm">' +
      '<div valdr-type="TestClass">' +
        '<select name="fieldName" ng-model="myObject.field">' +
          '<option value></option>' +
          '<option value="1">First</option>' +
          '<option value="2">Second</option>' +
        '</select>' +
      '</div>' +
    '</form>';

  // TEST UTILITIES

  function compileTemplate (template) {
    element = $compile(angular.element(template))($scope);
    $scope.$digest();
  }

  function compileInputTemplate () {
    compileTemplate(inputTemplate);
    ngModelController = element.find('input').controller('ngModel');
  }

  // COMMON SETUP

  beforeEach(function () {
    module('valdr');

    /**
     * Mock the valdr to always return 'true' when the value equals the string 'valid'.
     */
    module(function ($provide) {
      $provide.value('valdr', {
        validate: function (typeName, fieldName, value) {
          return {
            valid: value === 'valid',
            violations: violations
          };
        }
      });
    });
  });

  beforeEach(inject(function ($rootScope, _$compile_, _valdr_, _valdrEvents_, _valdrClasses_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.myObject = { field: 'fieldValue' };
    valdr = _valdr_;
    valdrEvents = _valdrEvents_;
    valdrClasses = _valdrClasses_;
  }));

  // COMMON TESTS

  function runFormItemCommonTests () {
    it('should set the validity to false on ngModelController if validation fails', function () {
      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'invalid';
      });

      // then
      expect(ngModelController.$valid).toBe(false);
      expect(ngModelController.valdrViolations).toBe(violations);
    });

    it('should set the validity to true on ngModelController if validation is ok', function () {
      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'valid';
      });

      // then
      expect(ngModelController.$valid).toBe(true);
      expect(ngModelController.valdrViolations).toBe(violations);
    });

    it('should add class to surrounding element if data is valid', function () {
      // given
      var surroundingElement = element.find('div');

      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'valid';
      });

      // then
      expect(surroundingElement.hasClass(valdrClasses.valid)).toBe(true);
      expect(surroundingElement.hasClass(valdrClasses.invalid)).toBe(false);
    });

    it('should add class to surrounding element if data is invalid', function () {
      // given
      var surroundingElement = element.find('div');

      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'invalid';
      });

      // then
      expect(surroundingElement.hasClass(valdrClasses.invalid)).toBe(true);
      expect(surroundingElement.hasClass(valdrClasses.valid)).toBe(false);
    });


    it('should handle constraint changed events', function () {
      // given
      spyOn(valdr, 'validate').andCallThrough();

      // when
      $scope.$broadcast(valdrEvents.revalidate);

      // then
      expect(valdr.validate).toHaveBeenCalled();
    });
  }

  describe('on input fields', function () {

    beforeEach(function (){
      compileInputTemplate();
    });

    runFormItemCommonTests();

    it('should throw error if no field name is provided on the input', function () {
      // given
      var invalidInput =
        '<form name="demoForm"><div valdr-type="TestClass">' +
        '<input type="text" ng-model="myObject.field">' +
        '</div></form>';

      // when / then
      expect(function () {
        $compile(angular.element(invalidInput))($scope);
      }).toThrow(new Error('form element is not bound to a field name'));
    });
  });

  describe('on select elements', function () {

    beforeEach(function (){
      compileTemplate(selectTemplate);
      ngModelController = element.find('select').controller('ngModel');
    });

    runFormItemCommonTests();

  });

  describe('blur behavior', function () {
    var input, surroundingElement;

    beforeEach(function () {
      compileInputTemplate();
      input = element.find('input');
      surroundingElement = element.find('div');
    });

    it('should add dirtyBlurred class when the model is dirty, invalid and the input gets blurred', function () {
      // given
      ngModelController.$dirty = true;
      ngModelController.$invalid = true;
      ngModelController.$valid = false;

      // when
      input.triggerHandler('blur');

      // then
      expect(surroundingElement.hasClass(valdrClasses.dirtyBlurred)).toBe(true);
    });

    it('should add not dirtyBlurred class when the model is pristine, invalid and the input gets blurred', function () {
      // given
      ngModelController.$dirty = false;
      ngModelController.$invalid = true;
      ngModelController.$valid = false;

      // when
      input.triggerHandler('blur');

      // then
      expect(surroundingElement.hasClass(valdrClasses.dirtyBlurred)).toBe(false);
    });

    it('should add not dirtyBlurred class when the model is dirty, valid and the input gets blurred', function () {
      // given
      ngModelController.$dirty = true;
      ngModelController.$invalid = false;
      ngModelController.$valid = true;

      // when
      input.triggerHandler('blur');

      // then
      expect(surroundingElement.hasClass(valdrClasses.dirtyBlurred)).toBe(false);
    });

  });

});